
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  amenities: string[];
  year_built: string;
  lot_size: string;
  parking: string;
}

export const usePropertyDetail = (propertyId: string) => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error) {
          setError(error.message);
        }

        const propertyDetails = {
          id: data?.id || '',
          title: data?.title || 'Unknown',
          description: data?.description || 'No description provided',
          location: data?.location || data?.full_address || 'Unknown',
          price: data?.price || 0,
          images: data?.images || [],
          bedrooms: data?.beds || 0,
          bathrooms: data?.baths || 0,
          square_feet: data?.sqft || 0,
          amenities: [],
          year_built: 'Unknown',
          lot_size: 'Unknown',
          parking: 'Unknown',
        };

        setProperty(propertyDetails);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  return { property, loading, error };
};
