import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Campaign } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Users, BarChart, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // State for organization approval
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  // State for campaign approval
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [isCampaignApproveDialogOpen, setIsCampaignApproveDialogOpen] = useState(false);
  const [isCampaignRejectDialogOpen, setIsCampaignRejectDialogOpen] = useState(false);
  
  // Check if user is admin
  if (user && user.userType !== "admin") {
    setLocation("/dashboard");
    return null;
  }
  
  // Fetch all organizations
  const { 
    data: organizations = [], 
    isLoading: isLoadingOrganizations 
  } = useQuery<User[]>({
    queryKey: ["/api/admin/organizations"],
    enabled: !!user && user.userType === "admin",
  });
  
  // Fetch pending approval campaigns
  const { 
    data: pendingCampaigns = [],
    isLoading: isLoadingCampaigns 
  } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/campaigns/pending"],
    enabled: !!user && user.userType === "admin",
  });
  
  // Organization approval mutation
  const approveOrganizationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOrganizationId) return null;
      return apiRequest("PATCH", `/api/admin/organizations/${selectedOrganizationId}/approve`);
    },
    onSuccess: () => {
      toast({
        title: "Organization approved",
        description: "The organization has been successfully approved",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      setIsApproveDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve the organization",
        variant: "destructive",
      });
    }
  });
  
  // Organization rejection mutation
  const rejectOrganizationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOrganizationId) return null;
      return apiRequest("PATCH", `/api/admin/organizations/${selectedOrganizationId}/reject`);
    },
    onSuccess: () => {
      toast({
        title: "Organization rejected",
        description: "The organization has been rejected",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      setIsRejectDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject the organization",
        variant: "destructive",
      });
    }
  });
  
  // Campaign approval mutation
  const approveCampaignMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCampaignId) return null;
      return apiRequest("PATCH", `/api/admin/campaigns/${selectedCampaignId}/approve`);
    },
    onSuccess: () => {
      toast({
        title: "Campaign approved",
        description: "The campaign has been successfully approved",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns/pending"] });
      setIsCampaignApproveDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve the campaign",
        variant: "destructive",
      });
    }
  });
  
  // Campaign rejection mutation
  const rejectCampaignMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCampaignId) return null;
      return apiRequest("PATCH", `/api/admin/campaigns/${selectedCampaignId}/reject`);
    },
    onSuccess: () => {
      toast({
        title: "Campaign rejected",
        description: "The campaign has been rejected",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns/pending"] });
      setIsCampaignRejectDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject the campaign",
        variant: "destructive",
      });
    }
  });
  
  // Helper to format dates
  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };
  
  if (!user || isLoadingOrganizations || isLoadingCampaigns) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // Filter organizations
  const pendingOrganizations = organizations.filter(org => 
    org.userType === "organization" && !org.isApproved
  );
  
  const approvedOrganizations = organizations.filter(org => 
    org.userType === "organization" && org.isApproved
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage organizations and campaigns
              </p>
            </div>
          </div>
          
          {/* Admin Dashboard Tabs */}
          <Tabs defaultValue="organizations" className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="organizations" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Organizations
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                Campaigns
              </TabsTrigger>
            </TabsList>
            
            {/* Organizations Tab */}
            <TabsContent value="organizations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Organizations</CardTitle>
                  <CardDescription>
                    Organizations waiting for approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingOrganizations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">Name</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Registered Date</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingOrganizations.map(org => (
                            <tr key={org.id} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">
                                {org.fullName}
                              </td>
                              <td className="p-4">
                                {org.email}
                              </td>
                              <td className="p-4">
                                {formatDate(org.createdAt)}
                              </td>
                              <td className="p-4">
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                  Pending
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    className="text-green-600 hover:text-green-700"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrganizationId(org.id);
                                      setIsApproveDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="text-red-600 hover:text-red-700"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrganizationId(org.id);
                                      setIsRejectDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No pending organizations</h3>
                      <p className="mt-1 text-sm text-gray-500">All organizations have been reviewed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Approved Organizations</CardTitle>
                  <CardDescription>
                    Organizations that can create campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {approvedOrganizations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">Name</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Registered Date</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {approvedOrganizations.map(org => (
                            <tr key={org.id} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">
                                {org.fullName}
                              </td>
                              <td className="p-4">
                                {org.email}
                              </td>
                              <td className="p-4">
                                {formatDate(org.createdAt)}
                              </td>
                              <td className="p-4">
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Approved
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Link href={`/organizations/${org.id}`}>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No approved organizations</h3>
                      <p className="mt-1 text-sm text-gray-500">Organizations will appear here once approved</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Campaigns</CardTitle>
                  <CardDescription>
                    Campaigns waiting for approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingCampaigns.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">Title</th>
                            <th className="text-left p-4">Organization ID</th>
                            <th className="text-left p-4">Goal Amount</th>
                            <th className="text-left p-4">Category</th>
                            <th className="text-left p-4">Created Date</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingCampaigns.map(campaign => (
                            <tr key={campaign.id} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">
                                {campaign.title}
                              </td>
                              <td className="p-4">
                                {campaign.organizationId}
                              </td>
                              <td className="p-4">
                                ${campaign.goalAmount.toLocaleString()}
                              </td>
                              <td className="p-4">
                                {campaign.category}
                              </td>
                              <td className="p-4">
                                {formatDate(campaign.createdAt)}
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    className="text-green-600 hover:text-green-700"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCampaignId(campaign.id);
                                      setIsCampaignApproveDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="text-red-600 hover:text-red-700"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCampaignId(campaign.id);
                                      setIsCampaignRejectDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No pending campaigns</h3>
                      <p className="mt-1 text-sm text-gray-500">All campaigns have been reviewed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Organization Approval Dialog */}
          <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Organization</DialogTitle>
                <DialogDescription>
                  Are you sure you want to approve this organization? They will be able to create campaigns.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsApproveDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={() => approveOrganizationMutation.mutate()}
                  disabled={approveOrganizationMutation.isPending}
                >
                  {approveOrganizationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : "Approve"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Organization Rejection Dialog */}
          <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Organization</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reject this organization? They will not be able to create campaigns.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => rejectOrganizationMutation.mutate()}
                  disabled={rejectOrganizationMutation.isPending}
                >
                  {rejectOrganizationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : "Reject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Campaign Approval Dialog */}
          <Dialog open={isCampaignApproveDialogOpen} onOpenChange={setIsCampaignApproveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Campaign</DialogTitle>
                <DialogDescription>
                  Are you sure you want to approve this campaign? It will be visible to all users.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCampaignApproveDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={() => approveCampaignMutation.mutate()}
                  disabled={approveCampaignMutation.isPending}
                >
                  {approveCampaignMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : "Approve"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Campaign Rejection Dialog */}
          <Dialog open={isCampaignRejectDialogOpen} onOpenChange={setIsCampaignRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Campaign</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reject this campaign? It will not be visible to users.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCampaignRejectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => rejectCampaignMutation.mutate()}
                  disabled={rejectCampaignMutation.isPending}
                >
                  {rejectCampaignMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : "Reject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}