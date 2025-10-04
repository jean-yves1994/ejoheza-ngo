import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";

const NewsPage = () => {
  const { data: news, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="grid gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            News & Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay up to date with the latest happenings at EJO Heza Sports Training Organization.
          </p>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {news && news.length > 0 ? (
            <div className="grid gap-8 max-w-4xl mx-auto">
              {news.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">News</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(article.created_at), 'MMMM d, yyyy')}
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{article.title}</CardTitle>
                    {article.author && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        By {article.author}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      {article.content?.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index} className="mb-4 text-muted-foreground">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">No News Available</h2>
              <p className="text-muted-foreground">
                Check back soon for the latest updates from our organization.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;