
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Property {
  id: string;
  title: string;
  price: number;
  market_price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  user_id: string;
  below_market: number;
  reward?: number;
  seller_name?: string;
  seller_email?: string;
}

export const useListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const mappedProperties = data.map(property => {
          const price = Number(property.price);
          const marketPrice = Number(property.market_price);
          const belowMarket = marketPrice > price ? ((marketPrice - price) / marketPrice * 100).toFixed(1) : "0";

          return {
            id: property.id,
            title: property.title || '',
            price: price,
            market_price: marketPrice,
            location: property.location || '',
            beds: property.beds || 0,
            baths: property.baths || 0,
            sqft: property.sqft || 0,
            images: property.images || [],
            user_id: property.user_id,
            below_market: parseFloat(belowMarket),
            reward: Number(property.reward || 0),
          };
        });

        setProperties(mappedProperties);
      }
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return {
    properties,
    isLoading,
    error,
    refetchListings: fetchListings
  };
};
