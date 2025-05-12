
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface PropertyOption {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  location: string;
  description?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  images?: string[];
}

export const usePropertySelector = () => {
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error("Error fetching properties:", error);
          toast.error("Failed to load your properties");
          return;
        }
        
        if (data && data.length > 0) {
          // Transform data to match our PropertyOption interface
          const formattedProperties = data.map(prop => ({
            id: prop.id,
            title: prop.title,
            price: Number(prop.price),
            marketPrice: Number(prop.market_price),
            location: prop.location,
            description: prop.description,
            beds: prop.beds || 0,
            baths: prop.baths || 0,
            sqft: prop.sqft || 0,
            belowMarket: Math.round(((Number(prop.market_price) - Number(prop.price)) / Number(prop.market_price)) * 100),
            images: prop.images
          }));
          
          setProperties(formattedProperties);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error("Exception fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProperties();
  }, [user?.id]);

  return {
    properties,
    selectedProperty,
    setSelectedProperty,
    isLoading
  };
};
