
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDebounce } from './useDebounce';

type PropertyDetailType = {
  id: string;
  title: string;
  price: number;
  market_price: number;
  location: string;
  full_address: string;
  description: string;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  user_id: string;
  below_market: number;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  seller_id: string;
  reward: number | null; // Ensure reward can be null
  after_repair_value?: number;
  estimated_rehab?: number;
  property_type?: string;
  year_built?: number | null;
  lot_size?: number | null;
  parking?: string | null;
  comparable_addresses?: string[];
  created_at?: string;
};

export const usePropertyDetail = (propertyId: string | undefined) => {
  const [property, setProperty] = useState<PropertyDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sellerInfo, setSellerInfo] = useState<{ name: string | null; phone: string | null; email: string | null }>({ name: null, phone: null, email: null });
  const [isOwner, setIsOwner] = useState(false);
  const [shouldShowAddress, setShouldShowAddress] = useState(false);

  const fetchPropertyDetails = async () => {
    setIsLoading(true);
    setError(null);

    if (!propertyId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_listings')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (propertyError) {
        console.error("Error fetching property:", propertyError);
        setError(new Error("Failed to load property details"));
        toast.error("Failed to load property details");
        return;
      }

      // Format property data
      const formattedProperty: PropertyDetailType = {
        id: propertyData.id,
        title: propertyData.title,
        location: propertyData.location,
        full_address: propertyData.full_address,
        price: Number(propertyData.price),
        market_price: Number(propertyData.market_price),
        below_market: Math.round(((Number(propertyData.market_price) - Number(propertyData.price)) / Number(propertyData.market_price)) * 100),
        beds: propertyData.beds || 0,
        baths: propertyData.baths || 0,
        sqft: propertyData.sqft || 0,
        images: propertyData.images || [],
        description: propertyData.description || "",
        comparable_addresses: propertyData.comparable_addresses || [],
        seller_id: propertyData.user_id,
        user_id: propertyData.user_id,
        created_at: propertyData.created_at,
        seller_name: "",  // Will be updated by fetchSellerInfo
        seller_email: "", // Will be updated by fetchSellerInfo
        seller_phone: "", // Will be updated by fetchSellerInfo
        after_repair_value: Number(propertyData.after_repair_value) || 0,
        estimated_rehab: Number(propertyData.estimated_rehab) || 0,
        reward: propertyData.reward !== null ? Number(propertyData.reward) : null,
        year_built: propertyData.year_built || null,
        lot_size: propertyData.lot_size || null,
        parking: propertyData.parking || null,
        property_type: propertyData.property_type || "House"
      };

      setProperty(formattedProperty);

      // Fetch seller info if available
      if (propertyData.user_id) {
        await fetchSellerInfo(propertyData.user_id);
      }

      // Check if current user is the owner
      const currentUser = (await supabase.auth.getUser()).data?.user;
      
      if (currentUser?.id === propertyData.user_id) {
        // User is owner
        setIsOwner(true);
        setShouldShowAddress(true);
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      setError(new Error("Failed to load property details"));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellerInfo = async (userId: string) => {
    try {
      const { data: sellerData, error: sellerError } = await supabase
        .from('profiles')
        .select('name, phone, email, id')
        .eq('id', userId)
        .single();

      if (sellerError) {
        console.error("Error fetching seller info:", sellerError);
      } else if (sellerData) {
        setSellerInfo({
          name: sellerData.name || null,
          phone: sellerData.phone || null,
          email: sellerData.email || null
        });

        // Update seller info in property data
        setProperty(prev => {
          if (!prev) return null;
          return {
            ...prev,
            seller_name: sellerData.name || '',
            seller_email: sellerData.email || '',
            seller_phone: sellerData.phone || '',
          };
        });
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  return {
    property,
    isLoading,
    error,
    sellerInfo,
    isOwner,
    shouldShowSellerInfo: true, // Always show seller info to everyone
    shouldShowAddress,
    setShouldShowAddress,
    refreshProperty: fetchPropertyDetails
  };
};
