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

// Cache for storing listings
const listingsCache: {
  data: Listing[] | null;
  timestamp: number;
  limit?: number;
} = {
  data: null,
  timestamp: 0,
  limit: undefined
};

// Cache expiry time in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

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
        
        // Check if we have a valid cache for the same limit
        const now = Date.now();
        if (
          listingsCache.data && 
          listingsCache.timestamp > now - CACHE_EXPIRY &&
          listingsCache.limit === limit
        ) {
          setListings(listingsCache.data);
          setLoading(false);
          return;
        }
        
        // Try first to load from localStorage for instant feedback
        const storedProperties = localStorage.getItem('propertyListings');
        if (storedProperties) {
          try {
            const loadedProperties = JSON.parse(storedProperties);
            // Show cached data immediately while fresh data loads
            if (loadedProperties && loadedProperties.length > 0) {
              if (!isMounted) return;
              
              // Apply limit if provided
              const limitedProperties = limit ? loadedProperties.slice(0, limit) : loadedProperties;
              setListings(limitedProperties);
              
              // Don't set loading to false yet as we still want to fetch fresh data
            }
          } catch (err) {
            console.error("Error parsing localStorage data:", err);
          }
        }
        
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
            // Extract property type from title if available (since it's not in the database)
            propertyType: extractPropertyTypeFromTitle(item.title),
            // Use the first image from the array if available
            image: item.images && item.images.length > 0 ? item.images[0] : 'https://source.unsplash.com/random/800x600?house',
            // Calculate below market percentage and round it
            belowMarket: item.market_price > item.price 
              ? Math.round((item.market_price - item.price) / item.market_price * 100)
              : 0
          }));
          
          setListings(transformedListings);
          
          // Update the cache
          listingsCache.data = transformedListings;
          listingsCache.timestamp = Date.now();
          listingsCache.limit = limit;
          
          // Also store in localStorage as a backup
          localStorage.setItem('propertyListings', JSON.stringify(transformedListings));
        } else if (!listings.length) {
          // Only fall back to localStorage if we haven't already shown localStorage data
          fallbackToLocalStorage();
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        if (!isMounted) return;
        
        if (!listings.length) {
          // Only show error if we haven't already shown cached data
          setError("Failed to load properties from the database");
          
          // Try from localStorage as a fallback
          fallbackToLocalStorage();
        }
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
    
    // Helper function to extract property type from title
    const extractPropertyTypeFromTitle = (title: string): string => {
      // Default property type
      const defaultType = "House";
      
      // If there's no title, return default
      if (!title) return defaultType;
      
      // Common property types to check for
      const propertyTypes = ["House", "Apartment", "Condo", "Townhouse", "Studio", "Land"];
      
      // Check if any property type is in the title
      for (const type of propertyTypes) {
        if (title.includes(type)) {
          return type;
        }
      }
      
      return defaultType;
    };
    
    const fallbackToLocalStorage = () => {
      try {
        const storedProperties = localStorage.getItem('propertyListings');
        if (storedProperties) {
          const loadedProperties = JSON.parse(storedProperties);
          const limitedProperties = limit ? loadedProperties.slice(0, limit) : loadedProperties;
          setListings(limitedProperties);
          console.log("Loaded properties from localStorage", limitedProperties.length);
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
