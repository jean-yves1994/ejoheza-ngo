import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayPalOrderRequest {
  amount: number;
  donorInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  isAnonymous: boolean;
  purpose?: string;
  donationType: 'one-time' | 'monthly';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, donorInfo, isAnonymous, purpose, donationType }: PayPalOrderRequest = await req.json();

    // Get PayPal access token
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const baseURL = 'https://api-m.sandbox.paypal.com'; // Use https://api-m.paypal.com for production

    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // Get PayPal OAuth token
    const authResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    const authData = await authResponse.json();
    
    if (!authData.access_token) {
      throw new Error('Failed to get PayPal access token');
    }

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2)
        },
        description: purpose || 'Donation'
      }],
      application_context: {
        return_url: `${new URL(req.url).origin}/donation-success`,
        cancel_url: `${new URL(req.url).origin}/donate`,
        brand_name: 'Your Organization',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    };

    const orderResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`,
        'PayPal-Request-Id': crypto.randomUUID(),
      },
      body: JSON.stringify(orderData)
    });

    const order = await orderResponse.json();

    if (!order.id) {
      console.error('PayPal order creation failed:', order);
      throw new Error('Failed to create PayPal order');
    }

    // Store donation record in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: donation, error } = await supabase
      .from('donations')
      .insert({
        donor_name: isAnonymous ? 'Anonymous' : donorInfo.name,
        email: donorInfo.email,
        phone: donorInfo.phone,
        amount: amount,
        donation_type: donationType,
        purpose: purpose,
        is_anonymous: isAnonymous,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing donation:', error);
    }

    // Get approval URL
    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href;

    return new Response(
      JSON.stringify({
        orderId: order.id,
        approvalUrl: approvalUrl,
        donationId: donation?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('PayPal order creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});