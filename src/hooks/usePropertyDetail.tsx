
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface UsePropertyDetailResult {
  propertyData: {
    property: Property | null;
    likesCount: number;
    waitlistCount: number;
    isLiked: boolean;
    isWaitlisted: boolean;
    rewardStatus: RewardStatusDetails | null;
  };
  loading: boolean;
  error: string | null;
  likeProperty: () => Promise<void>;
  unlikeProperty: () => Promise<void>;
  addToWaitlist: () => Promise<void>;
  removeFromWaitlist: () => Promise<void>;
  fetchPropertyData: () => Promise<void>;
}

export const usePropertyDetail = (propertyId: string): UsePropertyDetailResult => {
  const [propertyData, setPropertyData] = useState<{
    property: Property | null;
    likesCount: number;
    waitlistCount: number;
    isLiked: boolean;
    isWaitlisted: boolean;
    rewardStatus: RewardStatusDetails | null;
  }>({
    property: null,
    likesCount: 0,
    waitlistCount: 0,
    isLiked: false,
    isWaitlisted: false,
    rewardStatus: null
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
// Use the correct table names from the Supabase database
// Changed from "property_likes" to "liked_properties"
// Changed from "property_waitlist" to "waitlist_requests"
// Changed from "property_rewards" to "bounty_claims"

const fetchPropertyData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    // Get property listing details
    const { data: property, error: propertyError } = await supabase
      .from('property_listings')
      .select('*')
      .eq('id', propertyId)
      .single();
      
    if (propertyError) throw new Error(propertyError.message);
    if (!property) throw new Error("Property not found");
    
    // Get likes count
    const { count: likesCount, error: likesError } = await supabase
      .from('liked_properties')  // Changed from property_likes to liked_properties
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);
    
    // Get waitlist count
    const { count: waitlistCount, error: waitlistError } = await supabase
      .from('waitlist_requests')  // Changed from property_waitlist to waitlist_requests
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);
    
    // Check if authenticated user has liked this property
    let isLiked = false;
    
    if (user?.id) {
      const { data: likeData, error: userLikeError } = await supabase
        .from('liked_properties')  // Changed from property_likes to liked_properties
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      isLiked = !!likeData;
    }
    
    // Check if authenticated user is on the waitlist
    let isWaitlisted = false;
    
    if (user?.id) {
      const { data: waitlistData, error: userWaitlistError } = await supabase
        .from('waitlist_requests')  // Changed from property_waitlist to waitlist_requests
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      isWaitlisted = !!waitlistData;
    }
    
    // Get reward status if applicable
    let rewardStatus = null;
    
    if (user?.id && property.reward && property.reward > 0) {
      const { data: rewardData } = await supabase
        .from('bounty_claims')  // Changed from property_rewards to bounty_claims
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (rewardData?.status_details) {
        rewardStatus = rewardData.status_details;
      }
    }
    
    // Formatting the property data
    const formattedProperty: Property = {
      ...property,
      // Calculate marketPrice from market_price field for UI consistency
      marketPrice: property.market_price || property.price,
      // Calculate belowMarket percentage
      belowMarket: property.market_price && property.price < property.market_price
        ? Number(((property.market_price - property.price) / property.market_price * 100).toFixed(1))
        : 0,
      // Use first image as the primary image if available
      image: property.images && property.images.length > 0 ? property.images[0] : '/placeholder.svg',
      // Add waitlist count for UI use
      waitlistCount: waitlistCount || 0
    };
    
    // Set all states in one go to prevent multiple re-renders
    setPropertyData({
      property: formattedProperty,
      likesCount: likesCount || 0,
      waitlistCount: waitlistCount || 0,
      isLiked,
      isWaitlisted,
      rewardStatus
    });
    
    setLoading(false);
  } catch (err: any) {
    console.error("Error fetching property data:", err);
    setError(err.message);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPropertyData();
  }, [propertyId, user]);

  const likeProperty = async () => {
    if (!user?.id) {
      setError('You must be logged in to like a property.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('liked_properties')
        .insert({
          property_id: propertyId,
          user_id: user.id
        });

      if (error) {
        throw new Error(error.message);
      }

      setPropertyData(prev => ({ ...prev, isLiked: true, likesCount: prev.likesCount + 1 }));
    } catch (err: any) {
      console.error("Error liking property:", err);
      setError(err.message);
    }
  };

  const unlikeProperty = async () => {
    if (!user?.id) {
      setError('You must be logged in to unlike a property.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('liked_properties')
        .delete()
        .eq('property_id', propertyId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      setPropertyData(prev => ({ ...prev, isLiked: false, likesCount: prev.likesCount - 1 }));
    } catch (err: any) {
      console.error("Error unliking property:", err);
      setError(err.message);
    }
  };

  const addToWaitlist = async () => {
    if (!user?.id) {
      setError('You must be logged in to join the waitlist.');
      return;
    }

    try {
      // Fetch user's profile to get name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      const { data, error } = await supabase
        .from('waitlist_requests')
        .insert({
          property_id: propertyId,
          user_id: user.id,
          name: profileData?.name || 'Anonymous User',
          status: 'pending'
        });

      if (error) {
        throw new Error(error.message);
      }

      setPropertyData(prev => ({ ...prev, isWaitlisted: true, waitlistCount: prev.waitlistCount + 1 }));
    } catch (err: any) {
      console.error("Error adding to waitlist:", err);
      setError(err.message);
    }
  };

  const removeFromWaitlist = async () => {
    if (!user?.id) {
      setError('You must be logged in to remove yourself from the waitlist.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('waitlist_requests')
        .delete()
        .eq('property_id', propertyId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      setPropertyData(prev => ({ ...prev, isWaitlisted: false, waitlistCount: prev.waitlistCount - 1 }));
    } catch (err: any) {
      console.error("Error removing from waitlist:", err);
      setError(err.message);
    }
  };

  return {
    propertyData,
    loading,
    error,
    likeProperty,
    unlikeProperty,
    addToWaitlist,
    removeFromWaitlist,
    fetchPropertyData
  };
};
