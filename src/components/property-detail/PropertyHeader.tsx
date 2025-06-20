
import React, { useState, useEffect } from 'react';
import { MapPin, MessageSquare, Mail, Copy } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import LikeButton from './LikeButton';
import RewardToolTip from './RewardToolTip';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import RewardBadge from './RewardBadge';
import { useMessages } from '@/hooks/useMessages';

interface PropertyHeaderProps {
  title: string;
  belowMarket: number;
  price: number;
  marketPrice: number;
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  fullAddress?: string;
  showFullAddress: boolean;
  onShowAddressClick: () => void;
  userId?: string;
  propertyId?: string;
  reward?: number;
  sellerName?: string;
  waitlistStatus?: string | null;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  belowMarket,
  price,
  marketPrice,
  beds,
  baths,
  sqft,
  location,
  fullAddress,
  showFullAddress,
  onShowAddressClick,
  userId,
  propertyId,
  reward,
  sellerName = "Seller",
  waitlistStatus
}) => {
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const roundedBelowMarket = Math.round(belowMarket);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { getOrCreateConversation } = useMessages();
  
  // Add state for showing address
  const [showAddress, setShowAddress] = useState(false);

  // Check if reward is valid (greater than or equal to 3000)
  const hasValidReward = reward !== undefined && reward !== null && reward >= 3000;

  useEffect(() => {
    const checkExistingClaim = async () => {
      if (!user?.id || !propertyId) return;
      
      try {
        const { data, error } = await supabase
          .from('bounty_claims')
          .select('id')
          .eq('user_id', user.id)
          .eq('property_id', propertyId)
          .maybeSingle();
        
        if (data) {
          setHasClaimedReward(true);
        }
      } catch (error) {
        console.error("Error checking existing claim:", error);
      }
    };
    
    checkExistingClaim();
  }, [user?.id, propertyId]);

  const handleClaimReward = async () => {
    if (!user?.id || !propertyId) {
      toast.error("Please log in to claim the reward");
      return;
    }

    if (isClaiming) return;
    setIsClaiming(true);

    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_listings')
        .select('id')
        .eq('id', propertyId)
        .single();
      
      if (propertyError || !propertyData) {
        toast.error("Invalid property. Cannot claim reward.");
        setIsClaiming(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user profile:', userError);
      }

      const { data: existingClaim } = await supabase
        .from('bounty_claims')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .maybeSingle();
      
      if (existingClaim) {
        toast.error("You have already claimed this reward");
        setIsClaiming(false);
        setHasClaimedReward(true);
        return;
      }

      const { data, error } = await supabase
        .from('bounty_claims')
        .insert([{
          user_id: user.id,
          property_id: propertyId,
          status: 'claimed',
          status_details: {
            claimed: true,
            foundBuyer: false,
            submittedOffer: false,
            offerAccepted: false,
            dealClosed: false
          }
        }])
        .select()
        .single();

      if (error) {
        console.error('Error claiming reward:', error);
        throw error;
      }

      if (userId) {
        const { data: existingConversation } = await supabase
          .from('conversations')
          .select('id')
          .or(`participant1.eq.${user.id},participant2.eq.${user.id}`)
          .or(`participant1.eq.${userId},participant2.eq.${userId}`)
          .maybeSingle();
          
        let conversationId;
        
        if (existingConversation) {
          conversationId = existingConversation.id;
        } else {
          const { data: newConversation, error: convError } = await supabase
            .from('conversations')
            .insert({
              participant1: user.id,
              participant2: userId
            })
            .select('id')
            .single();
            
          if (convError) {
            console.error('Error creating conversation:', convError);
          } else if (newConversation) {
            conversationId = newConversation.id;
          }
        }

        if (conversationId) {
          await supabase
            .from('messages')
            .insert([{
              conversation_id: conversationId,
              sender_id: user.id,
              content: `${userData?.name || 'A user'} has claimed the reward for your property listing.`,
              property_id: propertyId
            }]);
            
          await supabase.from('notifications').insert([
            {
              user_id: userId,
              title: 'Reward Claimed',
              message: `${userData?.name || 'A user'} has claimed the reward for your property "${title}"`,
              type: 'reward',
              properties: {
                propertyId
              }
            }
          ]);
        }
      }

      toast.success("Reward Claimed", {
        description: "The seller has been notified.",
      });

      setHasClaimedReward(true);
    } catch (error: any) {
      console.error('Error claiming reward:', error);
      toast.error(`Failed to claim reward: ${error.message || "Please try again"}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const navigateToRewards = () => {
    navigate('/dashboard', { state: { activeTab: 'rewards' } });
  };

  // New function to handle messaging the seller directly
  const handleMessageSellerDirectly = async () => {
    if (!userId) return;
    
    try {
      // Get or create a conversation with the seller
      const conversationId = await getOrCreateConversation(userId);
      
      if (conversationId) {
        // Navigate directly to the conversation with the seller
        navigate(`/messages/${conversationId}`);
      } else {
        // Fallback to the general messages page
        navigate('/messages');
        toast.error("Couldn't connect with seller");
      }
    } catch (err) {
      console.error("Failed to navigate to seller conversation:", err);
      navigate('/messages');
    }
  };

  // Updated function to handle how we render the location
  const renderLocation = () => {
    if (showFullAddress && fullAddress) {
      // For the full address case, we need to implement masking/unmasking
      const addressParts = fullAddress.split(',');
      const streetAddress = addressParts[0].trim();
      const restOfAddress = addressParts.length > 1 ? addressParts.slice(1).join(',').trim() : '';
      
      return (
        <span className="font-polysans-semibold text-sm sm:text-base break-words text-[#01204b]">
          {showAddress ? streetAddress : (
            <span 
              className="cursor-pointer text-[#01204b] font-polysans font-bold hover:underline"
              onClick={() => setShowAddress(!showAddress)}
            >
              Click to View Full Address
            </span>
          )}
          {restOfAddress ? `, ${restOfAddress}` : ''}
          {location && !fullAddress.includes(location) ? `, ${location}` : ''}
        </span>
      );
    }
    
    return (
      <span className="font-polysans-semibold text-sm sm:text-base text-[#01204b]">
        {location}
      </span>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl my-[30px]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-white text-black px-2 sm:px-3 py-1 border-2 border-[#01204b] font-polysans font-bold inline-flex items-center text-sm sm:text-base rounded-lg">
            <span className="text-black font-polysans font-bold uppercase mr-1">{roundedBelowMarket}%</span> 
            <span className="text-black font-polysans font-bold uppercase">Below Market</span>
          </div>
          
          {/* Only render the reward section if there's a valid reward */}
          {hasValidReward && (
            <div className="bg-white text-[#fd4801] px-2 sm:px-3 py-1 border border-gray-200 font-bold inline-flex items-center text-sm sm:text-base rounded-lg">
              <span className="font-polysans font-extrabold mr-1 text-[#fd4801]">{formatCurrency(reward)}</span> 
              <span className="font-polysans font-extrabold mr-1 text-[#fd4801]">Reward</span>
              <RewardToolTip amount={reward} />
            </div>
          )}
        </div>
        {propertyId && <LikeButton propertyId={propertyId} sellerId={userId || ''} />}
      </div>
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-polysans font-bold mb-2 break-words text-[#01204b]">{title}</h1>
      
      <div className="flex items-start sm:items-center mb-4 flex-wrap">
        <MapPin size={16} className="mr-1 sm:mr-2 text-[#01204b] mt-1 sm:mt-0" />
        {renderLocation()}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-2 sm:p-4 rounded-lg border border-gray-200">
          <div className="text-lg sm:text-2xl font-polysans font-bold text-[#01204b]">{formatCurrency(price)}</div>
          <div className="text-xs sm:text-sm text-[#01204b] font-polysans-semibold">Listing Price</div>
        </div>
        <div className="p-2 sm:p-4 rounded-lg border border-gray-200">
          <div className="text-base sm:text-xl font-polysans font-bold line-through text-gray-500">{formatCurrency(marketPrice)}</div>
          <div className="text-xs sm:text-sm text-[#01204b] font-polysans-semibold">Market Value</div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 sm:pt-3 border-t border-gray-200">
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-polysans-semibold text-[#01204b]">{beds}</span>
          <span className="ml-1 text-[#01204b] font-polysans-semibold">Beds</span>
        </div>
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-polysans-semibold text-[#01204b]">{baths}</span>
          <span className="ml-1 text-[#01204b] font-polysans-semibold">Baths</span>
        </div>
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-polysans-semibold text-[#01204b]">{sqft?.toLocaleString()}</span>
          <span className="ml-1 text-[#01204b] font-polysans-semibold">sqft</span>
        </div>
      </div>

      {waitlistStatus === 'pending' && (
        <div className="mt-4 space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[#01204b] font-medium">Waitlist Request Pending</p>
            <p className="text-sm text-gray-600 mt-1">You've joined the waitlist for this property. The seller will review your request soon.</p>
          </div>
          
          {/* Updated to use the direct message handler instead of a Link */}
          <Button 
            variant="outline" 
            className="w-full relative group"
            onClick={handleMessageSellerDirectly}
          >
            <MessageSquare className="mr-2" />
            <span className="relative z-10">
              Message {sellerName || 'Seller'} Directly
            </span>
          </Button>
          
          {hasValidReward && !hasClaimedReward && user && (
            <Button 
              variant="default" 
              className="w-full bg-black hover:bg-black/90 text-white" 
              onClick={handleClaimReward}
              disabled={isClaiming}
            >
              {isClaiming ? 'Claiming...' : `Claim ${formatCurrency(reward)} Reward`}
            </Button>
          )}
          
          {hasValidReward && hasClaimedReward && (
            <Button 
              variant="default" 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              onClick={navigateToRewards}
            >
              See Reward Progress in Dashboard
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyHeader;
