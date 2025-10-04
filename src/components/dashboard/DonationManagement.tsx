import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  Search,
  Filter,
  Download
} from "lucide-react";

interface Donation {
  id: string;
  donor_name: string | null;
  email: string | null;
  phone: string | null;
  amount: number;
  donation_type: string;
  purpose: string | null;
  is_anonymous: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

const DonationManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch donations
  const { data: donations, isLoading } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Donation[];
    },
  });

  // Update donation status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("donations")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast({
        title: "Status Updated",
        description: "Donation status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update donation status.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      completed: { variant: "default" as const, label: "Completed" },
      failed: { variant: "destructive" as const, label: "Failed" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredDonations = donations?.filter(donation => {
    const matchesSearch = 
      donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || donation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const totalAmount = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
  const completedDonations = donations?.filter(d => d.status === "completed").length || 0;

  if (isLoading) {
    return <div className="p-6">Loading donations...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {donations?.length || 0} donations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDonations}</div>
            <p className="text-xs text-muted-foreground">
              Successful donations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${donations?.length ? Math.round(totalAmount / donations.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per donation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Management</CardTitle>
          <CardDescription>
            Manage and track all donations to your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Donations</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by donor name, email, or purpose..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Donations Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No donations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div className="font-medium">
                          {donation.is_anonymous ? "Anonymous" : donation.donor_name || "Unknown"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {donation.email}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${donation.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {donation.donation_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {donation.purpose || "General"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(donation.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(donation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedDonation(donation)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Donation Details</DialogTitle>
                            </DialogHeader>
                            {selectedDonation && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Donor Information</Label>
                                  <div className="text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {selectedDonation.is_anonymous ? "Anonymous" : selectedDonation.donor_name}
                                    </div>
                                    {selectedDonation.email && (
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {selectedDonation.email}
                                      </div>
                                    )}
                                    {selectedDonation.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {selectedDonation.phone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Donation Details</Label>
                                  <div className="text-sm space-y-1">
                                    <div>Amount: ${selectedDonation.amount.toFixed(2)}</div>
                                    <div>Type: {selectedDonation.donation_type}</div>
                                    <div>Purpose: {selectedDonation.purpose || "General"}</div>
                                    <div>Date: {new Date(selectedDonation.created_at).toLocaleString()}</div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Update Status</Label>
                                  <Select
                                    value={selectedDonation.status}
                                    onValueChange={(status) => 
                                      updateStatusMutation.mutate({ 
                                        id: selectedDonation.id, 
                                        status 
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationManagement;