
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RewardStatusDetails } from '@/types/bounty';
import RewardProgress from './RewardProgress';

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
  status_details: RewardStatusDetails;
};

const RewardsTab = () => {
  const [expandedRewardId, setExpandedRewardId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bounty_claims')
        .select(`
          *,
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
      
      return data as unknown as BountyClaim[];
    }
  });

  const handleStatusUpdate = () => {
    // Refetch rewards data after status update
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
  };

  const toggleRewardExpanded = (rewardId: string) => {
    setExpandedRewardId(expandedRewardId === rewardId ? null : rewardId);
  };

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
    <div className="space-y-4">
      {rewards.map((reward) => {
        const propertyListings = reward.property_listings;
        const images = propertyListings?.images || [];
        const title = propertyListings?.title || 'Property';
        const location = propertyListings?.location || 'Unknown location';
        const rewardAmount = propertyListings?.reward || 0;
        const isExpanded = expandedRewardId === reward.id;
        
        return (
          <div key={reward.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleRewardExpanded(reward.id)}
            >
              <div className="flex items-center space-x-4">
                <img 
                  src={images[0] || '/placeholder.svg'} 
                  alt={title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-gray-600">{location}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 font-semibold">
                  <DollarSign size={16} className="mr-1" />
                  {rewardAmount}
                </div>
                <div className="text-sm text-gray-500 capitalize">{reward.status}</div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="mt-4 border-t pt-4">
                <RewardProgress 
                  claimId={reward.id} 
                  initialStatus={reward.status_details} 
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RewardsTab;
