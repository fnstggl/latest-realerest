
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validateAuthState } from '@/utils/authUtils';

export interface Property {
  id: string;
  price: number;
  market_price: number;
  beds: number;
  baths: number;
  sqft: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  after_repair_value?: number;
  estimated_rehab?: number;
  reward?: number;
  title: string;
  location: string;
  description?: string;
  images?: string[];
  property_type?: string;
  full_address?: string;
  additional_images?: string;
  additional_images_link?: string;
  // Derived properties for UI
  marketPrice?: number;
  belowMarket?: number;
  image?: string;
  waitlistCount?: number;
}

export interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  property?: {
    title: string;
  };
  status: "pending" | "accepted" | "declined";
  createdAt: string; // Added for sorting
}

export const useProperties = (userId: string | undefined) => {
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authValid, setAuthValid] = useState(true);

  const validateAuth = useCallback(async () => {
    try {
      const session = await validateAuthState();
      const isValid = !!session?.user;
      setAuthValid(isValid);
      return isValid;
    } catch (err) {
      console.error("Auth validation error:", err);
      setAuthValid(false);
      return false;
    }
  }, []);

  const fetchUserProperties = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    // Validate auth before fetching
    const isAuthValid = await validateAuth();
    if (!isAuthValid) {
      console.error("Authentication validation failed, cannot fetch properties");
      setError("Authentication error");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Add a small delay to ensure auth context is fully loaded
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('user_id', userId)
        .abortSignal(AbortSignal.timeout(10000)); // Add timeout to prevent hanging requests
        
      if (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load your properties");
        toast.error("Failed to load your properties");
        return;
      }
      
      if (data && data.length > 0) {
        // Transform data to include derived properties for UI
        const properties = data.map(prop => {
          const property: Property = {
            ...prop,
            // Add derived properties
            marketPrice: Number(prop.market_price),
            belowMarket: Math.round(((Number(prop.market_price) - Number(prop.price)) / Number(prop.market_price)) * 100),
            image: prop.images && prop.images.length > 0 ? prop.images[0] : "https://placehold.co/600x400?text=Property+Image",
            waitlistCount: 0
          };
          return property;
        });
        
        setMyProperties(properties);
        
        // Fetch waitlist counts for each property
        fetchWaitlistCounts(properties);
      } else {
        setMyProperties([]);
      }
    } catch (error) {
      console.error("Exception fetching properties:", error);
      setError("Failed to load your properties. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, validateAuth]);

  const fetchWaitlistCounts = async (properties: Property[]) => {
    if (!properties.length) return;
    
    try {
      // Use Promise.allSettled to prevent a single error from breaking the whole operation
      const propertiesWithCounts = await Promise.allSettled(properties.map(async (property) => {
        try {
          const { count, error } = await supabase
            .from('waitlist_requests')
            .select('*', { count: 'exact', head: true })
            .eq('property_id', property.id);
            
          if (error) {
            console.error(`Error counting waitlist for property ${property.id}:`, error);
            return property;
          }
          
          return {
            ...property,
            waitlistCount: count || 0
          };
        } catch (e) {
          console.error(`Error processing property ${property.id}:`, e);
          return property;
        }
      }));
      
      const validResults = propertiesWithCounts
        .filter((result): result is PromiseFulfilledResult<Property> => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<Property>).value);
      
      if (validResults.length) {
        setMyProperties(validResults);
      }
    } catch (error) {
      console.error("Error fetching waitlist counts:", error);
    }
  };

  const fetchWaitlistRequests = useCallback(async () => {
    if (!userId) {
      return;
    }

    // Validate auth before fetching
    const isAuthValid = await validateAuth();
    if (!isAuthValid) {
      console.error("Authentication validation failed, cannot fetch waitlist requests");
      return;
    }
    
    try {
      // Fetch properties owned by user
      const { data: properties, error: propError } = await supabase
        .from('property_listings')
        .select('id,title')
        .eq('user_id', userId)
        .abortSignal(AbortSignal.timeout(8000)); // Add timeout
        
      if (propError) {
        console.error("Error fetching user properties:", propError);
        return;
      }
      
      if (!properties || properties.length === 0) {
        setWaitlistUsers([]);
        return;
      }
      
      // Get array of property IDs
      const propertyIds = properties.map(p => p.id);
      
      // Fetch waitlist requests for these properties including created_at for sorting
      const { data: requests, error: reqError } = await supabase
        .from('waitlist_requests')
        .select('*')
        .in('property_id', propertyIds)
        .abortSignal(AbortSignal.timeout(8000)); // Add timeout
        
      if (reqError) {
        console.error("Error fetching waitlist requests:", reqError);
        return;
      }
      
      // Transform the data to match our interface
      const formattedRequests: WaitlistUser[] = requests.map(req => {
        const matchedProperty = properties.find(p => p.id === req.property_id);
        return {
          id: req.id,
          name: req.name,
          email: req.email,
          phone: req.phone || '',
          propertyId: req.property_id,
          property: matchedProperty ? { title: matchedProperty.title } : undefined,
          status: req.status as "pending" | "accepted" | "declined",
          createdAt: req.created_at // Include created_at for sorting
        };
      });
      
      setWaitlistUsers(formattedRequests);
    } catch (error) {
      console.error("Error fetching waitlist data:", error);
    }
  }, [userId, validateAuth]);

  useEffect(() => {
    let isMounted = true;
    
    if (!userId) return;
    
    // Small timeout to ensure auth context is fully loaded
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        fetchUserProperties();
        fetchWaitlistRequests();
      }
    }, 100);
    
    // Set up a subscription for realtime waitlist updates
    const waitlistSubscription = supabase
      .channel('public:waitlist_requests')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'waitlist_requests' 
        },
        (payload) => {
          if (isMounted) {
            console.log('New waitlist request:', payload);
            fetchWaitlistRequests();
            fetchUserProperties(); // Refresh property list to update counts
          }
        }
      )
      .subscribe();
      
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      supabase.removeChannel(waitlistSubscription);
    };
  }, [userId, fetchUserProperties, fetchWaitlistRequests]);

  return {
    myProperties,
    setMyProperties,
    waitlistUsers,
    setWaitlistUsers,
    isLoading,
    setIsLoading,
    error,
    authValid,
    refreshProperties: fetchUserProperties,
    refreshWaitlist: fetchWaitlistRequests,
    validateAuth
  };
};
