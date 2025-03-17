import { useQuery } from "@tanstack/react-query";
import { Campaign, Category } from "@shared/schema";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/hooks/use-language";
import CampaignCard from "@/components/campaign/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function CampaignPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { user } = useAuth();
  
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });
  
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Filter campaigns based on search term and selected category
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || campaign.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const isLoading = isLoadingCampaigns || isLoadingCategories;
  
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t("nav.campaigns")}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {t("app.description")}
          </p>
          
          {user?.userType === "organization" && (
            <div className="mt-8">
              <Link href="/create-campaign">
                <Button size="lg">{t("campaign.create")}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder={t("campaign.form.title")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("campaign.category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("home.categories")}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Campaigns */}
      <div className="bg-gray-50 flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                {t("campaign.details")}
              </h3>
              <p className="text-gray-500 mb-8">
                {searchTerm || selectedCategory !== "all" ? 
                  t("campaign.form.description") : 
                  t("campaign.form.loading")}
              </p>
              {searchTerm || selectedCategory !== "all" ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  {t("button.cancel")}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
