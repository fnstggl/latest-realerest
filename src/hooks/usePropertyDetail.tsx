
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyDetailType {
  id: string;
  title: string;
  description: string;
  price: number;
  market_price: number;
  location: string;
  full_address: string;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  property_type: string;
  after_repair_value?: number;
  estimated_rehab?: number;
  bounty?: number;
  user_id: string;
  // Seller info
  seller: string;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  // Calculation
  belowMarket: number;
}

export const usePropertyDetail = (propertyId: string, userId?: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [shouldShowSellerInfo, setShouldShowSellerInfo] = useState(false);
  
  const { data: property, isLoading, error, refetch } = useQuery({
    queryKey: ['propertyDetail', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error("Property ID is required");
      
      // Fetch the property
      const { data, error } = await supabase
        .from('property_listings')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('id', propertyId)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error("Property not found");

      // Get user profile info safely
      let sellerName = 'Property Owner';
      let sellerEmail = '';
      let sellerPhone = '';

      // Check if profiles exists and has the needed properties
      if (data.profiles && typeof data.profiles === 'object') {
        sellerName = data.profiles.name || 'Property Owner';
        sellerEmail = data.profiles.email || '';
        sellerPhone = data.profiles.phone || '';
      }

      // Transform data to include seller information
      const transformedData: PropertyDetailType = {
        ...data,
        seller: data.user_id,
        seller_name: sellerName,
        seller_email: sellerEmail,
        seller_phone: sellerPhone,
        belowMarket: Math.round(((Number(data.market_price) - Number(data.price)) / Number(data.market_price)) * 100)
      };
            
      return transformedData;
    },
    retry: 1
  });

  // Check if user has liked this property
  useEffect(() => {
    if (!userId || !propertyId) return;
    
    const checkLikeStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('liked_properties')
          .select('*')
          .eq('user_id', userId)
          .eq('property_id', propertyId)
          .single();
        
        if (!error && data) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    
    checkLikeStatus();
  }, [userId, propertyId]);

  // Check waitlist status
  useEffect(() => {
    if (!userId || !propertyId) return;
    
    const checkWaitlistStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlist_requests')
          .select('status')
          .eq('user_id', userId)
          .eq('property_id', propertyId)
          .single();
        
        if (!error && data) {
          setWaitlistStatus(data.status);
          if (data.status === 'accepted') {
            setIsApproved(true);
          }
        }
      } catch (error) {
        console.error("Error checking waitlist status:", error);
      }
    };
    
    checkWaitlistStatus();
  }, [userId, propertyId]);
  
  // Check if the user is the owner of the property
  useEffect(() => {
    if (property && userId && property.user_id === userId) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [property, userId]);

  // Determine if seller info should be shown (if user is on waitlist and approved)
  useEffect(() => {
    if (isApproved || isOwner) {
      setShouldShowSellerInfo(true);
      
      if (property) {
        setSellerInfo({
          name: property.seller_name,
          email: property.seller_email,
          phone: property.seller_phone
        });
      }
    }
  }, [isApproved, isOwner, property]);

  // Toggle like status
  const toggleLike = useCallback(async () => {
    if (!userId || !propertyId) return;
    
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('liked_properties')
          .delete()
          .eq('user_id', userId)
          .eq('property_id', propertyId);
          
        setIsLiked(false);
      } else {
        // Like
        await supabase
          .from('liked_properties')
          .insert({
            user_id: userId,
            property_id: propertyId
          });
          
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  }, [isLiked, userId, propertyId]);
  
  // Refresh property data
  const refreshProperty = async () => {
    await refetch();
    
    // Re-check waitlist status
    if (userId && propertyId) {
      try {
        const { data, error } = await supabase
          .from('waitlist_requests')
          .select('status')
          .eq('user_id', userId)
          .eq('property_id', propertyId)
          .single();
        
        if (!error && data) {
          setWaitlistStatus(data.status);
          if (data.status === 'accepted') {
            setIsApproved(true);
          }
        }
      } catch (error) {
        console.error("Error checking waitlist status:", error);
      }
    }
  };

  return {
    property,
    isLoading,
    error,
    isLiked,
    toggleLike,
    waitlistStatus,
    isOwner,
    isApproved,
    sellerInfo,
    shouldShowSellerInfo,
    refreshProperty
  };
};
