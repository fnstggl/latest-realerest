
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
  searchQuery?: string;
} = {
  data: null,
  timestamp: 0,
  limit: undefined,
  searchQuery: undefined
};

// Cache expiry time in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

/**
 * Normalize a string for search purposes
 * - Convert to lowercase
 * - Replace common abbreviations
 * - Remove special characters
 */
const normalizeSearchString = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/\bst\b/g, 'saint')
    .replace(/\bave\b/g, 'avenue')
    .replace(/\bblvd\b/g, 'boulevard')
    .replace(/[.,\s]+/g, ' ')
    .trim();
};

/**
 * Check if two locations are in the same region/area 
 * This is a simple check that looks for common terms like city, state or zip
 */
const areLocationsRelated = (location1: string, location2: string): boolean => {
  const normalized1 = normalizeSearchString(location1);
  const normalized2 = normalizeSearchString(location2);
  
  // Check if one location contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  // Check for common parts (like state or city name)
  const parts1 = normalized1.split(' ').filter(part => part.length > 2);
  const parts2 = normalized2.split(' ').filter(part => part.length > 2);
  
  // If we find significant common parts, consider them related
  return parts1.some(part => parts2.includes(part));
};

/**
 * Calculate search relevance score
 * Higher score = better match
 */
const calculateSearchRelevance = (propertyLocation: string, searchQuery: string): number => {
  if (!searchQuery || !propertyLocation) return 0;
  
  const normalizedProperty = normalizeSearchString(propertyLocation);
  const normalizedQuery = normalizeSearchString(searchQuery);
  
  // Exact match gets highest score
  if (normalizedProperty === normalizedQuery) {
    return 100;
  }
  
  // Check if the property location starts with the search query
  if (normalizedProperty.startsWith(normalizedQuery)) {
    return 90;
  }
  
  // Check if property location contains the entire search query
  if (normalizedProperty.includes(normalizedQuery)) {
    return 80;
  }
  
  // Check if search query contains the property location
  if (normalizedQuery.includes(normalizedProperty)) {
    return 70;
  }
  
  // Check if all search terms are in the property location
  const queryTerms = normalizedQuery.split(' ');
  const allTermsIncluded = queryTerms.every(term => 
    normalizedProperty.includes(term) && term.length > 2
  );
  
  if (allTermsIncluded) {
    return 60;
  }
  
  // Check if most search terms are in the property location
  const matchingTermsCount = queryTerms.filter(term => 
    normalizedProperty.includes(term) && term.length > 2
  ).length;
  
  // If at least half of the terms match and they are significant (not just "in", "of", etc)
  if (matchingTermsCount > 0 && matchingTermsCount >= Math.ceil(queryTerms.length / 2)) {
    return 40 + (matchingTermsCount / queryTerms.length * 20);
  }
  
  return 0; // No significant match
};

/**
 * Custom hook to fetch property listings from Supabase with fallback to localStorage
 */
export const useListings = (limit?: number, searchQuery?: string) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we have a valid cache for the same limit and search query
        const now = Date.now();
        if (
          listingsCache.data && 
          listingsCache.timestamp > now - CACHE_EXPIRY &&
          listingsCache.limit === limit &&
          listingsCache.searchQuery === searchQuery
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
              
              let filteredProperties = loadedProperties;
              
              // Apply search filter if provided
              if (searchQuery) {
                // Filter and sort properties by search relevance
                filteredProperties = loadedProperties
                  .map(property => ({
                    ...property,
                    relevanceScore: calculateSearchRelevance(property.location, searchQuery)
                  }))
                  .filter(property => property.relevanceScore > 0)
                  .sort((a, b) => b.relevanceScore - a.relevanceScore);
              }
              
              // Apply limit if provided
              const limitedProperties = limit ? filteredProperties.slice(0, limit) : filteredProperties;
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
            // Set all properties as House type by default since that's what we're currently displaying
            propertyType: "House",
            // Use the first image from the array if available
            image: item.images && item.images.length > 0 ? item.images[0] : 'https://source.unsplash.com/random/800x600?house',
            // Calculate below market percentage and round it
            belowMarket: item.market_price > item.price 
              ? Math.round((item.market_price - item.price) / item.market_price * 100)
              : 0
          }));
          
          let finalListings = transformedListings;
          
          // Apply search filtering and sorting if a search query is provided
          if (searchQuery) {
            finalListings = transformedListings
              .map(property => ({
                ...property,
                relevanceScore: calculateSearchRelevance(property.location, searchQuery)
              }))
              .filter(property => property.relevanceScore > 0)
              .sort((a, b) => b.relevanceScore - a.relevanceScore);
          }
          
          setListings(finalListings);
          
          // Update the cache
          listingsCache.data = finalListings;
          listingsCache.timestamp = Date.now();
          listingsCache.limit = limit;
          listingsCache.searchQuery = searchQuery;
          
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

    const fallbackToLocalStorage = () => {
      try {
        const storedProperties = localStorage.getItem('propertyListings');
        if (storedProperties) {
          let loadedProperties = JSON.parse(storedProperties);
          
          // Apply search filter if provided
          if (searchQuery) {
            loadedProperties = loadedProperties
              .map(property => ({
                ...property,
                relevanceScore: calculateSearchRelevance(property.location, searchQuery)
              }))
              .filter(property => property.relevanceScore > 0)
              .sort((a, b) => b.relevanceScore - a.relevanceScore);
          }
          
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
  }, [limit, searchQuery]);

  return { listings, loading, error };
};
