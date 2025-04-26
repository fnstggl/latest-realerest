import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Update the type to include optional properties
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
  bounty: number;
  after_repair_value?: number;
  estimated_rehab?: number;
  property_type?: string;
  year_built?: number;
  lot_size?: number;
  parking?: string;
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

  useEffect(() => {
    const fetchProperty = async () => {
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
          setProperty(propertyData);

          // Fetch seller info
          const { data: sellerData, error: sellerError } = await supabase
            .from('profiles')
            .select('full_name, phone, email, id')
            .eq('id', propertyData.user_id)
            .single();

          if (sellerError) {
            console.error("Error fetching seller info:", sellerError);
          } else {
            setSellerInfo({
              name: sellerData?.full_name || null,
              phone: sellerData?.phone || null,
              email: sellerData?.email || null
            });
          }

          // Determine if the current user is the owner
          const { data: authData } = await supabase.auth.getUser();
          const currentUser = authData?.user;
          setIsOwner(currentUser?.id === propertyData.user_id);

          // Fetch waitlist status
          if (currentUser?.id && currentUser?.id !== propertyData.user_id) {
            const { data: waitlistData, error: waitlistError } = await supabase
              .from('property_waitlist')
              .select('status')
              .eq('property_id', propertyId)
              .eq('user_id', currentUser.id)
              .single();

            if (waitlistError) {
              console.error("Error fetching waitlist status:", waitlistError);
            } else {
              setWaitlistStatus(waitlistData?.status || null);
              setIsApproved(waitlistData?.status === 'approved');
            }
          } else {
            setWaitlistStatus(null);
            setIsApproved(true); // Owner is automatically approved
          }
        }
      } catch (err: any) {
        setError(err);
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    setShouldShowSellerInfo(isOwner || isApproved);
  }, [isOwner, isApproved]);

  const refreshProperty = () => {
    fetchProperty();
  };

  const fetchProperty = async () => {
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
        setProperty(propertyData);

        // Fetch seller info
        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select('full_name, phone, email, id')
          .eq('id', propertyData.user_id)
          .single();

        if (sellerError) {
          console.error("Error fetching seller info:", sellerError);
        } else {
          setSellerInfo({
            name: sellerData?.full_name || null,
            phone: sellerData?.phone || null,
            email: sellerData?.email || null
          });
        }

        // Determine if the current user is the owner
        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;
        setIsOwner(currentUser?.id === propertyData.user_id);

        // Fetch waitlist status
        if (currentUser?.id && currentUser?.id !== propertyData.user_id) {
          const { data: waitlistData, error: waitlistError } = await supabase
            .from('property_waitlist')
            .select('status')
            .eq('property_id', propertyId)
            .eq('user_id', currentUser.id)
            .single();

          if (waitlistError) {
            console.error("Error fetching waitlist status:", waitlistError);
          } else {
            setWaitlistStatus(waitlistData?.status || null);
            setIsApproved(waitlistData?.status === 'approved');
          }
        } else {
          setWaitlistStatus(null);
          setIsApproved(true); // Owner is automatically approved
        }
      }
    } catch (err: any) {
      setError(err);
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    property,
    isLoading,
    error,
    sellerInfo,
    waitlistStatus,
    isOwner,
    isApproved,
    shouldShowSellerInfo,
    refreshProperty
  };
};

export { usePropertyDetail };
