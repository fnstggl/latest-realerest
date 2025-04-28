
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RewardProgress from './RewardProgress';
import { useAuth } from '@/context/AuthContext';

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
  status_details?: {
    claimed: boolean;
    foundBuyer: boolean;
    submittedOffer: boolean;
    offerAccepted: boolean;
    dealClosed: boolean;
  } | null;
};

const RewardsTab = () => {
  const { user } = useAuth();
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(claim => {
        // Ensure status_details has all required fields
        const status_details = claim.status_details || {};
        return {
          ...claim,
          status_details: {
            claimed: true, // Always true since it's claimed
            foundBuyer: status_details.foundBuyer || false,
            submittedOffer: status_details.submittedOffer || false,
            offerAccepted: status_details.offerAccepted || false,
            dealClosed: status_details.dealClosed || false
          }
        };
      }) as BountyClaim[];
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
    <div className="space-y-4">
      {rewards.map((reward) => {
        const propertyListings = reward.property_listings;
        const images = propertyListings?.images || [];
        const title = propertyListings?.title || 'Property';
        const location = propertyListings?.location || 'Unknown location';
        const rewardAmount = propertyListings?.reward || 0;
        
        return (
          <div key={reward.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Link to={`/property/${propertyListings?.id}`} className="block">
                  <img 
                    src={images[0] || '/placeholder.svg'} 
                    alt={title}
                    className="w-20 h-20 object-cover rounded"
                  />
                </Link>
                <div>
                  <Link to={`/property/${propertyListings?.id}`} className="hover:underline">
                    <h3 className="font-semibold">{title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600">{location}</p>
                  <div className="flex items-center text-green-600 font-semibold mt-1">
                    <DollarSign size={16} className="mr-1" />
                    {rewardAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <Link to={`/property/${propertyListings?.id}`} className="md:self-start">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  View Property
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
            
            <RewardProgress 
              rewardId={reward.id} 
              status={reward.status_details || {
                claimed: true,
                foundBuyer: false,
                submittedOffer: false,
                offerAccepted: false,
                dealClosed: false
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RewardsTab;
