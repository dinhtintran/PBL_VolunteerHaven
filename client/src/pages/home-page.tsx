import { useQuery } from "@tanstack/react-query";
import { Campaign, Category, User } from "@shared/schema";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CampaignCard from "@/components/campaign/CampaignCard";
import CampaignCategoryCard from "@/components/campaign/CampaignCategoryCard";
import OrganizationCard from "@/components/campaign/OrganizationCard";
import StatCard from "@/components/stats/StatCard";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone } from "lucide-react";

export default function HomePage() {
  // Fetch featured campaigns
  const { data: featuredCampaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns/featured"],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 300000, // 5 minutes
  });
  
  // Fetch top organizations (in a real app, would have a specific endpoint)
  const { data: stats } = useQuery<{ totalProjects: number, totalDonors: number, totalDonated: number }>({
    queryKey: ["/api/stats"],
    staleTime: 300000, // 5 minutes
  });

  // Mock top organizations for display (in a real implementation, this would come from the API)
  const topOrganizations = [
    {
      id: 1,
      fullName: "John Smith",
      bio: "GiveHope Founder",
      profileImage: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4",
      username: "johnsmith",
      password: "",
      email: "john@givehope.org",
      userType: "organization",
      createdAt: new Date()
    },
    {
      id: 2,
      fullName: "Jane Doe",
      bio: "Children's Fund Manager",
      profileImage: "https://images.unsplash.com/photo-1554232456-8727aae0cfa4",
      username: "janedoe",
      password: "",
      email: "jane@givehope.org",
      userType: "organization",
      createdAt: new Date()
    },
    {
      id: 3,
      fullName: "Robert Johnson",
      bio: "Education Development Representative",
      profileImage: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d",
      username: "robertj",
      password: "",
      email: "robert@givehope.org",
      userType: "organization",
      createdAt: new Date()
    }
  ] as User[];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Featured fundraising</span>
                  <span className="block text-primary xl:inline"> campaigns</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Children's relief campaign - Join us to bring better opportunities to disadvantaged children in mountain areas.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/campaigns">
                      <Button size="lg" className="w-full">
                        Donate Now
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/about">
                      <Button size="lg" variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1594708767771-a5e9d3c87a67" alt="Children in rural area" />
        </div>
      </div>
      
      {/* Featured Campaigns */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Children's Relief Campaigns
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Campaigns that need community support
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
              
              {/* If no campaigns are available yet, show placeholder cards */}
              {featuredCampaigns.length === 0 && (
                <>
                  <CampaignCard 
                    campaign={{
                      id: 1,
                      title: "Build literacy points for mountain children",
                      description: "Bringing learning opportunities to children in difficult areas",
                      organizationId: 1,
                      goalAmount: 100000,
                      currentAmount: 65800,
                      category: "Education",
                      imageUrl: "https://images.unsplash.com/photo-1605339837222-5c1d67c4602c",
                      startDate: new Date(),
                      isActive: true,
                      createdAt: new Date()
                    }}
                  />
                  
                  <CampaignCard 
                    campaign={{
                      id: 2,
                      title: "Provide medicine for poor children in remote areas",
                      description: "Medical support for children without full access to medical services",
                      organizationId: 2,
                      goalAmount: 50000,
                      currentAmount: 22500,
                      category: "Health",
                      imageUrl: "https://images.unsplash.com/photo-1560252829-804f1aedf1be",
                      startDate: new Date(),
                      isActive: true,
                      createdAt: new Date()
                    }}
                  />
                  
                  <CampaignCard 
                    campaign={{
                      id: 3,
                      title: "Scholarships for outstanding students",
                      description: "Helping students with difficult circumstances rise up to study well",
                      organizationId: 3,
                      goalAmount: 50000,
                      currentAmount: 40000,
                      category: "Education",
                      imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
                      startDate: new Date(),
                      isActive: true,
                      createdAt: new Date()
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact Stats */}
      <div className="bg-gray-50 pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Charitable Community Actions
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Numbers from 2020
            </p>
          </div>
        </div>
        <div className="mt-10 pb-12 bg-white sm:pb-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                  <StatCard 
                    label="Projects" 
                    value={stats?.totalProjects || 3642} 
                  />
                  <StatCard 
                    label="Donors" 
                    value={stats?.totalDonors || 8234} 
                  />
                  <StatCard 
                    label="Raised" 
                    value={stats?.totalDonated ? Math.floor(stats.totalDonated / 1000000) : 31503} 
                    suffix="thousand dollars"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Campaign Categories */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Categories</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Community Help Campaigns
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CampaignCategoryCard key={category.id} category={category} />
              ))}
              
              {/* If no categories are available yet, show placeholders */}
              {categories.length === 0 && (
                <>
                  <CampaignCategoryCard
                    category={{
                      id: 1,
                      name: "Environment",
                      description: "Environmental protection for sustainable development",
                      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b",
                      campaignCount: 12
                    }}
                  />
                  
                  <CampaignCategoryCard
                    category={{
                      id: 2,
                      name: "Education",
                      description: "Expanding educational horizons",
                      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
                      campaignCount: 28
                    }}
                  />
                  
                  <CampaignCategoryCard
                    category={{
                      id: 3,
                      name: "Health",
                      description: "Supporting health development",
                      imageUrl: "https://images.unsplash.com/photo-1577211908983-8d3738bb028c",
                      campaignCount: 16
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Organizations */}
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Featured Organizations and Individuals
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Individuals and organizations creating positive change
            </p>
          </div>

          <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
            {topOrganizations.map((org, index) => (
              <OrganizationCard 
                key={org.id} 
                organization={org} 
                raisedAmount={[1589000, 2890000, 3670000][index]}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to donate?</span>
            <span className="block text-blue-100">Join us today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="text-primary bg-white hover:bg-blue-50">
                  Create Account
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/about">
                <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 flex items-center z-50">
        <div className="bg-white rounded-full shadow-lg p-2 mr-2">
          <Mail className="h-6 w-6 text-gray-400" />
        </div>
        <div className="bg-white rounded-full shadow-lg p-2 mr-2">
          <Phone className="h-6 w-6 text-gray-400" />
        </div>
        <div className="bg-white rounded-full shadow-lg p-2 flex items-center">
          <a href="#" className="flex items-center justify-center rounded-full h-10 w-10 bg-primary text-white">
            <MessageCircle className="h-6 w-6" />
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
