
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  listing_type: string;
  images: string[];
  additional_images: string[];
  status: string;
  reward_amount: number;
  after_repair_value?: number;
  comparable_addresses?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  year_built?: number;
  lot_size?: string;
  parking?: number;
  profiles?: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
}

export const usePropertyDetail = (propertyId: string) => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
      if (user) {
        checkIfLiked();
      }
    }
  }, [propertyId, user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('property_listings')
        .select(`
          *,
          profiles (
            name,
            email,
            phone,
            company
          )
        `)
        .eq('id', propertyId)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        // Parse images and additional_images if they're strings
        let images = [];
        let additionalImages = [];

        try {
          images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images || [];
        } catch {
          images = [];
        }

        try {
          additionalImages = typeof data.additional_images === 'string' ? 
            JSON.parse(data.additional_images) : data.additional_images || [];
        } catch {
          additionalImages = [];
        }

        // Parse comparable_addresses if it's a string
        let comparableAddresses = [];
        try {
          comparableAddresses = typeof data.comparable_addresses === 'string' ? 
            JSON.parse(data.comparable_addresses) : data.comparable_addresses || [];
        } catch {
          comparableAddresses = [];
        }

        const propertyDetail: PropertyDetail = {
          id: data.id,
          title: data.title || '',
          description: data.description || '',
          price: data.price || 0,
          beds: data.beds || 0,
          baths: data.baths || 0,
          sqft: data.sqft || 0,
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          property_type: data.property_type || '',
          listing_type: data.listing_type || '',
          images: images,
          additional_images: additionalImages,
          status: data.status || '',
          reward_amount: data.reward_amount || 0,
          after_repair_value: data.after_repair_value || undefined,
          comparable_addresses: comparableAddresses,
          user_id: data.user_id || '',
          created_at: data.created_at || '',
          updated_at: data.updated_at || '',
          year_built: data.year_built || undefined,
          lot_size: data.lot_size || undefined,
          parking: data.parking || undefined,
          profiles: data.profiles || undefined,
        };

        setProperty(propertyDetail);
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('liked_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking if property is liked:', error);
        return;
      }

      setIsLiked(!!data);
    } catch (err) {
      console.error('Error checking if property is liked:', err);
    }
  };

  const toggleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('liked_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
        setIsLiked(false);
      } else {
        // Add like
        const { error } = await supabase
          .from('liked_properties')
          .insert({
            user_id: user.id,
            property_id: propertyId
          });

        if (error) throw error;
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return {
    property,
    loading,
    error,
    isLiked,
    toggleLike,
    refetch: fetchProperty
  };
};
