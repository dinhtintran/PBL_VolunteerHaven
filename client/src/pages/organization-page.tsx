import { useQuery } from "@tanstack/react-query";
import { User, Campaign } from "@shared/schema";
import { useParams } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignCard from "@/components/campaign/CampaignCard";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Mail, MapPin, Phone, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function OrganizationPage() {
  const { id } = useParams<{ id: string }>();
  
  // Fetch organization details
  const { data: organization, isLoading: isLoadingOrganization } = useQuery<User>({
    queryKey: [`/api/organizations/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/organizations/${id}`);
      if (!res.ok) throw new Error("Failed to load organization details");
      return res.json();
    },
  });
  
  // Fetch organization's campaigns
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery<Campaign[]>({
    queryKey: [`/api/organizations/${id}/campaigns`],
    enabled: !!organization,
  });
  
  const isLoading = isLoadingOrganization || isLoadingCampaigns;
  
  // If loading, show a spinner
  if (isLoading) {
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
  
  // If organization doesn't exist, show an error message
  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Organization not found</h1>
            <p className="text-gray-600 mb-8">The organization you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Calculate total funds raised across all campaigns
  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Organization Header */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="h-32 w-32 border-4 border-white">
              <AvatarImage 
                src={organization.profileImage || `https://ui-avatars.com/api/?name=${organization.fullName}&background=random`} 
                alt={organization.fullName} 
              />
              <AvatarFallback>{organization.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <div className="flex items-center mb-2">
                <h1 className="text-3xl font-bold mr-2">{organization.fullName}</h1>
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <p className="text-blue-100 text-lg mb-4">{organization.bio || "Charitable Organization"}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  <span>Member since {new Date(organization.createdAt).getFullYear()}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  <span>{organization.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Organization Stats */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 py-4">
            <div className="text-center p-4">
              <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <div className="text-center p-4">
              <p className="text-sm font-medium text-gray-500">Total Raised</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalRaised)}</p>
            </div>
            <div className="text-center p-4">
              <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">
                {campaigns.filter(campaign => campaign.isActive).length}
              </p>
            </div>
            <div className="text-center p-4">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">
                {campaigns.length > 0 
                  ? Math.round((campaigns.filter(c => c.currentAmount >= c.goalAmount).length / campaigns.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Organization Content */}
      <div className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="campaigns">
            <TabsList className="mb-8 grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            {/* Campaigns Tab */}
            <TabsContent value="campaigns">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Campaigns</h2>
              
              {campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {campaigns.map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      No campaigns found
                    </h3>
                    <p className="text-gray-500">
                      This organization hasn't created any campaigns yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* About Tab */}
            <TabsContent value="about">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About {organization.fullName}</h2>
                  
                  {organization.bio ? (
                    <div className="prose max-w-none mb-8">
                      <p>{organization.bio}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-8">
                      No detailed information has been provided by this organization.
                    </p>
                  )}
                  
                  <Separator className="my-8" />
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">{organization.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Member Since</p>
                        <p className="text-gray-600">{new Date(organization.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Organization
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
