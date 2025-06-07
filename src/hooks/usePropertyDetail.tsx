
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  beds: number;
  baths: number;
  square_feet: number;
  price: number;
  after_repair_value: number;
  description: string;
  property_type: string;
  images: string[];
  additional_images: string;
  additional_images_link: string;
  comparable_addresses: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  features?: string[];
  // Optional fields that may not exist in all property records
  year_built?: number;
  lot_size?: string;
  parking?: string;
}

interface Offer {
  id: string;
  property_id: string;
  buyer_id: string;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  buyer_name?: string;
  buyer_email?: string;
}

interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export const usePropertyDetail = (propertyId: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setIsLoading(false);
      return;
    }

    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    if (!propertyId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch property details
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_listings')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (propertyError) {
        throw new Error('Property not found');
      }

      // Fetch seller details
      const { data: sellerData, error: sellerError } = await supabase
        .from('profiles')
        .select('id, name, email, phone')
        .eq('id', propertyData.user_id)
        .single();

      if (sellerError) {
        console.warn('Could not fetch seller details:', sellerError);
      }

      // Fetch offers for this property
      const { data: offersData, error: offersError } = await supabase
        .from('property_offers')
        .select(`
          *,
          profiles:buyer_id (
            name,
            email
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (offersError) {
        console.warn('Could not fetch offers:', offersError);
      }

      // Transform property data
      const transformedProperty: Property = {
        id: propertyData.id,
        title: propertyData.title,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip_code: propertyData.zip_code,
        beds: propertyData.beds,
        baths: propertyData.baths,
        square_feet: propertyData.square_feet,
        price: propertyData.price,
        after_repair_value: propertyData.after_repair_value,
        description: propertyData.description,
        property_type: propertyData.property_type,
        images: Array.isArray(propertyData.images) ? propertyData.images : [],
        additional_images: propertyData.additional_images || '',
        additional_images_link: propertyData.additional_images_link || '',
        comparable_addresses: Array.isArray(propertyData.comparable_addresses) ? propertyData.comparable_addresses : [],
        user_id: propertyData.user_id,
        created_at: propertyData.created_at,
        updated_at: propertyData.updated_at,
        // Handle optional fields safely
        year_built: propertyData.year_built || undefined,
        lot_size: propertyData.lot_size || undefined,
        parking: propertyData.parking || undefined,
        features: Array.isArray(propertyData.features) ? propertyData.features : []
      };

      // Transform offers data
      const transformedOffers: Offer[] = (offersData || []).map(offer => ({
        id: offer.id,
        property_id: offer.property_id,
        buyer_id: offer.buyer_id,
        amount: offer.amount,
        message: offer.message || '',
        status: offer.status as 'pending' | 'accepted' | 'rejected',
        created_at: offer.created_at,
        buyer_name: offer.profiles?.name || 'Unknown',
        buyer_email: offer.profiles?.email || ''
      }));

      setProperty(transformedProperty);
      setSeller(sellerData || null);
      setOffers(transformedOffers);

    } catch (err: any) {
      console.error('Error fetching property details:', err);
      setError(err.message || 'Failed to load property details');
      toast.error('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOffers = () => {
    fetchPropertyDetails();
  };

  return {
    property,
    seller,
    offers,
    isLoading,
    error,
    refreshOffers
  };
};
