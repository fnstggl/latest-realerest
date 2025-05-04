
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Listing {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  location: string;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  propertyType?: string;
  reward?: number;
}

export const useListings = (limit?: number, searchQuery?: string | null) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateBelowMarket = (price: number, marketPrice: number): number => {
    if (!price || !marketPrice || marketPrice <= price) return 0;
    return Number(((marketPrice - price) / marketPrice * 100).toFixed(1));
  };

  const fetchListings = async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('property_listings')
        .select('*');

      // Apply search query if provided
      if (searchQuery) {
        query = query.or(`location.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
      }
      
      // Apply filters if provided
      if (filters) {
        if (filters.location && filters.location !== '') {
          query = query.ilike('location', `%${filters.location}%`);
        }
        
        if (filters.minPrice > 0) {
          query = query.gte('price', filters.minPrice);
        }
        
        if (filters.maxPrice < 10000000) {
          query = query.lte('price', filters.maxPrice);
        }
        
        // Handle beds and baths filtering with proper numeric conversion
        if (filters.minBeds > 0) {
          query = query.gte('beds', filters.minBeds);
        }
        
        if (filters.minBaths > 0) {
          query = query.gte('baths', filters.minBaths);
        }
        
        if (filters.propertyType && filters.propertyType !== '' && filters.propertyType !== 'any') {
          query = query.eq('property_type', filters.propertyType);
        }
        
        // Below market filter
        if (filters.belowMarket && filters.belowMarket > 0) {
          // This is an approximation - we'd ideally calculate this in the database
          // For now, we'll filter on the client side after fetching the data
          // We'll skip this filter in the query for now
        }
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      // Sort by created_at by default
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        let transformedData: Listing[] = data.map(item => ({
          id: item.id,
          title: item.title || '',
          price: Number(item.price) || 0,
          marketPrice: Number(item.market_price) || 0,
          location: item.location || '',
          image: item.images && item.images.length > 0 ? item.images[0] : '/placeholder.svg',
          beds: item.beds || 0,
          baths: item.baths || 0,
          sqft: item.sqft || 0,
          belowMarket: calculateBelowMarket(Number(item.price), Number(item.market_price)),
          propertyType: item.property_type || '',
          reward: item.reward ? Number(item.reward) : undefined
        }));
        
        // Apply below market filter client-side if needed
        if (filters?.belowMarket && filters.belowMarket > 0) {
          transformedData = transformedData.filter(
            item => item.belowMarket >= filters.belowMarket
          );
        }
        
        setListings(transformedData);
      }
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      setError(error.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch listings when the hook is initialized or when limit/searchQuery change
  useEffect(() => {
    fetchListings();
  }, [limit, searchQuery]);

  return { 
    listings, 
    loading, 
    error,
    fetchListings 
  };
};
