import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DonationSuccessPage = () => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Thank you for your donation!",
      description: "Your contribution helps us continue our mission of empowering youth through sports.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center space-y-6">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground">
                Donation Successful!
              </CardTitle>
              <CardDescription className="text-lg">
                Thank you for supporting EJO Heza Sport Training Organization
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">What happens next?</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• Your donation will directly support youth training programs</li>
                  <li>• We'll keep you updated on how your contribution makes a difference</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="w-full sm:w-auto">
                    Return Home
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Heart className="mr-2 h-4 w-4" />
                    Make Another Donation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessPage;