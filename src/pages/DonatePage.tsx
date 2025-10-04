import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, 
  Users, 
  Trophy, 
  BookOpen, 
  Building,
  DollarSign,
  CreditCard,
  Loader2,
  Shield,
  CheckCircle
} from "lucide-react";

const DonatePage = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: "",
    donor_email: "",
    amount: "",
    donation_type: "one-time",
    purpose: "",
    is_anonymous: false,
  });

  const impactAreas = [
    {
      title: "Youth Training Programs",
      description: "Support professional coaching and equipment for young athletes",
      icon: Trophy,
      impact: "$50 provides training equipment for one youth for a month",
    },
    {
      title: "Educational Scholarships",
      description: "Fund TVET programs and educational opportunities",
      icon: BookOpen,
      impact: "$100 covers course materials for one student",
    },
    {
      title: "Community Events",
      description: "Organize sports competitions and cultural activities",
      icon: Users,
      impact: "$25 helps organize community fitness events",
    },
    {
      title: "Facility Development",
      description: "Improve training facilities and community centers",
      icon: Building,
      impact: "$200 contributes to facility improvements",
    },
  ];

  const presetAmounts = [25, 50, 100, 250, 500, 1000];

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const amount = parseFloat(formData.amount);
      
      // Record donation attempt in database for tracking
      const { error: dbError } = await supabase
        .from('donations')
        .insert({
          donor_name: formData.is_anonymous ? 'Anonymous' : formData.donor_name,
          donor_email: formData.donor_email,
          amount: amount,
          donation_type: formData.donation_type,
          purpose: formData.purpose || 'general',
          is_anonymous: formData.is_anonymous,
          status: 'pending'
        });

      if (dbError) {
        console.warn('Failed to record donation attempt:', dbError);
      }

      // Redirect to PayPal.me link with amount
      const paypalUrl = `https://www.paypal.me/alainpromethee/${amount}`;
      window.open(paypalUrl, '_blank');
      
      toast({
        title: "Redirecting to PayPal",
        description: "Complete your donation in the new tab that opened.",
      });
      
      // Reset form after successful initiation
      setFormData({
        donor_name: "",
        donor_email: "",
        amount: "",
        donation_type: "one-time",
        purpose: "",
        is_anonymous: false,
      });
    } catch (error: any) {
      console.error('Donation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Support Our Mission
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your generous donation helps us empower youth through sports training, educational 
            programs, and community development initiatives. Every contribution makes a difference 
            in young lives.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Heart className="mr-3 h-6 w-6 text-primary" />
                  Make a Donation
                </CardTitle>
                <CardDescription>
                  Choose your donation amount and help us create lasting impact in our community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Donation Type */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Donation Type</Label>
                    <RadioGroup
                      value={formData.donation_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, donation_type: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time">One-time donation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly recurring</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly">Yearly recurring</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Donation Amount (USD)</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={formData.amount === amount.toString() ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amount)}
                          className="h-12"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Enter custom amount"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                      Donor Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="donor_name">Full Name *</Label>
                        <Input
                          id="donor_name"
                          value={formData.donor_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, donor_name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="donor_email">Email Address *</Label>
                        <Input
                          id="donor_email"
                          type="email"
                          value={formData.donor_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, donor_email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="space-y-4">
                    <Label htmlFor="purpose">Donation Purpose (Optional)</Label>
                    <Select
                      value={formData.purpose}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose where you'd like your donation to go" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Support</SelectItem>
                        <SelectItem value="youth-training">Youth Training Programs</SelectItem>
                        <SelectItem value="education">Educational Scholarships</SelectItem>
                        <SelectItem value="community-events">Community Events</SelectItem>
                        <SelectItem value="facility-development">Facility Development</SelectItem>
                        <SelectItem value="equipment">Sports Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Anonymous Donation */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={formData.is_anonymous}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_anonymous: checked as boolean }))}
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      Make this donation anonymous
                    </Label>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Secure Payment Processing
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your payment information is encrypted and secure. We use industry-standard 
                          security measures to protect your data.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isProcessing || !formData.amount}
                      className="bg-gradient-to-r from-primary to-accent min-w-48"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Donate ${formData.amount || "0"}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      You will receive a confirmation email with your donation receipt.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Impact Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Impact</CardTitle>
                <CardDescription>
                  See how your donation helps our community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {impactAreas.map((area, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <area.icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <h4 className="text-sm font-medium text-foreground">{area.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">
                      {area.impact}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>


            {/* Bank Transfer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bank Transfer</CardTitle>
                <CardDescription>
                  You can also donate directly via bank transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">BANK NAME</p>
                    <p className="text-sm font-medium text-foreground">BANK OF KIGALI LTD</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">ACCOUNT NUMBER</p>
                    <p className="text-sm font-medium text-foreground">100232327299/RWF</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">ACCOUNT NAME</p>
                    <p className="text-sm font-medium text-foreground">EJO HEZA SPORT TRAINING ORGANIZATION</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please include your name and contact information in the transfer reference for receipt purposes.
                </p>
              </CardContent>
            </Card>

            {/* Other Ways to Give */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other Ways to Give</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">In-Kind Donations</h4>
                  <p className="text-xs text-muted-foreground">
                    Sports equipment, training materials, and educational resources are always needed.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Corporate Partnerships</h4>
                  <p className="text-xs text-muted-foreground">
                    Partner with us for sponsorship opportunities and employee engagement programs.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Fundraising Events</h4>
                  <p className="text-xs text-muted-foreground">
                    Organize fundraising events in your community to support our mission.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
