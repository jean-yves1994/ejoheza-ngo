import { Users, Target, Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest standards in sports training and development."
    },
    {
      icon: Users,
      title: "Inclusion",
      description: "Creating opportunities for all youth, regardless of background or ability."
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building strong connections and supporting our local community."
    },
    {
      icon: Award,
      title: "Growth",
      description: "Fostering both athletic and personal development in every participant."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About EJO Heza
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering youth through sports training, community engagement, and personal development programs.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                EJO Heza Sport Training Organization is dedicated to empowering youth through comprehensive 
                sports training programs that foster athletic excellence, personal growth, and community engagement.
              </p>
              <p className="text-muted-foreground">
                We believe that sports have the power to transform lives, build character, and create 
                lasting positive change in our communities. Through our programs, we aim to develop 
                not just skilled athletes, but confident, resilient, and compassionate young leaders.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To be the leading sports training organization that creates pathways for youth to 
                achieve their full potential through sports, education, and community service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These fundamental principles guide everything we do and shape our approach to youth development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="space-y-8">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">Founded on Passion</h3>
                <p className="text-muted-foreground">
                  EJO Heza was born from a simple belief: every young person deserves the opportunity 
                  to discover their potential through sports. Our founders saw the transformative power 
                  of athletics in their own lives and wanted to share that gift with their community.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">Growing Impact</h3>
                <p className="text-muted-foreground">
                  What started as a small local initiative has grown into a comprehensive organization 
                  serving hundreds of youth each year. We've expanded our programs to include not just 
                  sports training, but also mentorship, educational support, and community service opportunities.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">Looking Forward</h3>
                <p className="text-muted-foreground">
                  As we continue to grow, our commitment remains unchanged: to provide every young 
                  person with the support, training, and opportunities they need to thrive both on 
                  and off the field. Together, we're building stronger communities, one athlete at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;