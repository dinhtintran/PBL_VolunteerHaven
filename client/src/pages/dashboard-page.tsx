import { useQuery } from "@tanstack/react-query";
import { User, Campaign, Donation } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CampaignCard from "@/components/campaign/CampaignCard";
import { PlusCircle, Settings, Edit, Trash2, Calendar, DollarSign, Users, TrendingUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch user's campaigns (for organization accounts)
  const { data: userCampaigns = [], isLoading: isLoadingCampaigns } = useQuery<Campaign[]>({
    queryKey: ["/api/organizations", user?.id, "campaigns"],
    queryFn: async () => {
      if (!user || user.userType !== "organization") return [];
      const res = await fetch(`/api/organizations/${user.id}/campaigns`);
      if (!res.ok) throw new Error("Failed to load campaigns");
      return res.json();
    },
    enabled: !!user && user.userType === "organization",
  });
  
  // Fetch user's donations (for donor accounts)
  const { data: userDonations = [], isLoading: isLoadingDonations } = useQuery<Donation[]>({
    queryKey: ["/api/user/donations"],
    enabled: !!user && user.userType === "donor",
  });
  
  // Delete campaign mutation
  const deleteCampaignMutation = async () => {
    if (!selectedCampaignId) return;
    
    try {
      await apiRequest("DELETE", `/api/campaigns/${selectedCampaignId}`);
      
      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted",
      });
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/organizations", user?.id, "campaigns"] });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the campaign",
        variant: "destructive",
      });
    }
  };
  
  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate donation statistics
  const totalDonated = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const campaignsDonatedTo = new Set(userDonations.map(donation => donation.campaignId)).size;
  
  if (isLoadingCampaigns || isLoadingDonations) {
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
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.fullName}
              </p>
            </div>
            
            {user?.userType === "organization" && (
              <Link href="/create-campaign">
                <Button className="mt-4 md:mt-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </Link>
            )}
          </div>
          
          {/* User Profile Card */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg">{user?.fullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Username</h3>
                  <p className="mt-1 text-lg">{user?.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                  <p className="mt-1 text-lg capitalize">{user?.userType}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Organization Dashboard Content */}
          {user?.userType === "organization" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Campaigns</h2>
              
              {userCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                  {userCampaigns.map(campaign => (
                    <Card key={campaign.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/4">
                            <img 
                              src={campaign.imageUrl || "https://images.unsplash.com/photo-1605339837222-5c1d67c4602c"} 
                              alt={campaign.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                          <div className="md:w-3/4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-bold">{campaign.title}</h3>
                              <div className="flex space-x-2">
                                <Link href={`/campaigns/${campaign.id}/edit`}>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                </Link>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => {
                                    setSelectedCampaignId(campaign.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              Started {new Date(campaign.startDate).toLocaleDateString()}
                              {campaign.endDate && (
                                <span className="ml-4">
                                  Ends {new Date(campaign.endDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            
                            <p className="mt-3 text-gray-600">
                              {campaign.description.length > 150 
                                ? `${campaign.description.substring(0, 150)}...` 
                                : campaign.description}
                            </p>
                            
                            <div className="mt-4">
                              <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                <span>Raised: {formatCurrency(campaign.currentAmount)}</span>
                                <span>Goal: {formatCurrency(campaign.goalAmount)}</span>
                              </div>
                              <Progress 
                                value={Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100)} 
                              />
                            </div>
                            
                            <div className="mt-4">
                              <Link href={`/campaigns/${campaign.id}`}>
                                <Button variant="default" size="sm">
                                  View Campaign
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      You haven't created any campaigns yet
                    </h3>
                    <p className="text-gray-500 mb-8">
                      Start your first fundraising campaign to make a difference
                    </p>
                    <Link href="/create-campaign">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Campaign
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* Donor Dashboard Content */}
          {user?.userType === "donor" && (
            <div>
              {/* Donation Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-primary">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Donated</h3>
                        <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalDonated)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-primary">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Donations</h3>
                        <p className="mt-1 text-2xl font-semibold">{userDonations.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-primary">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Campaigns Supported</h3>
                        <p className="mt-1 text-2xl font-semibold">{campaignsDonatedTo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Donation History */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Donation History</h2>
              
              {userDonations.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">Campaign</th>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Amount</th>
                            <th className="text-left p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDonations.map(donation => (
                            <tr key={donation.id} className="border-b hover:bg-gray-50">
                              <td className="p-4">
                                Campaign #{donation.campaignId}
                              </td>
                              <td className="p-4">
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4 font-medium">
                                {formatCurrency(donation.amount)}
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Completed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      You haven't made any donations yet
                    </h3>
                    <p className="text-gray-500 mb-8">
                      Explore campaigns and start making a difference today
                    </p>
                    <Link href="/campaigns">
                      <Button>
                        Explore Campaigns
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteCampaignMutation}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
