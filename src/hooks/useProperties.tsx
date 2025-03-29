
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Property {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  image?: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
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

  const fetchUserProperties = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load your properties");
        return;
      }
      
      if (data && data.length > 0) {
        // Transform data to match our Property interface
        const formattedProperties = data.map(prop => ({
          id: prop.id,
          title: prop.title,
          price: Number(prop.price),
          marketPrice: Number(prop.market_price),
          image: prop.images && prop.images.length > 0 ? prop.images[0] : "https://placehold.co/600x400?text=Property+Image",
          location: prop.location,
          beds: prop.beds || 0,
          baths: prop.baths || 0,
          sqft: prop.sqft || 0,
          belowMarket: Math.round(((Number(prop.market_price) - Number(prop.price)) / Number(prop.market_price)) * 100),
          waitlistCount: 0 
        }));
        
        setMyProperties(formattedProperties);
        
        // Fetch waitlist counts for each property
        fetchWaitlistCounts(formattedProperties);
      } else {
        setMyProperties([]);
      }
    } catch (error) {
      console.error("Exception fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchWaitlistCounts = async (properties: Property[]) => {
    try {
      // For each property, get the count of waitlist requests
      const propertiesWithCounts = await Promise.all(properties.map(async (property) => {
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
      }));
      
      setMyProperties(propertiesWithCounts);
    } catch (error) {
      console.error("Error fetching waitlist counts:", error);
    }
  };

  const fetchWaitlistRequests = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Fetch properties owned by user
      const { data: properties, error: propError } = await supabase
        .from('property_listings')
        .select('id,title')
        .eq('user_id', userId);
        
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
        .in('property_id', propertyIds);
        
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
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    fetchUserProperties();
    fetchWaitlistRequests();
    
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
          console.log('New waitlist request:', payload);
          fetchWaitlistRequests();
          fetchUserProperties(); // Refresh property list to update counts
        }
      )
      .subscribe();
      
    return () => {
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
    refreshProperties: fetchUserProperties,
    refreshWaitlist: fetchWaitlistRequests
  };
};
