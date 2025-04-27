
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RewardProgressTracker from './RewardProgressTracker';

type PropertyListing = {
  id: string;
  title: string;
  reward: number;
  location: string;
  images: string[];
};

type BountyClaim = {
  id: string;
  property_listings: PropertyListing;
  status: string;
  created_at: string;
};

const RewardsTab = () => {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bounty_claims')
        .select(`
          id,
          status,
          created_at,
          property_listings (
            id,
            title,
            reward,
            location,
            images
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as BountyClaim[];
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (!rewards?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Award size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No claimed rewards yet</h3>
        <p className="text-gray-600 mb-6">Claim property rewards to earn commissions</p>
        <Button asChild variant="outline">
          <Link to="/search">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rewards.map((reward) => {
        const propertyListings = reward.property_listings;
        if (!propertyListings) return null;
        
        const images = propertyListings?.images || [];
        const title = propertyListings?.title || 'Property';
        const location = propertyListings?.location || 'Unknown location';
        const rewardAmount = propertyListings?.reward || 0;
        
        return (
          <div key={reward.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Link to={`/property/${propertyListings.id}`}>
                  <img 
                    src={images[0] || '/placeholder.svg'} 
                    alt={title}
                    className="w-20 h-20 object-cover rounded"
                  />
                </Link>
                <div>
                  <Link to={`/property/${propertyListings.id}`} className="hover:underline">
                    <h3 className="font-semibold text-lg">{title}</h3>
                  </Link>
                  <p className="text-gray-600">{location}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 font-bold text-lg">
                  <DollarSign size={18} className="mr-1" />
                  {rewardAmount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </div>
                <div className="text-sm text-gray-500">Potential Reward</div>
              </div>
            </div>
            
            <RewardProgressTracker claimId={reward.id} initialStatus={reward.status} />
            
            <div className="mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link to={`/property/${propertyListings.id}`}>View Property</Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RewardsTab;
