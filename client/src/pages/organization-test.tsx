import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/hooks/use-language";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrganizationCard from "@/components/campaign/OrganizationCard";

import { Link } from "wouter";

interface Organization {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  website: string;
}

export default function OrganizationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const { data: organizations = [], isLoading } = useQuery<Organization[]>({
    queryKey: ["/api/organizations"],
  });

  const filteredOrganizations = organizations.filter(org =>
  (org.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
   org.description?.toLowerCase().includes(searchTerm.toLowerCase()))
);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Tổ chức
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Các tổ chức đang hoạt động trên nền tảng của chúng tôi. Hãy cùng khám phá và tìm hiểu về họ!
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={t("organization.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Organization Cards */}
      <div className="bg-gray-50 flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredOrganizations.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOrganizations.map(org => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                {t("organization.notFound")}
              </h3>
              <p className="text-gray-500 mb-8">
                {searchTerm ? t("organization.noResults") : t("organization.empty")}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  {t("button.cancel")}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
