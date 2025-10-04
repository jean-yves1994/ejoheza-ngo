import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Heart, 
  FileText, 
  Calendar,
  TrendingUp,
  DollarSign,
  UserCheck,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import DonationManagement from "@/components/dashboard/DonationManagement";
import EventManagement from "@/components/dashboard/EventManagement";
import ContentManagement from "@/components/dashboard/ContentManagement";

// Overview Component
const DashboardOverview = () => {
  const { toast } = useToast();

  // Fetch overview statistics
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [volunteersResult, donationsResult, newsResult, eventsResult] = await Promise.all([
        supabase.from("volunteers").select("*", { count: "exact" }),
        supabase.from("donations").select("amount", { count: "exact" }),
        supabase.from("news_posts").select("*", { count: "exact" }),
        supabase.from("events").select("*", { count: "exact" }),
      ]);

      const totalDonations = donationsResult.data?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;

      return {
        volunteers: volunteersResult.count || 0,
        donations: donationsResult.count || 0,
        totalDonationAmount: totalDonations,
        news: newsResult.count || 0,
        events: eventsResult.count || 0,
      };
    },
  });

  // Fetch volunteers
  const { data: volunteers } = useQuery({
    queryKey: ["dashboard-volunteers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch donations
  const { data: donations } = useQuery({
    queryKey: ["dashboard-donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch news posts
  const { data: newsPosts } = useQuery({
    queryKey: ["dashboard-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Update volunteer status
  const updateVolunteerStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("volunteers")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Volunteer application ${status} successfully.`,
      });

      // Refetch data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getDonationStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.volunteers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Applications received
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalDonationAmount?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">
              From {stats?.donations || 0} donations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.news || 0}</div>
            <p className="text-xs text-muted-foreground">
              Published articles
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Volunteer Applications</CardTitle>
            <CardDescription>Latest applications requiring review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {volunteers?.slice(0, 5).map((volunteer) => (
                <div key={volunteer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{volunteer.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{volunteer.email}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {getStatusBadge(volunteer.status)}
                  </div>
                </div>
              ))}
              {(!volunteers || volunteers.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">No volunteer applications yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest donations received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donations?.slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {donation.is_anonymous ? "Anonymous" : donation.donor_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${Number(donation.amount).toFixed(2)} • {donation.donation_type}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {getDonationStatusBadge(donation.status)}
                  </div>
                </div>
              ))}
              {(!donations || donations.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">No donations yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Volunteers Management Component
const VolunteersManagement = () => {
  const { toast } = useToast();

  // Fetch volunteers
  const { data: volunteers, refetch } = useQuery({
    queryKey: ["dashboard-volunteers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Update volunteer status
  const updateVolunteerStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("volunteers")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Volunteer application ${status} successfully.`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Applications</CardTitle>
          <CardDescription>Manage and review volunteer applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteers?.map((volunteer) => (
              <div key={volunteer.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h4 className="text-lg font-semibold truncate">{volunteer.full_name}</h4>
                      {getStatusBadge(volunteer.status)}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p><strong>Email:</strong> <span className="break-all">{volunteer.email}</span></p>
                        <p><strong>Phone:</strong> {volunteer.phone}</p>
                        <p><strong>Availability:</strong> {volunteer.availability}</p>
                      </div>
                      <div className="space-y-1">
                        <p><strong>Skills:</strong> {volunteer.skills?.join(", ") || "None specified"}</p>
                        <p><strong>Applied:</strong> {new Date(volunteer.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {volunteer.motivation && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Motivation:</p>
                        <p className="text-sm text-muted-foreground mt-1">{volunteer.motivation}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {volunteer.status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => updateVolunteerStatus(volunteer.id, "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => updateVolunteerStatus(volunteer.id, "rejected")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {(!volunteers || volunteers.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No volunteer applications found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Dashboard Page Component
const DashboardPage = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/volunteers" element={<VolunteersManagement />} />
        <Route path="/donations" element={<DonationManagement />} />
        <Route path="/content" element={<ContentManagement />} />
        <Route path="/events" element={<EventManagement />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;