
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface PropertyDetailData {
  property: Property | null;
  seller: any | null;
  loading: boolean;
  error: string | null;
  isLiked: boolean;
  likeCount: number;
  isWaitlisted: boolean;
  waitlistCount: number;
  isOwner: boolean;
  toggleLike: () => Promise<void>;
  handleWaitlistToggle: () => Promise<void>;
  rewardData: null | {
    reward: number;
    claimed: boolean;
  };
}

export const usePropertyDetail = (propertyId: string): PropertyDetailData => {
  const [property, setProperty] = useState<Property | null>(null);
  const [seller, setSeller] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [rewardData, setRewardData] = useState<{reward: number; claimed: boolean;} | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch property data
  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!propertyId) {
        setError('No property ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Fetch property data
        const { data: propertyData, error: propertyError } = await supabase
          .from('property_listings')
          .select('*')
          .eq('id', propertyId)
          .single();
          
        if (propertyError) throw propertyError;
        if (!propertyData) {
          setError('Property not found');
          setLoading(false);
          return;
        }

        // Format property data
        const formattedProperty = {
          ...propertyData,
          marketPrice: propertyData.market_price,
          belowMarket: Math.round((propertyData.market_price - propertyData.price) / propertyData.market_price * 100),
          image: propertyData.images && propertyData.images.length > 0 ? propertyData.images[0] : null,
        };

        setProperty(formattedProperty);
        
        // Fetch property like count
        const { count: likesCount } = await supabase
          .from('property_likes')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', propertyId);
        
        setLikeCount(likesCount || 0);
        
        // Fetch property waitlist count
        const { count: waitlistUsers } = await supabase
          .from('property_waitlist')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', propertyId);
        
        setWaitlistCount(waitlistUsers || 0);
        
        // Check if current user likes this property
        if (user?.id) {
          const { data: userLike } = await supabase
            .from('property_likes')
            .select('*')
            .eq('property_id', propertyId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          setIsLiked(!!userLike);
          
          // Check if user is waitlisted
          const { data: userWaitlist } = await supabase
            .from('property_waitlist')
            .select('*')
            .eq('property_id', propertyId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          setIsWaitlisted(!!userWaitlist);
          
          // Check if property has reward
          if (propertyData.reward) {
            const { data: rewardStatus } = await supabase
              .from('property_rewards')
              .select('status_details')
              .eq('property_id', propertyId)
              .eq('user_id', user.id)
              .maybeSingle();
              
            setRewardData({
              reward: propertyData.reward,
              claimed: rewardStatus?.status_details?.claimed || false
            });
          }
        }
        
        // Get seller info
        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', propertyData.user_id)
          .single();
        
        if (sellerError) {
          console.error("Error fetching seller:", sellerError);
        } else {
          setSeller(sellerData);
        }
        
      } catch (err: any) {
        console.error("Error fetching property:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetail();
  }, [propertyId, user?.id]);

  // Check if user is the property owner
  const isOwner = user?.id && property?.user_id === user.id;

  // Toggle property like
  const toggleLike = async () => {
    if (!user) {
      navigate('/signin', { state: { from: `/property/${propertyId}` } });
      return;
    }
    
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('property_likes')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', user.id);
        
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
        toast.success('Property removed from your likes');
      } else {
        // Like
        await supabase
          .from('property_likes')
          .insert({
            property_id: propertyId,
            user_id: user.id,
            property_title: property?.title || 'Property',
            property_location: property?.location || '',
            property_price: property?.price || 0,
            property_beds: property?.beds || 0,
            property_baths: property?.baths || 0,
            property_sqft: property?.sqft || 0,
            property_image: property?.image || '',
            property_year_built: property?.year_built || '',
            property_lot_size: property?.lot_size || '',
            property_parking: property?.parking || '',
          });
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success('Property added to your likes');
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error('Failed to update likes');
    }
  };

  // Toggle waitlist
  const handleWaitlistToggle = async () => {
    if (!user) {
      navigate('/signin', { state: { from: `/property/${propertyId}` } });
      return;
    }
    
    if (isOwner) {
      toast.error("You cannot join the waitlist for your own property");
      return;
    }
    
    try {
      if (isWaitlisted) {
        // Remove from waitlist
        await supabase
          .from('property_waitlist')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', user.id);
        
        setIsWaitlisted(false);
        setWaitlistCount(prev => Math.max(0, prev - 1));
        toast.success('You have been removed from the waitlist');
      } else {
        // Add to waitlist
        await supabase
          .from('property_waitlist')
          .insert({
            property_id: propertyId,
            user_id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            status: 'pending',
            property: {
              title: property?.title || 'Property'
            }
          });
        
        setIsWaitlisted(true);
        setWaitlistCount(prev => prev + 1);
        toast.success('You have been added to the waitlist');
      }
    } catch (err) {
      console.error("Error toggling waitlist:", err);
      toast.error('Failed to update waitlist');
    }
  };

  return {
    property,
    seller,
    loading,
    error,
    isLiked,
    likeCount,
    isWaitlisted,
    waitlistCount,
    isOwner,
    toggleLike,
    handleWaitlistToggle,
    rewardData
  };
};
