import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RewardProgressProps {
  userId: string;
  propertyId: string;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ userId, propertyId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rewardStatus, setRewardStatus] = useState<string>('claimed');
  const [statusDetails, setStatusDetails] = useState<RewardStatusDetails>({
    claimed: true,
    foundBuyer: false,
    submittedOffer: false,
    offerAccepted: false,
    dealClosed: false,
    buyers: []
  });
  const [property, setProperty] = useState<{ title: string; image: string }>({
    title: '',
    image: '/placeholder.svg'
  });

  useEffect(() => {
    fetchRewardStatus();
  }, [userId, propertyId]);

  // Fix the table names and replace method usage
  const fetchRewardStatus = async () => {
    setIsLoading(true);
    
    try {
      // Use the correct table name 'bounty_claims' instead of 'property_rewards'
      const { data: rewardData, error } = await supabase
        .from('bounty_claims')
        .select('*, property_listings(title, images)')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (rewardData) {
        setRewardStatus(rewardData.status || 'claimed');
        
        if (rewardData.status_details) {
          setStatusDetails(rewardData.status_details);
        }
        
        // Get property details
        if (rewardData.property_listings) {
          setProperty({
            title: rewardData.property_listings.title,
            image: rewardData.property_listings.images?.[0] || '/placeholder.svg'
          });
        }
      } else {
        // If no reward data found, check if we need to create a new record
        const { data: propertyData } = await supabase
          .from('property_listings')
          .select('title, images, reward')
          .eq('id', propertyId)
          .single();
        
        if (propertyData) {
          setProperty({
            title: propertyData.title,
            image: propertyData.images?.[0] || '/placeholder.svg'
          });
          
          // Create new reward claim record
          if (propertyData.reward > 0) {
            const { data: newClaim, error: insertError } = await supabase
              .from('bounty_claims')
              .insert({
                user_id: userId,
                property_id: propertyId,
                status: 'claimed',
                status_details: {
                  claimed: true,
                  foundBuyer: false,
                  submittedOffer: false,
                  offerAccepted: false,
                  dealClosed: false,
                  buyers: []
                }
              })
              .select()
              .single();
            
            if (insertError) throw insertError;
            
            if (newClaim) {
              setRewardStatus('claimed');
              setStatusDetails(newClaim.status_details);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching reward status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndUpdateOverallProgress = (updatedStatusDetails: RewardStatusDetails) => {
    const allBuyersDealClosed = updatedStatusDetails.buyers.every(buyer => buyer.dealClosed);
    
    if (updatedStatusDetails.foundBuyer &&
        updatedStatusDetails.submittedOffer &&
        updatedStatusDetails.offerAccepted &&
        allBuyersDealClosed) {
      setRewardStatus('completed');
    } else {
      setRewardStatus('in progress');
    }
  };

  const addBuyer = async () => {
    const newBuyerId = Math.random().toString(36).substring(2, 15);
    const newBuyer = {
      id: newBuyerId,
      name: `Buyer ${statusDetails.buyers.length + 1}`,
      status: 'Interested Buyer',
      foundBuyer: true,
      submittedOffer: false,
      offerAccepted: false,
      dealClosed: false
    };

    try {
      const updatedStatusDetails = {
        ...statusDetails,
        buyers: [...statusDetails.buyers, newBuyer]
      };

      const { error } = await supabase
        .from('bounty_claims')
        .update({
          status_details: updatedStatusDetails
        })
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) {
        throw error;
      }

      setStatusDetails(updatedStatusDetails);
    } catch (error) {
      console.error('Error adding buyer:', error);
    }
  };

  const updateProgressForBuyer = async (buyerId: string, field: keyof BuyerProgress, value: boolean) => {
    try {
      const newBuyers = [...statusDetails.buyers];
      const buyerIndex = newBuyers.findIndex(b => b.id === buyerId);
      
      if (buyerIndex >= 0) {
        newBuyers[buyerIndex] = {
          ...newBuyers[buyerIndex],
          [field]: value,
          // Don't use string.replace here, just use the field name directly with Date
          [field + 'Date']: value ? new Date().toISOString() : undefined
        };
        
        // Update the status details with the new buyer progress
        const updatedStatusDetails = {
          ...statusDetails,
          buyers: newBuyers
        };
        
        // Update in database
        const { error } = await supabase
          .from('bounty_claims')
          .update({
            status_details: updatedStatusDetails
          })
          .eq('user_id', userId)
          .eq('property_id', propertyId);
        
        if (error) throw error;
        
        // Update local state
        setStatusDetails(updatedStatusDetails);
        
        // Check if we should update overall progress
        checkAndUpdateOverallProgress(updatedStatusDetails);
      }
    } catch (error) {
      console.error('Error updating buyer progress:', error);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-4">Reward Progress</h3>
      {isLoading ? (
        <p>Loading reward status...</p>
      ) : (
        <>
          <div className="mb-4">
            <h4 className="text-md font-semibold">Property:</h4>
            <p>{property.title}</p>
            <img src={property.image} alt={property.title} className="w-32 h-20 object-cover rounded-md" />
          </div>
          <div className="mb-4">
            <h4 className="text-md font-semibold">Status:</h4>
            <p>Current Reward Status: {rewardStatus}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-md font-semibold">Progress:</h4>
            <div className="flex items-center justify-between">
              <span>Found Buyer</span>
              {getStatusIcon(statusDetails.foundBuyer)}
            </div>
            <div className="flex items-center justify-between">
              <span>Submitted Offer</span>
              {getStatusIcon(statusDetails.submittedOffer)}
            </div>
            <div className="flex items-center justify-between">
              <span>Offer Accepted</span>
              {getStatusIcon(statusDetails.offerAccepted)}
            </div>
            <div className="flex items-center justify-between">
              <span>Deal Closed</span>
              {getStatusIcon(statusDetails.dealClosed)}
            </div>
          </div>
          <div>
            <h4 className="text-md font-semibold">Buyers:</h4>
            {statusDetails.buyers.map((buyer) => (
              <div key={buyer.id} className="mb-2 p-3 rounded-md border border-gray-200">
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 mr-2" />
                  <span>{buyer.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Found Buyer</span>
                  <Button variant="ghost" onClick={() => updateProgressForBuyer(buyer.id, 'foundBuyer', !buyer.foundBuyer)}>
                    {getStatusIcon(buyer.foundBuyer)}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Submitted Offer</span>
                  <Button variant="ghost" onClick={() => updateProgressForBuyer(buyer.id, 'submittedOffer', !buyer.submittedOffer)}>
                    {getStatusIcon(buyer.submittedOffer)}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Offer Accepted</span>
                  <Button variant="ghost" onClick={() => updateProgressForBuyer(buyer.id, 'offerAccepted', !buyer.offerAccepted)}>
                    {getStatusIcon(buyer.offerAccepted)}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Deal Closed</span>
                  <Button variant="ghost" onClick={() => updateProgressForBuyer(buyer.id, 'dealClosed', !buyer.dealClosed)}>
                    {getStatusIcon(buyer.dealClosed)}
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={addBuyer} className="w-full neo-button-primary text-black">Add Buyer</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RewardProgress;
