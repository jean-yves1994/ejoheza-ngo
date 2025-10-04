import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Trophy,
  BookOpen,
  Handshake
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-youth-sports.jpg";

const HomePage = () => {
  // Fetch latest news
  const { data: news } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch upcoming events
  const { data: events } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "active")
        .order("event_date", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const impactStats = [
    { label: "Youth Trained", value: "500+", icon: Users },
    { label: "Programs Running", value: "15", icon: Target },
    { label: "Community Events", value: "50+", icon: Calendar },
    { label: "Success Stories", value: "200+", icon: Award },
  ];

  const programs = [
    {
      title: "Football Academy",
      description: "Professional football training for youth aged 12-18 with experienced coaches",
      icon: Trophy,
      color: "bg-primary",
    },
    {
      title: "Youth Center",
      description: "Arts, entertainment, and talent development programs for creative expression",
      icon: Users,
      color: "bg-accent",
    },
    {
      title: "TVET School",
      description: "Technical education in sports management, coaching, and fitness training",
      icon: BookOpen,
      color: "bg-secondary",
    },
    {
      title: "Community Fitness",
      description: "Monthly fitness events and long-term wellness programs for all ages",
      icon: Heart,
      color: "bg-muted",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Rwandan youth playing sports"
            className="w-full h-full object-cover"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-background/60"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6">
              <div className="flex justify-center">
                <Badge variant="secondary" className="w-fit">
                  <Users className="h-4 w-4 mr-2" />
                  Since 2024 • Youth Development
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Empowering Youth Through
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {" "}Sports Excellence
                </span>
              </h1>
              <p className="text-lg text-foreground leading-relaxed font-medium">
                EJO Heza Sport Training Organization nurtures young talent through comprehensive 
                sports training, cultural engagement, and educational opportunities. Join us in 
                building vibrant communities where sports culture thrives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/get-involved">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    Get Involved
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button variant="outline" size="lg">
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Our Mission</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To empower youth through top-tier sports training programs, educational opportunities, 
              and entertainment, while creating pathways for personal growth, social inclusion, 
              and professional sports careers.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  Commitment to providing world-class sports training and education
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full">
                  <Handshake className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Inclusion</h3>
                <p className="text-sm text-muted-foreground">
                  Promoting gender equality and accessibility to all community members
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Building strong ties and promoting active lifestyles within communities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Our Programs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive programs designed to nurture talent, build character, 
              and create opportunities for youth development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${program.color} rounded-lg mb-4`}>
                    <program.icon className="h-6 w-6 text-background" />
                  </div>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {program.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      {news && news.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Latest News</h2>
                <p className="text-lg text-muted-foreground">
                  Stay updated with our latest activities and achievements
                </p>
              </div>
              <Link to="/news">
                <Button variant="outline">
                  View All News
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((post) => (
                <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.content ? post.content.substring(0, 150) + '...' : 'No content available'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events && events.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
                <p className="text-lg text-muted-foreground">
                  Join our community events and training programs
                </p>
              </div>
              <Link to="/events">
                <Button variant="outline">
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        Event
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBD'}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {event.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          {event.location}
                        </div>
                      )}
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Join our community of supporters, volunteers, and advocates working to empower 
              youth through sports and create lasting positive change in our communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/volunteer">
                <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                  <Users className="mr-2 h-5 w-5" />
                  Become a Volunteer
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Heart className="mr-2 h-5 w-5" />
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;