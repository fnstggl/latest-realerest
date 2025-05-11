
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useUserProfiles } from '@/hooks/useUserProfiles';

interface PropertyDetail {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  location: string;
  fullAddress?: string;
  description?: string;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  afterRepairValue?: number | null;
  estimatedRehab?: number | null;
  reward?: number | null;
  belowMarket: number;
  userName?: string;
  userEmail?: string;
  propertyType?: string;
  additionalImagesLink?: string | null;
  yearBuilt?: string | null;
  lotSize?: string | null;
  parking?: string | null;
  // For backward compatibility with existing code
  seller_name?: string | null; 
  seller_email?: string | null;
  seller_phone?: string | null;
  seller_id?: string | null;
  comparable_addresses?: string[];
}

export interface WaitlistStatus {
  isOnWaitlist: boolean;
  isApproved: boolean;
  requestId?: string;
}

export interface PropertyUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const usePropertyDetail = (propertyId?: string) => {
  const { user } = useAuth();
  const { getUserProfile } = useUserProfiles();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sellerInfo, setSellerInfo] = useState<{ name: string | null; phone: string | null; email: string | null }>({ name: null, phone: null, email: null });
  const [waitlistStatus, setWaitlistStatus] = useState<WaitlistStatus | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [shouldShowSellerInfo, setShouldShowSellerInfo] = useState(false);

  const fetchPropertyData = useCallback(async () => {
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

        // Safely access optional fields
        const yearBuilt = propertyData.year_built || null;
        const lotSize = propertyData.lot_size || null;
        const parking = propertyData.parking || null;

        const mappedProperty: PropertyDetail = {
          id: propertyData.id,
          title: propertyData.title,
          price: Number(propertyData.price),
          marketPrice: Number(propertyData.market_price),
          location: propertyData.location,
          fullAddress: propertyData.full_address || '',
          description: propertyData.description || '',
          beds: propertyData.beds,
          baths: propertyData.baths,
          sqft: propertyData.sqft,
          images: propertyData.images || [],
          userId: propertyData.user_id,
          createdAt: propertyData.created_at,
          updatedAt: propertyData.updated_at,
          afterRepairValue: propertyData.after_repair_value ? Number(propertyData.after_repair_value) : undefined,
          estimatedRehab: propertyData.estimated_rehab ? Number(propertyData.estimated_rehab) : undefined,
          reward: rewardAmount,
          belowMarket: parseFloat(belowMarket),
          userName: sellerName,
          userEmail: sellerEmail,
          propertyType: propertyData.property_type,
          additionalImagesLink: propertyData.additional_images_link || null,
          yearBuilt: yearBuilt,
          lotSize: lotSize,
          parking: parking,
          comparable_addresses: propertyData.comparable_addresses || [],
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

          // Update seller-related properties
          const updatedProperty = {
            ...mappedProperty,
            seller_name: name,
            seller_email: sellerData.email || sellerEmail,
            seller_phone: sellerData.phone || '',
            seller_id: sellerData.id
          };
          
          setProperty(updatedProperty);
        }

        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;
        const isCurrentUserOwner = currentUser?.id === propertyData.user_id;
        setIsOwner(isCurrentUserOwner);
        
        // Auto-approve all non-owner users - this is the key change
        if (!isCurrentUserOwner) {
          setIsApproved(true);
          setWaitlistStatus({ isOnWaitlist: true, isApproved: true });
        }
      }
    } catch (err: any) {
      setError(err);
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, getUserProfile]);

  useEffect(() => {
    fetchPropertyData();
  }, [propertyId, fetchPropertyData]);

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
