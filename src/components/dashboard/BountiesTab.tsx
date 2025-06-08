
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RewardStatusDetails, BuyerProgress } from '@/types/bounty';

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

const BountiesTab = () => {
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
        }
        return claim;
      }) as unknown as BountyClaim[];
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-8 font-polysans-semibold text-[#01204b]">Loading...</div>;
  }

  if (!rewards?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Award size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-polysans mb-2 text-[#01204b]">No claimed rewards yet</h3>
        <p className="text-gray-600 mb-6 font-polysans-semibold">Claim property rewards to earn commissions</p>
        <Button asChild variant="outline" className="font-polysans-semibold">
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
        
        // Calculate if any buyer has completed all steps
        const isCompleted = reward.status_details.buyers?.some(buyer => buyer.dealClosed) || false;
        
        return (
          <div key={reward.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={images[0] || '/placeholder.svg'} 
                alt={title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-polysans text-[#01204b]">{title}</h3>
                <p className="text-sm text-gray-600 font-polysans-semibold">{location}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 font-polysans">
                <DollarSign size={16} className="mr-1" />
                {rewardAmount}
              </div>
              <div className="text-sm text-gray-500 capitalize font-polysans-semibold">
                {isCompleted ? 'Completed' : 'In Progress'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BountiesTab;
