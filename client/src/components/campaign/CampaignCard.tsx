import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Campaign } from "@shared/schema";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="bg-white overflow-hidden shadow-lg rounded-lg">
      <div className="relative h-48">
        <img 
          className="absolute h-full w-full object-cover" 
          src={campaign.imageUrl || "https://images.unsplash.com/photo-1605339837222-5c1d67c4602c"} 
          alt={campaign.title} 
        />
      </div>
      <CardContent className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{campaign.title}</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>{campaign.description.length > 80 ? `${campaign.description.substring(0, 80)}...` : campaign.description}</p>
        </div>
        <div className="mt-3 relative pt-1">
          <Progress value={progress} className="mb-2" />
          <div className="flex justify-between text-xs font-semibold text-gray-600">
            <span>{formatCurrency(campaign.currentAmount)}</span>
            <span>{formatCurrency(campaign.goalAmount)}</span>
          </div>
        </div>
        <div className="mt-5">
          <Link href={`/campaigns/${campaign.id}`}>
            <Button className="w-full" variant="default">
              Donate Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default CampaignCard;
