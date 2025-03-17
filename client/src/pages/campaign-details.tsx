import { useQuery, useMutation } from "@tanstack/react-query";
import { Campaign, Donation, User } from "@shared/schema";
import { useParams, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Calendar, Users, Heart, Landmark, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Form schema for donation
const donationSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type DonationFormValues = z.infer<typeof donationSchema>;

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch campaign details
  const { data: campaign, isLoading: isLoadingCampaign } = useQuery<Campaign>({
    queryKey: [`/api/campaigns/${id}`],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load campaign details",
        variant: "destructive",
      });
      navigate("/campaigns");
    },
  });
  
  // Fetch donations for this campaign
  const { data: donations = [], isLoading: isLoadingDonations } = useQuery<Donation[]>({
    queryKey: [`/api/campaigns/${id}/donations`],
    enabled: !!campaign,
  });
  
  // Fetch organization details
  const { data: organization, isLoading: isLoadingOrganization } = useQuery<User>({
    queryKey: ["/api/user", campaign?.organizationId],
    queryFn: async () => {
      if (!campaign) throw new Error("Campaign not loaded");
      const res = await fetch(`/api/organizations/${campaign.organizationId}`);
      if (!res.ok) throw new Error("Failed to load organization");
      return res.json();
    },
    enabled: !!campaign,
  });
  
  // Form setup
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: "",
      message: "",
      isAnonymous: false,
    },
  });
  
  // Donation mutation
  const donationMutation = useMutation({
    mutationFn: async (values: DonationFormValues) => {
      const donationData = {
        campaignId: parseInt(id),
        amount: parseFloat(values.amount),
        message: values.message,
        isAnonymous: values.isAnonymous,
      };
      
      const res = await apiRequest("POST", "/api/donations", donationData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your donation has been processed successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${id}/donations`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process your donation",
        variant: "destructive",
      });
    },
  });
  
  const isLoading = isLoadingCampaign || isLoadingDonations || isLoadingOrganization;
  
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
  
  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
            <Link href="/campaigns">
              <Button>View All Campaigns</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const progress = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleDonationSubmit = (values: DonationFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a donation",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    donationMutation.mutate(values);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Campaign Hero */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-start lg:space-x-8">
            {/* Left: Campaign Image */}
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={campaign.imageUrl || "https://images.unsplash.com/photo-1605339837222-5c1d67c4602c"} 
                  alt={campaign.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
            
            {/* Right: Campaign Info */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              
              <div className="flex items-center text-gray-500 mb-6">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Started {formatDate(campaign.startDate)}</span>
                {campaign.endDate && (
                  <span className="ml-4">
                    <Clock className="h-5 w-5 mr-2 inline" />
                    Ends {formatDate(campaign.endDate)}
                  </span>
                )}
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                  <span>Raised: {formatCurrency(campaign.currentAmount)}</span>
                  <span>Goal: {formatCurrency(campaign.goalAmount)}</span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="mt-2 text-sm text-gray-500">{progress}% of goal raised</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">Donors</span>
                  </div>
                  <p className="text-2xl font-bold">{donations.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium">Category</span>
                  </div>
                  <p className="text-2xl font-bold">{campaign.category}</p>
                </div>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full mb-4">
                    Donate Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Make a Donation</DialogTitle>
                    <DialogDescription>
                      Your contribution will help fund {campaign.title}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleDonationSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Donation Amount ($)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter amount"
                                {...field}
                                type="number"
                                min="1"
                                step="any"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add a message with your donation"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isAnonymous"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Make this donation anonymous</FormLabel>
                              <FormDescription>
                                Your name will not be displayed publicly
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={donationMutation.isPending}
                        >
                          {donationMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Landmark className="mr-2 h-4 w-4" />
                              Complete Donation
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              {organization && (
                <div className="flex items-center">
                  <img 
                    src={organization.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(organization.fullName)}
                    alt={organization.fullName}
                    className="h-10 w-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Organized by</p>
                    <Link href={`/organizations/${organization.id}`}>
                      <a className="font-medium text-primary hover:underline">
                        {organization.fullName}
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Campaign Details */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Description */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About This Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{campaign.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right: Recent Donations */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>
                    {donations.length} people have donated to this campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {donations.length > 0 ? (
                    <ul className="space-y-4">
                      {donations.slice(0, 5).map((donation) => (
                        <li key={donation.id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {donation.isAnonymous ? "Anonymous" : "Donor #" + donation.donorId}
                              </p>
                              {donation.message && (
                                <p className="text-sm text-gray-500 mt-1">{donation.message}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">
                                {formatCurrency(donation.amount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Be the first to donate to this campaign!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
