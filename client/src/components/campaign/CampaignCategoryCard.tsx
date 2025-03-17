import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CampaignCategoryCardProps {
  category: Category;
}

export function CampaignCategoryCard({ category }: CampaignCategoryCardProps) {
  return (
    <div className="relative group">
      <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="object-cover w-full h-full"
        />
        <div className="flex items-end p-4 absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40">
          <div>
            <h3 className="font-medium text-white">
              <Link href={`/categories/${encodeURIComponent(category.name)}`}>
                <a>
                  <span className="absolute inset-0"></span>
                  {category.name}
                </a>
              </Link>
            </h3>
            <p className="mt-1 text-sm text-white">{category.campaignCount} projects</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignCategoryCard;
