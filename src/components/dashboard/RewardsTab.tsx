
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RewardStatusDetails } from '@/types/bounty';
import RewardProgress from './RewardProgress';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

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

type BuyerProgress = {
  id: string;
  buyerName: string;
  statusDetails: RewardStatusDetails;
};

const RewardsTab = () => {
  const [expandedRewardId, setExpandedRewardId] = useState<string | null>(null);
  const [buyerProgressMap, setBuyerProgressMap] = useState<Record<string, BuyerProgress[]>>({});
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

  const addNewBuyer = (rewardId: string) => {
    const currentBuyers = buyerProgressMap[rewardId] || [];
    const newBuyer: BuyerProgress = {
      id: `buyer-${Date.now()}`,
      buyerName: `Buyer ${currentBuyers.length + 1}`,
      statusDetails: {
        claimed: true,
        foundBuyer: false,
        submittedOffer: false,
        offerAccepted: false,
        dealClosed: false
      }
    };
    
    setBuyerProgressMap({
      ...buyerProgressMap,
      [rewardId]: [...currentBuyers, newBuyer]
    });
  };

  const calculateProgress = (statusDetails: RewardStatusDetails) => {
    const steps = ['foundBuyer', 'submittedOffer', 'offerAccepted', 'dealClosed'];
    const completedSteps = steps.filter(step => statusDetails[step as keyof RewardStatusDetails]).length;
    return (completedSteps / steps.length) * 100;
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
    <div className="space-y-6">
      {rewards.map((reward) => {
        const propertyListings = reward.property_listings;
        const images = propertyListings?.images || [];
        const title = propertyListings?.title || 'Property';
        const location = propertyListings?.location || 'Unknown location';
        const rewardAmount = propertyListings?.reward || 0;
        const isExpanded = expandedRewardId === reward.id;
        
        // Calculate progress percentage based on completed steps
        const progressPercentage = calculateProgress(reward.status_details);
        
        // Only show "Completed" when the last step (dealClosed) is true
        const isCompleted = reward.status_details.dealClosed;
        const displayStatus = isCompleted ? "Completed" : "In Progress";
        
        // Get additional buyers for this property
        const additionalBuyers = buyerProgressMap[reward.id] || [];
        
        return (
          <Card key={reward.id} className="overflow-hidden">
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleRewardExpanded(reward.id)}
            >
              <div className="flex items-center justify-between mb-3">
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
                <div className="flex items-center">
                  <div className="text-[#4CA154] text-2xl font-semibold mr-2">
                    ${rewardAmount}
                  </div>
                  <div className="border border-dashed border-gray-300 px-3 py-1 rounded-md text-sm">
                    {displayStatus}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Deal Progress {Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
            
            {isExpanded && (
              <div className="border-t border-gray-200">
                <div className="p-4">
                  <h4 className="font-semibold mb-4">Primary Buyer</h4>
                  <RewardProgress 
                    claimId={reward.id} 
                    initialStatus={reward.status_details} 
                    onStatusUpdate={handleStatusUpdate}
                  />
                </div>
                
                {additionalBuyers.map((buyer) => (
                  <div key={buyer.id} className="border-t border-gray-200 p-4">
                    <h4 className="font-semibold mb-4">{buyer.buyerName}</h4>
                    <RewardProgress 
                      claimId={`${reward.id}-${buyer.id}`} 
                      initialStatus={buyer.statusDetails} 
                      onStatusUpdate={handleStatusUpdate}
                      isSecondaryBuyer
                    />
                  </div>
                ))}
                
                <div className="border-t border-gray-200 p-4">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addNewBuyer(reward.id);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Another Buyer
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default RewardsTab;
