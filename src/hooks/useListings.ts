
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

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('property_listings')
          .select('*');

        if (searchQuery) {
          query = query.or(`location.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const transformedData: Listing[] = data.map(item => ({
            id: item.id,
            title: item.title,
            price: Number(item.price),
            marketPrice: Number(item.market_price),
            location: item.location,
            image: item.images && item.images.length > 0 ? item.images[0] : '',
            beds: item.beds,
            baths: item.baths,
            sqft: item.sqft,
            belowMarket: calculateBelowMarket(Number(item.price), Number(item.market_price)),
            propertyType: item.property_type,
            reward: Number(item.reward || 0)
          }));
          
          setListings(transformedData);
        }
      } catch (error: any) {
        console.error('Error fetching listings:', error);
        setError(error.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [limit, searchQuery]);

  const calculateBelowMarket = (price: number, marketPrice: number): number => {
    if (!price || !marketPrice || marketPrice <= price) return 0;
    return Number(((marketPrice - price) / marketPrice * 100).toFixed(1));
  };

  return { listings, loading, error };
};
