import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useUserProfiles } from './useUserProfiles';

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
  reward: number | null;
  after_repair_value?: number;
  estimated_rehab?: number;
  property_type?: string;
  year_built?: number | null;
  lot_size?: number | null;
  parking?: string | null;
  comparable_addresses?: string[];
  created_at?: string;
  additional_images_link?: string | null;
};

export interface PropertyDetail {
  id: string;
  price: number;
  market_price: number;
  beds: number;
  baths: number;
  sqft: number;
  title: string;
  location: string;
  description?: string;
  images: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  after_repair_value?: number;
  estimated_rehab?: number;
  reward?: number;
  full_address?: string;
  property_type?: string;
  additional_images_link?: string;
  // Add these optional properties
  year_built?: number;
  lot_size?: number;
  parking?: string;
}

const usePropertyDetail = (propertyId?: string) => {
  const { user } = useAuth();
  const { getUserProfile } = useUserProfiles();
  const [property, setProperty] = useState<PropertyDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sellerInfo, setSellerInfo] = useState<{ name: string | null; phone: string | null; email: string | null }>({ name: null, phone: null, email: null });
  const [waitlistStatus, setWaitlistStatus] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [shouldShowSellerInfo, setShouldShowSellerInfo] = useState(false);

  const fetchPropertyData = async () => {
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
        setError(propertyError);
        console.error("Error fetching property:", propertyError);
        return;
      }

      if (propertyData) {
        const price = Number(propertyData.price);
        const marketPrice = Number(propertyData.market_price);
        const belowMarket = marketPrice > price ? ((marketPrice - price) / marketPrice * 100).toFixed(1) : "0";
        
        // Handle null or undefined reward properly
        const rewardAmount = propertyData.reward ? Number(propertyData.reward) : null;

        // Fetch seller profile using useUserProfiles hook
        let sellerProfile = null;
        try {
          sellerProfile = await getUserProfile(propertyData.user_id);
          console.log("Seller profile fetched:", sellerProfile);
        } catch (profileError) {
          console.error("Error fetching seller profile:", profileError);
        }

        // Create a user-friendly seller name
        // Capitalize first letter and use name from profile or format email if name isn't available
        let sellerName = 'Property Owner';
        
        if (sellerProfile) {
          if (sellerProfile.name && !sellerProfile.name.includes('@')) {
            sellerName = sellerProfile.name;
          } else if (sellerProfile.email) {
            // Create a readable name from the email (e.g., john.doe@example.com → John)
            const emailName = sellerProfile.email.split('@')[0];
            sellerName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          }
        }
        
        const sellerEmail = sellerProfile?.email || '';

        const mappedProperty: PropertyDetailType = {
          id: propertyData.id,
          title: propertyData.title,
          price: Number(propertyData.price),
          market_price: Number(propertyData.market_price),
          location: propertyData.location,
          full_address: propertyData.full_address || '',
          description: propertyData.description || '',
          beds: propertyData.beds,
          baths: propertyData.baths,
          sqft: propertyData.sqft,
          images: propertyData.images || [],
          user_id: propertyData.user_id,
          below_market: parseFloat(belowMarket),
          seller_name: sellerName,
          seller_email: sellerEmail,
          seller_phone: '',
          seller_id: propertyData.user_id,
          reward: rewardAmount,
          after_repair_value: propertyData.after_repair_value ? Number(propertyData.after_repair_value) : undefined,
          estimated_rehab: propertyData.estimated_rehab ? Number(propertyData.estimated_rehab) : undefined,
          property_type: propertyData.property_type,
          year_built: propertyData.year_built || null,
          lot_size: propertyData.lot_size || null,
          parking: propertyData.parking || null,
          comparable_addresses: propertyData.comparable_addresses,
          created_at: propertyData.created_at,
          additional_images_link: propertyData.additional_images_link || null
        };

        setProperty(mappedProperty);

        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select('name, phone, email, id')
          .eq('id', propertyData.user_id)
          .single();

        if (sellerError) {
          console.error("Error fetching seller info:", sellerError);
        } else if (sellerData) {
          // Check if name is an actual name (not an email) and not empty
          let name = sellerName;
          if (sellerData.name && !sellerData.name.includes('@') && sellerData.name.trim() !== '') {
            name = sellerData.name;
          }
          
          setSellerInfo({
            name: name,
            phone: sellerData.phone || null,
            email: sellerData.email || null
          });

          setProperty(prev => {
            if (!prev) return null;
            return {
              ...prev,
              seller_name: name,
              seller_email: sellerData.email || sellerEmail,
              seller_phone: sellerData.phone || '',
            };
          });
        }

        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;
        const isCurrentUserOwner = currentUser?.id === propertyData.user_id;
        setIsOwner(isCurrentUserOwner);
        
        // Auto-approve all non-owner users - this is the key change
        if (!isCurrentUserOwner) {
          setIsApproved(true);
          setWaitlistStatus('approved');
        }
      }
    } catch (err: any) {
      setError(err);
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [propertyId]);

  useEffect(() => {
    setShouldShowSellerInfo(isOwner || isApproved);
  }, [isOwner, isApproved]);

  return {
    property,
    isLoading,
    error,
    sellerInfo,
    waitlistStatus,
    isOwner,
    isApproved,
    shouldShowSellerInfo,
    refreshProperty: fetchPropertyData
  };
};

export { usePropertyDetail };
