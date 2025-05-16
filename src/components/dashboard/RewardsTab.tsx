import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RewardStatusDetails, BuyerProgress, BuyerStatus } from '@/types/bounty';
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
      
      // Initialize the buyers array if it doesn't exist
      return data.map((claim: any) => {
        if (!claim.status_details.buyers) {
          // Create a default buyer if there are no buyers yet
          claim.status_details.buyers = [{
            id: crypto.randomUUID(),
            name: "Primary Buyer",
            status: "Interested Buyer",
            foundBuyer: claim.status_details.foundBuyer || false,
            submittedOffer: claim.status_details.submittedOffer || false,
            offerAccepted: claim.status_details.offerAccepted || false,
            dealClosed: claim.status_details.dealClosed || false,
            foundBuyerDate: claim.status_details.foundBuyerDate,
            submittedOfferDate: claim.status_details.submittedOfferDate,
            offerAcceptedDate: claim.status_details.offerAcceptedDate,
            dealClosedDate: claim.status_details.dealClosedDate
          }];
        } else {
          // Ensure all existing buyers have a status
          claim.status_details.buyers = claim.status_details.buyers.map((buyer: any) => ({
            ...buyer,
            status: buyer.status || "Interested Buyer"
          }));
        }
        return claim;
      }) as BountyClaim[];
    }
  });

  const handleStatusUpdate = () => {
    // Refetch rewards data after status update
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
  };

  const toggleRewardExpanded = (rewardId: string) => {
    setExpandedRewardId(expandedRewardId === rewardId ? null : rewardId);
  };

  const calculateOverallProgress = (statusDetails: RewardStatusDetails): number => {
    if (!statusDetails.buyers || statusDetails.buyers.length === 0) return 0;
    
    // Get the buyer with the most progress
    const highestProgress = Math.max(...statusDetails.buyers.map(buyer => {
      const steps = [buyer.foundBuyer, buyer.submittedOffer, buyer.offerAccepted, buyer.dealClosed];
      return (steps.filter(Boolean).length / 4) * 100;
    }));
    
    return highestProgress;
  };

  const formatRewardStatus = (statusDetails: RewardStatusDetails | null): RewardStatusDetails => {
    // Ensure we have a valid status details object with all required fields
    return {
      claimed: statusDetails?.claimed || false,
      foundBuyer: statusDetails?.foundBuyer || false,
      submittedOffer: statusDetails?.submittedOffer || false,
      offerAccepted: statusDetails?.offerAccepted || false,
      dealClosed: statusDetails?.dealClosed || false,
      buyers: statusDetails?.buyers || [],
      // Include any other properties that might be in the status details
      ...statusDetails
    };
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
        
        // Calculate if any buyer has completed all steps
        const isCompleted = reward.status_details.buyers?.some(buyer => buyer.dealClosed) || false;
        const progress = calculateOverallProgress(reward.status_details);
        
        return (
          <div key={reward.id} className="bg-white p-6 rounded-lg border border-gray-200">
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
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-gray-600">{location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-right mr-4">
                  <div className="flex items-center text-green-600 font-semibold text-xl">
                    <DollarSign className="mr-1" />
                    {rewardAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </Button>
              </div>
            </div>
            
            {isExpanded && (
              <div className="mt-6">
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
