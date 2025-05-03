import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  created_at: string;
  user_id: string;
  status: 'active' | 'inactive' | 'pending';
  type: 'house' | 'apartment' | 'land';
  amenities: string[];
  offer_type: 'sale' | 'rent';
  square_meters: number;
  year_built: number;
  lot_size: number;
  parking: string;
  bounty: number;
}

interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: () => Promise<void>;
}

export const useProperties = (): UsePropertiesResult => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        if (data) {
          const propertiesWithDetails = data.map(property => {
            const propertyWithDetails = {
              id: property.id,
              title: property.title,
              description: property.description,
              location: property.location,
              price: property.price,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              images: property.images,
              created_at: property.created_at,
              user_id: property.user_id,
              status: property.status,
              type: property.type,
              amenities: property.amenities,
              offer_type: property.offer_type,
              square_meters: property.square_meters,
              year_built: property.year_built,
              lot_size: property.lot_size,
              parking: property.parking,
              bounty: 0,
            };
            return propertyWithDetails;
          });
          setProperties(propertiesWithDetails as Property[]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, fetchProperties };
};
