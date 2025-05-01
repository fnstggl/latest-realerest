
import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RewardStatusDetails } from '@/types/bounty';
import RewardProgress from './RewardProgress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
  buyers?: RewardStatusDetails[];
};

const RewardsTab = () => {
  const [expandedRewardId, setExpandedRewardId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState<string>('');
  const [addingBuyerForRewardId, setAddingBuyerForRewardId] = useState<string | null>(null);
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

  const addBuyerMutation = useMutation({
    mutationFn: async ({ claimId, newBuyerDetails }: { claimId: string, newBuyerDetails: RewardStatusDetails }) => {
      // First, get the current bounty claim
      const { data: claimData, error: fetchError } = await supabase
        .from('bounty_claims')
        .select('*')
        .eq('id', claimId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Create or update the buyers array
      const currentBuyers = claimData.buyers || [];
      const updatedBuyers = [...currentBuyers, newBuyerDetails];
      
      // Update the bounty_claims record
      const { error: updateError } = await supabase
        .from('bounty_claims')
        .update({ buyers: updatedBuyers })
        .eq('id', claimId);
      
      if (updateError) throw updateError;
      
      return { claimId, updatedBuyers };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success("New buyer added successfully");
      setAddingBuyerForRewardId(null);
      setBuyerName('');
    },
    onError: (error) => {
      console.error("Error adding buyer:", error);
      toast.error("Failed to add buyer. Please try again.");
    }
  });

  const handleAddBuyer = (claimId: string) => {
    setAddingBuyerForRewardId(claimId);
  };

  const submitNewBuyer = (claimId: string) => {
    if (!buyerName.trim()) {
      toast.error("Please enter a buyer name");
      return;
    }

    const newBuyerDetails: RewardStatusDetails = {
      claimed: true,
      foundBuyer: false,
      submittedOffer: false,
      offerAccepted: false,
      dealClosed: false,
      buyerName: buyerName
    };

    addBuyerMutation.mutate({ claimId, newBuyerDetails });
  };

  const handleStatusUpdate = () => {
    // Refetch rewards data after status update
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
  };

  const toggleRewardExpanded = (rewardId: string) => {
    setExpandedRewardId(expandedRewardId === rewardId ? null : rewardId);
  };

  const getStatusText = (statusDetails: RewardStatusDetails) => {
    if (statusDetails.dealClosed) {
      return 'Completed';
    }
    return statusDetails.claimed ? 'In Progress' : 'New';
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
        const statusText = getStatusText(reward.status_details);
        const isAddingBuyer = addingBuyerForRewardId === reward.id;
        const buyers = reward.buyers || [];
        
        return (
          <div key={reward.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
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
                <div className={`text-sm ${statusText === 'Completed' ? 'text-green-500' : 'text-amber-500'} capitalize`}>{statusText}</div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="border-t border-gray-100 p-4">
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Primary Buyer</h4>
                  <RewardProgress 
                    claimId={reward.id} 
                    initialStatus={reward.status_details} 
                    onStatusUpdate={handleStatusUpdate}
                    isPrimaryBuyer={true}
                  />
                </div>

                {/* Display additional buyers */}
                {buyers.length > 0 && (
                  <div className="space-y-6 mt-6 border-t pt-6">
                    <h4 className="font-medium mb-2">Additional Buyers</h4>
                    {buyers.map((buyer, index) => (
                      <div key={index} className="mb-6">
                        <h5 className="font-medium text-sm mb-2">{buyer.buyerName || `Buyer ${index + 1}`}</h5>
                        <RewardProgress
                          claimId={reward.id}
                          initialStatus={buyer}
                          onStatusUpdate={handleStatusUpdate}
                          buyerIndex={index}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new buyer UI */}
                <div className="mt-6 border-t pt-6">
                  {isAddingBuyer ? (
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Buyer Name</label>
                      <div className="flex gap-2">
                        <Input 
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="Enter buyer name"
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => submitNewBuyer(reward.id)}
                          disabled={addBuyerMutation.isPending}
                          size="sm"
                        >
                          Add
                        </Button>
                        <Button 
                          onClick={() => {
                            setAddingBuyerForRewardId(null);
                            setBuyerName('');
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddBuyer(reward.id);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Another Buyer
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RewardsTab;
