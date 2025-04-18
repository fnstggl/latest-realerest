import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface Listing {
  id: string;
  title?: string;
  price: number;
  marketPrice: number;
  image: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  propertyType?: string;
}

export const useListings = (limit?: number) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('property_listings')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (!isMounted) return;
        
        if (data) {
          const transformedListings = data.map(item => ({
            id: item.id,
            title: item.title,
            price: Number(item.price),
            marketPrice: Number(item.market_price),
            location: item.location,
            beds: item.beds || 0,
            baths: item.baths || 0,
            sqft: item.sqft || 0,
            propertyType: item.title?.split(' ')[0] || 'House',
            image: item.images?.[0] || 'https://source.unsplash.com/random/800x600?house',
            belowMarket: item.market_price > item.price 
              ? Math.round((item.market_price - item.price) / item.market_price * 100)
              : 0
          }));
          
          setListings(transformedListings);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        if (!isMounted) return;
        setError("Failed to load properties");
        setListings([]);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchListings();
    
    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { listings, loading, error };
};
