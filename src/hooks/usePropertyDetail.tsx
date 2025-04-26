import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface PropertyDetailType {
  id: string;
  title: string;
  description: string;
  price: number;
  marketPrice: number;
  location: string;
  address?: string;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  comparableAddresses: string[];
  seller?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  bounty?: number;
  estimatedRehab?: number;
  afterRepairValue?: number;
  yearBuilt?: string;
  lotSize?: string;
  parking?: string;
  belowMarket?: string;
  fullAddress?: string;
  userId?: string;
  propertyType?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  sellerId?: string;
}

export const usePropertyDetail = (propertyId?: string) => {
  const [property, setProperty] = useState<PropertyDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  const checkIfPropertyLiked = async () => {
    if (!propertyId || !user) {
      setIsLiked(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('liked_properties')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking property like status:", error);
        return;
      }

      setIsLiked(!!data);
    } catch (error) {
      console.error("Error checking property like status:", error);
    }
  };

  const toggleLike = async () => {
    if (!propertyId || !user) {
      toast.error("You must be logged in to like properties");
      return;
    }

    try {
      if (isLiked) {
        // Unlike the property
        const { error } = await supabase
          .from('liked_properties')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error unliking property:", error);
          toast.error("Failed to unlike property");
          return;
        }

        setIsLiked(false);
        toast.success("Property removed from your favorites");
      } else {
        // Like the property
        const { error } = await supabase
          .from('liked_properties')
          .insert({ 
            property_id: propertyId,
            user_id: user.id
          });

        if (error) {
          console.error("Error liking property:", error);
          toast.error("Failed to like property");
          return;
        }

        setIsLiked(true);
        toast.success("Property added to your favorites");

        // Create notification for the seller
        if (property?.seller?.id) {
          try {
            await supabase
              .from('notifications')
              .insert({
                user_id: property.seller.id,
                title: 'New Property Like',
                message: `${user.name || 'Someone'} liked your property "${property.title}"`,
                type: 'like',
                properties: { 
                  propertyId: propertyId,
                  userId: user.id,
                  userName: user.name
                }
              });
          } catch (error) {
            console.error("Error creating notification:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling property like:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    checkIfPropertyLiked();
  }, [propertyId, user]);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!propertyId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*, user_id')
          .eq('id', propertyId)
          .single();

        if (error) {
          console.error('Error fetching property:', error);
          setError('Failed to load property details');
          setIsLoading(false);
          return;
        }

        // Get seller details
        let sellerData = null;
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, email, phone')
          .eq('id', data.user_id)
          .single();

        if (profileError) {
          console.error('Error fetching seller profile:', profileError);
        } else {
          sellerData = profileData;
        }

        const propertyData = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          price: data.price,
          marketPrice: data.market_price,
          location: data.location,
          address: data.full_address,
          beds: data.beds || 0,
          baths: data.baths || 0,
          sqft: data.sqft || 0,
          images: data.images || [],
          comparableAddresses: data.comparable_addresses || [],
          seller: sellerData,
          bounty: data.bounty,
          estimatedRehab: data.estimated_rehab,
          afterRepairValue: data.after_repair_value,
          yearBuilt: data.year_built || 'N/A',
          lotSize: data.lot_size || 'N/A',
          parking: data.parking || 'N/A',
          belowMarket: String(((data.market_price - data.price) / data.market_price * 100).toFixed(1)),
          fullAddress: data.full_address,
          userId: data.user_id,
          propertyType: data.property_type,
          sellerName: sellerData?.name,
          sellerEmail: sellerData?.email,
          sellerPhone: sellerData?.phone,
          sellerId: sellerData?.id,
        };

        setProperty(propertyData);
      } catch (error) {
        console.error('Exception fetching property:', error);
        setError('An error occurred while loading the property details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [propertyId]);

  return {
    property,
    isLoading,
    error,
    isLiked,
    toggleLike,
    sellerInfo: property?.seller,
    waitlistStatus: 'pending',
    isOwner: false,
    isApproved: false,
    shouldShowSellerInfo: true,
    refreshProperty: () => {
      if (propertyId) {
        setIsLoading(true);
      }
    }
  };
};
