
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type definition for Property
export interface Property {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  location: string;
  description?: string;
  beds: number;
  baths: number;
  sqft: number;
  image?: string;
  images: string[];
  belowMarket: number;
  waitlistCount?: number;
  reward: number; // Changed from bounty to reward to match the database column name
  createdAt: string;
}

export interface WaitlistUser {
  id: string;
  propertyId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export const useProperties = (userId: string | undefined) => {
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mapDataToProperties = useCallback((data: any[]): Property[] => {
    return data.map(item => {
      // Calculate the below market percentage
      const belowMarket = item.market_price > item.price
        ? ((item.market_price - item.price) / item.market_price) * 100
        : 0;
      
      // Get the first image as the main image
      const mainImage = item.images && item.images.length > 0
        ? item.images[0]
        : 'https://source.unsplash.com/random/400x300?house';
      
      return {
        id: item.id,
        title: item.title || `Property in ${item.location}`,
        price: item.price,
        marketPrice: item.market_price,
        location: item.location,
        description: item.description,
        beds: item.beds,
        baths: item.baths,
        sqft: item.sqft,
        image: mainImage,
        images: item.images || [],
        belowMarket: belowMarket,
        reward: item.reward || 0, // Use reward instead of bounty
        createdAt: item.created_at
      };
    });
  }, []);

  const refreshProperties = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get property listings by user ID
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_listings')
        .select('*')
        .eq('user_id', userId);

      if (propertyError) throw propertyError;

      // Convert database data to our Property interface
      const properties = propertyData ? mapDataToProperties(propertyData) : [];

      // For each property, get the waitlist count
      const propertiesWithWaitlist = await Promise.all(properties.map(async (property) => {
        const { count, error: countError } = await supabase
          .from('waitlist_requests')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', property.id);

        if (countError) {
          console.error('Error getting waitlist count:', countError);
          return { ...property, waitlistCount: 0 };
        }

        return { ...property, waitlistCount: count || 0 };
      }));

      setMyProperties(propertiesWithWaitlist);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  }, [userId, mapDataToProperties]);

  const refreshWaitlist = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    
    try {
      // Get properties owned by the user
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_listings')
        .select('id')
        .eq('user_id', userId);

      if (propertyError) throw propertyError;
      
      if (!propertyData || propertyData.length === 0) {
        setWaitlistUsers([]);
        return;
      }

      // Get all property IDs
      const propertyIds = propertyData.map(p => p.id);

      // Get waitlist requests for all properties owned by the user
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist_requests')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (waitlistError) throw waitlistError;

      // Convert database data to our WaitlistUser interface
      const waitlist = waitlistData ? waitlistData.map(item => ({
        id: item.id,
        propertyId: item.property_id,
        userId: item.user_id,
        name: item.name,
        email: item.email || '',
        phone: item.phone || '',
        status: item.status || 'pending',
        createdAt: item.created_at
      })) : [];

      setWaitlistUsers(waitlist);
    } catch (err) {
      console.error('Error fetching waitlist:', err);
      toast.error('Failed to load waitlist data');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      refreshProperties();
      refreshWaitlist();
    }
  }, [userId, refreshProperties, refreshWaitlist]);

  return {
    myProperties,
    setMyProperties,
    waitlistUsers,
    setWaitlistUsers,
    isLoading,
    setIsLoading,
    error,
    refreshProperties,
    refreshWaitlist
  };
};
