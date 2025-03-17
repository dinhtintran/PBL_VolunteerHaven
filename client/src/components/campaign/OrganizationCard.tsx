import { Card, CardContent } from "@/components/ui/card";
import { User } from "@shared/schema";
import { Link } from "wouter";

interface OrganizationCardProps {
  organization: User;
  raisedAmount?: number;
}

export function OrganizationCard({ organization, raisedAmount = 0 }: OrganizationCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0 h-48 w-full object-cover">
        <img 
          className="h-48 w-full object-cover" 
          src={organization.profileImage || "https://images.unsplash.com/photo-1537511446984-935f663eb1f4"} 
          alt={organization.fullName} 
        />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <Link href={`/organizations/${organization.id}`} className="block">
            <p className="text-xl font-semibold text-gray-900">{organization.fullName}</p>
            <p className="mt-1 text-base text-gray-500">{organization.bio || "Organization Leader"}</p>
          </Link>
          <p className="mt-3 text-base text-gray-500">
            Has raised {formatCurrency(raisedAmount)}
          </p>
        </div>
        <div className="mt-6">
          <Link href={`/organizations/${organization.id}`} className="text-primary hover:text-blue-600">
            View Details <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrganizationCard;
