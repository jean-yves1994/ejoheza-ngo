import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Heart, Clock, Award, CheckCircle, Loader2 } from "lucide-react";

const VolunteerPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    skills: [] as string[],
    availability: "",
    motivation: "",
    experience: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  const skillsOptions = [
    "Coaching/Training",
    "Event Organization",
    "Marketing/Social Media",
    "Photography/Videography",
    "Administration",
    "Financial Management",
    "IT/Technology",
    "Translation",
    "Medical/First Aid",
    "Transportation",
    "Fundraising",
    "Mentoring/Counseling",
  ];

  const opportunityAreas = [
    {
      title: "Sports Coaching",
      description: "Help train and mentor young athletes in various sports disciplines",
      icon: Award,
      commitment: "2-3 hours/week",
      skills: "Sports background, patience, leadership"
    },
    {
      title: "Event Support",
      description: "Assist with organizing and running community sports events and competitions",
      icon: Users,
      commitment: "Flexible",
      skills: "Organization, teamwork, communication"
    },
    {
      title: "Youth Mentoring",
      description: "Provide guidance and support to young participants in our programs",
      icon: Heart,
      commitment: "1-2 hours/week",
      skills: "Empathy, communication, reliability"
    },
    {
      title: "Administrative Support",
      description: "Help with office tasks, data entry, and program coordination",
      icon: Clock,
      commitment: "Flexible",
      skills: "Computer skills, organization, attention to detail"
    },
  ];

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      skills: checked 
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("volunteers").insert({
        ...formData,
        user_id: user?.user?.id || null,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in volunteering. We'll review your application and contact you soon.",
      });

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
        skills: [],
        availability: "",
        motivation: "",
        experience: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Volunteer With Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join our dedicated team of volunteers and help us empower youth through sports, 
            cultural activities, and community engagement. Your time and skills can make a 
            real difference in young lives.
          </p>
        </div>

        {/* Volunteer Opportunities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Volunteer Opportunities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunityAreas.map((opportunity, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <opportunity.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm leading-relaxed">
                    {opportunity.description}
                  </CardDescription>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Time: {opportunity.commitment}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Skills: {opportunity.skills}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Volunteer Application Form</CardTitle>
              <CardDescription className="text-center">
                Please fill out this form to apply for volunteer opportunities with EJO Heza.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Skills and Availability */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Skills & Availability
                  </h3>
                  <div>
                    <Label className="text-base mb-4 block">Skills & Interests (Select all that apply)</Label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {skillsOptions.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={formData.skills.includes(skill)}
                            onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                          />
                          <Label htmlFor={skill} className="text-sm font-normal">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability *</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekdays-morning">Weekdays - Morning</SelectItem>
                        <SelectItem value="weekdays-afternoon">Weekdays - Afternoon</SelectItem>
                        <SelectItem value="weekdays-evening">Weekdays - Evening</SelectItem>
                        <SelectItem value="weekends-morning">Weekends - Morning</SelectItem>
                        <SelectItem value="weekends-afternoon">Weekends - Afternoon</SelectItem>
                        <SelectItem value="weekends-evening">Weekends - Evening</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Experience and Motivation */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Experience & Motivation
                  </h3>
                  <div>
                    <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                      rows={4}
                      placeholder="Tell us about your motivation to volunteer and what you hope to contribute..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      rows={4}
                      placeholder="Describe any relevant volunteer, work, or life experience..."
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Emergency Contact
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                      <Input
                        id="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                      <Input
                        id="emergency_contact_phone"
                        type="tel"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-accent min-w-48"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-5 w-5" />
                        Submit Application
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    We'll review your application and contact you within 5-7 business days.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default VolunteerPage;