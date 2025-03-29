
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
}

/**
 * Custom hook to fetch property listings from Supabase with fallback to localStorage
 */
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
        
        // Create a query that we can modify based on limit
        let query = supabase
          .from('property_listings')
          .select('*')
          .order('created_at', { ascending: false });
          
        // Apply limit if provided
        if (limit) {
          query = query.limit(limit);
        }
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (!isMounted) return;
        
        if (data && data.length > 0) {
          // Transform the data to match our component props
          const transformedListings = data.map(item => ({
            id: item.id,
            title: item.title,
            price: Number(item.price),
            marketPrice: Number(item.market_price),
            location: item.location,
            beds: item.beds || 0,
            baths: item.baths || 0,
            sqft: item.sqft || 0,
            // Use the first image from the array if available
            image: item.images && item.images.length > 0 ? item.images[0] : 'https://source.unsplash.com/random/800x600?house',
            // Calculate below market percentage
            belowMarket: item.market_price > item.price 
              ? parseFloat(((item.market_price - item.price) / item.market_price * 100).toFixed(1)) 
              : 0
          }));
          
          setListings(transformedListings);
          
          // Also store in localStorage as a backup
          localStorage.setItem('propertyListings', JSON.stringify(transformedListings));
        } else {
          // If no data from Supabase, try from localStorage
          fallbackToLocalStorage();
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        if (!isMounted) return;
        setError("Failed to load properties from the database");
        
        // Try from localStorage as a fallback
        fallbackToLocalStorage();
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
    
    const fallbackToLocalStorage = () => {
      try {
        const storedProperties = localStorage.getItem('propertyListings');
        if (storedProperties) {
          const loadedProperties = JSON.parse(storedProperties);
          setListings(loadedProperties);
          console.log("Loaded properties from localStorage", loadedProperties.length);
        }
      } catch (err) {
        console.error("Error loading from localStorage:", err);
        setError("Unable to load property listings");
        setListings([]);
      }
    };

    fetchListings();
    
    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { listings, loading, error };
};
