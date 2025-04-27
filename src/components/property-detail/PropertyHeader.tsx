
import React from 'react';
import { MapPin, MessageSquare } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import LikeButton from './LikeButton';
import RewardToolTip from './RewardToolTip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

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
  const [showRewardDialog, setShowRewardDialog] = React.useState(false);
  const roundedBelowMarket = Math.round(belowMarket);
  const { user } = useAuth();

  const handleClaimReward = async () => {
    if (!user?.id || !propertyId) return;

    try {
      const { data: userData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('bounty_claims')
        .insert([{
          user_id: user.id,
          property_id: propertyId,
          status: 'claimed'
        }]);

      if (error) throw error;

      // Create a conversation if it doesn't exist
      const { data: conversationData } = await supabase.rpc('get_user_email', {
        user_id_param: userId
      });

      // Fix for the conversation creation
      if (userId) {
        // Get or create conversation using a query instead of RPC
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
          // Create new conversation
          const { data: newConversation } = await supabase
            .from('conversations')
            .insert({
              participant1: user.id,
              participant2: userId
            })
            .select('id')
            .single();
            
          if (newConversation) {
            conversationId = newConversation.id;
          }
        }

        if (conversationId) {
          // Send notification message
          await supabase
            .from('messages')
            .insert([{
              conversation_id: conversationId,
              sender_id: user.id,
              content: `${userData?.name || 'A user'} has claimed the reward for your property listing.`,
              property_id: propertyId
            }]);
        }
      }

      toast({
        title: "Reward Claimed",
        description: "The seller has been notified.",
      });

      setShowRewardDialog(true);
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderLocation = () => {
    if (showFullAddress && fullAddress) {
      return <span className="font-medium text-sm sm:text-base break-words">
          {fullAddress}{location ? `, ${location}` : ''}
        </span>;
    }
    return <span className="font-medium text-sm sm:text-base">
        <span className="cursor-pointer text-black font-bold hover:underline" onClick={onShowAddressClick}>
          Join Waitlist For Address
        </span>
        {location.includes(',') ? `, ${location.split(',').slice(1).join(',')}` : ''}
      </span>;
  };

  return <div className="bg-white p-4 sm:p-6 rounded-xl my-[30px]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-white text-black px-2 sm:px-3 py-1 border border-gray-200 font-bold inline-flex items-center text-sm sm:text-base rounded-lg">
            <span className="text-black font-playfair font-bold italic mr-1">{roundedBelowMarket}%</span> 
            <span className="text-black font-playfair font-bold italic">Below Market</span>
          </div>
          {reward && reward >= 3000 && <div className="bg-white text-black px-2 sm:px-3 py-1 border border-gray-200 font-bold inline-flex items-center text-sm sm:text-base rounded-lg">
              <span className="font-futura font-extrabold mr-1 text-sky-600">{formatCurrency(reward)}</span> 
              <span className="font-futura font-extrabold mr-1 text-sky-600">Reward</span>
              <RewardToolTip amount={reward} />
            </div>}
        </div>
        {propertyId && <LikeButton propertyId={propertyId} sellerId={userId || ''} />}
      </div>
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words text-black">{title}</h1>
      
      <div className="flex items-start sm:items-center mb-4 flex-wrap">
        <MapPin size={16} className="mr-1 sm:mr-2 text-black mt-1 sm:mt-0" />
        {renderLocation()}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-2 sm:p-4 rounded-lg border border-gray-200">
          <div className="text-lg sm:text-2xl font-bold text-black">{formatCurrency(price)}</div>
          <div className="text-xs sm:text-sm text-black">Listing Price</div>
        </div>
        <div className="p-2 sm:p-4 rounded-lg border border-gray-200">
          <div className="text-base sm:text-xl font-bold line-through text-gray-500">{formatCurrency(marketPrice)}</div>
          <div className="text-xs sm:text-sm text-black">Market Value</div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 sm:pt-3 border-t border-gray-200">
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-bold text-black">{beds}</span>
          <span className="ml-1 text-black">Beds</span>
        </div>
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-bold text-black">{baths}</span>
          <span className="ml-1 text-black">Baths</span>
        </div>
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-bold text-black">{sqft?.toLocaleString()}</span>
          <span className="ml-1 text-black">sqft</span>
        </div>
      </div>

      {waitlistStatus === 'pending' && reward && <div className="mt-4 space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-black font-medium">Waitlist Request Pending</p>
            <p className="text-sm text-gray-600 mt-1">You've joined the waitlist for this property. The seller will review your request soon.</p>
          </div>
          
          <Link to={`/messages?seller=${userId}`} className="block w-full">
            <Button variant="outline" className="w-full relative group">
              <MessageSquare className="mr-2" />
              <span className="relative z-10">
                Message {sellerName || 'Seller'} Directly
              </span>
            </Button>
          </Link>
          
          {reward > 0 && <Button 
            variant="default" 
            className="w-full bg-black hover:bg-black/90 text-white" 
            onClick={handleClaimReward}
          >
            Claim {formatCurrency(reward)} Reward
          </Button>}
        </div>}

      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reward Claim</DialogTitle>
            <DialogDescription>
              You've just accepted the {formatCurrency(reward || 0)} reward for {title}. Find a buyer for the seller, get an assignment of contract agreement signed (download from "How to Wholesale" in guides) and get paid.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowRewardDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};

export default PropertyHeader;
