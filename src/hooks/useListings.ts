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

// State name to abbreviation mapping
const stateNameToAbbreviation: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
};

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
      console.log('=== FETCH LISTINGS DEBUG ===');
      console.log('Search Query:', searchQuery);
      console.log('Filters:', filters);
      
      let query = supabase
        .from('property_listings')
        .select('*');

      // Determine the location to search for - prioritize searchQuery over filters.location
      const locationToSearch = searchQuery || filters?.location;
      console.log('Location to search:', locationToSearch);

      // Apply location search if provided - make it more restrictive
      if (locationToSearch && locationToSearch.trim() !== '') {
        console.log('Applying location filter for:', locationToSearch);
        
        // Use more restrictive location matching - exact word matches or starts with
        const locationFilter = locationToSearch.trim();
        
        // Check if the search term has a state abbreviation equivalent
        const stateAbbr = stateNameToAbbreviation[locationFilter.toLowerCase()];
        
        // Build the OR conditions - keep the existing three-part pattern
        let orConditions = [
          `location.ilike.${locationFilter}%`,
          `location.ilike.% ${locationFilter}%`,
          `location.ilike.%${locationFilter}`
        ];
        
        // If there's a state abbreviation, add those conditions too
        if (stateAbbr) {
          orConditions.push(
            `location.ilike.${stateAbbr}%`,
            `location.ilike.% ${stateAbbr}%`,
            `location.ilike.%${stateAbbr}`
          );
          console.log('Added state abbreviation conditions for:', stateAbbr);
        }
        
        query = query.or(orConditions.join(','));
        
        console.log('Applied location filter query');
      }
      
      // Apply other filters if provided
      if (filters) {
        if (filters.minPrice > 0) {
          query = query.gte('price', filters.minPrice);
          console.log('Applied minPrice filter:', filters.minPrice);
        }
        
        if (filters.maxPrice < 10000000) {
          query = query.lte('price', filters.maxPrice);
          console.log('Applied maxPrice filter:', filters.maxPrice);
        }
        
        // Handle beds and baths filtering properly
        if (filters.minBeds > 0 || (filters.bedrooms && filters.bedrooms !== 'any')) {
          const bedsValue = filters.minBeds > 0 ? filters.minBeds : parseInt(filters.bedrooms);
          if (!isNaN(bedsValue) && bedsValue > 0) {
            query = query.gte('beds', bedsValue);
            console.log('Applied beds filter:', bedsValue);
          }
        }
        
        if (filters.minBaths > 0 || (filters.bathrooms && filters.bathrooms !== 'any')) {
          const bathsValue = filters.minBaths > 0 ? filters.minBaths : parseInt(filters.bathrooms);
          if (!isNaN(bathsValue) && bathsValue > 0) {
            query = query.gte('baths', bathsValue);
            console.log('Applied baths filter:', bathsValue);
          }
        }
        
        if (filters.propertyType && filters.propertyType !== '' && filters.propertyType !== 'any') {
          query = query.eq('property_type', filters.propertyType);
          console.log('Applied property type filter:', filters.propertyType);
        }
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
        console.log('Applied limit:', limit);
      }
      
      // Sort by created_at by default
      const { data, error } = await query.order('created_at', { ascending: false });

      console.log('Query executed, data length:', data?.length || 0);
      console.log('Query error:', error);

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
        
        console.log('Transformed data length before belowMarket filter:', transformedData.length);
        
        // Apply belowMarket filter as a minimum percentage threshold
        if (filters?.belowMarket && filters.belowMarket > 0) {
          transformedData = transformedData.filter(
            item => item.belowMarket >= filters.belowMarket
          );
          console.log('Transformed data length after belowMarket filter:', transformedData.length);
        }
        
        console.log('Final listings count:', transformedData.length);
        console.log('=== END FETCH LISTINGS DEBUG ===');
        
        setListings(transformedData);
      } else {
        console.log('No data returned, setting empty array');
        setListings([]);
      }
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      setError(error.message || 'Failed to load properties');
      setListings([]); // Ensure empty array on error
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
