import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  bounty?: number;
  reward?: number;
  after_repair_value?: number;
  estimated_rehab?: number;
  property_type?: string;
  year_built?: number;
  lot_size?: number;
  parking?: string;
  comparable_addresses?: string[];
  created_at?: string;
};

const usePropertyDetail = (propertyId?: string) => {
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
          seller_name: '',
          seller_email: '',
          seller_phone: '',
          seller_id: propertyData.user_id,
          bounty: Number(propertyData.reward || 0),
          after_repair_value: propertyData.after_repair_value ? Number(propertyData.after_repair_value) : undefined,
          estimated_rehab: propertyData.estimated_rehab ? Number(propertyData.estimated_rehab) : undefined,
          property_type: propertyData.property_type || undefined,
          year_built: propertyData.year_built || undefined,
          lot_size: propertyData.lot_size || undefined,
          parking: propertyData.parking || undefined,
          comparable_addresses: propertyData.comparable_addresses || [],
          created_at: propertyData.created_at
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
          setSellerInfo({
            name: sellerData.name || null,
            phone: sellerData.phone || null,
            email: sellerData.email || null
          });

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

        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;
        const isCurrentUserOwner = currentUser?.id === propertyData.user_id;
        setIsOwner(isCurrentUserOwner);

        if (currentUser?.id && currentUser?.id !== propertyData.user_id) {
          const { data: waitlistData, error: waitlistError } = await supabase
            .from('waitlist_requests')
            .select('status')
            .eq('property_id', propertyId)
            .eq('user_id', currentUser.id)
            .single();

          if (waitlistError && !waitlistError.message.includes('No rows found')) {
            console.error("Error fetching waitlist status:", waitlistError);
          } else if (waitlistData) {
            setWaitlistStatus(waitlistData.status || null);
            setIsApproved(waitlistData.status === 'approved');
          } else {
            setWaitlistStatus(null);
          }
        } else {
          setWaitlistStatus(null);
          setIsApproved(isCurrentUserOwner);
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
