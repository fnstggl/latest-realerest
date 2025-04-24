import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface PropertyDetail {
  id: string;
  title: string;
  description?: string;
  price: number;
  marketPrice: number;
  images: string[];
  location: string;
  fullAddress?: string;
  beds: number;
  baths: number;
  sqft: number;
  userId: string;
  comparableAddresses?: string[];
  afterRepairValue?: number;
  estimatedRehab?: number;
  belowMarket: number;
  createdAt: string;
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  bounty?: number;
}

interface SellerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

interface WaitlistStatus {
  status: 'pending' | 'accepted' | 'declined' | null;
}

export function usePropertyDetail(propertyId: string | undefined) {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [shouldShowSellerInfo, setShouldShowSellerInfo] = useState(false);
  const { user } = useAuth();
  
  const fetchProperty = useCallback(async () => {
    if (!propertyId) {
      setError('Property ID is required');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch property data
      const { data, error: propertyError } = await supabase
        .from('property_listings')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (propertyError) {
        setError('Property not found');
        setIsLoading(false);
        return;
      }
      
      if (!data) {
        setError('Property not found');
        setIsLoading(false);
        return;
      }
      
      // Format property data
      const formattedProperty: PropertyDetail = {
        id: data.id,
        title: data.title || 'Property Listing',
        description: data.description,
        price: Number(data.price),
        marketPrice: Number(data.market_price),
        images: data.images || [],
        location: data.location,
        fullAddress: data.full_address,
        beds: data.beds || 0,
        baths: data.baths || 0,
        sqft: data.sqft || 0,
        userId: data.user_id,
        comparableAddresses: data.comparable_addresses,
        afterRepairValue: data.after_repair_value ? Number(data.after_repair_value) : undefined,
        estimatedRehab: data.estimated_rehab ? Number(data.estimated_rehab) : undefined,
        belowMarket: Math.round(((Number(data.market_price) - Number(data.price)) / Number(data.market_price)) * 100),
        createdAt: data.created_at,
        sellerId: data.user_id,
        bounty: data.bounty ? Number(data.bounty) : undefined
      };
      
      setProperty(formattedProperty);
      
      // Check if user is the owner of this property
      if (user && user.id === data.user_id) {
        setIsOwner(true);
        setShowContact(true);
      }
      
      // Fetch seller info
      await fetchSellerInfo(data.user_id);
      
      // Check waitlist status
      if (user) {
        await checkWaitlistStatus(propertyId, user.id);
      }
      
    } catch (err) {
      console.error("Error fetching property:", err);
      setError('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, user]);
  
  const fetchSellerInfo = async (userId: string) => {
    try {
      // Try to get from profiles first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, email, phone')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching seller profile:", profileError);
      }
      
      let sellerName = null;
      let sellerEmail = null;
      let sellerPhone = null;
      
      if (profileData) {
        sellerName = profileData.name;
        sellerEmail = profileData.email;
        sellerPhone = profileData.phone;
        
        setSellerInfo({
          name: sellerName,
          email: sellerEmail,
          phone: sellerPhone
        });
      } 
      
      // If no profile name, fallback to email username
      if (!sellerName) {
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_email', { user_id_param: userId });
        
        if (emailError) {
          console.error("Error getting seller email:", emailError);
        } else if (emailData) {
          const emailName = emailData.split('@')[0];
          sellerName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          sellerEmail = emailData;
          
          setSellerInfo({
            name: sellerName,
            email: sellerEmail
          });
        }
      }
      
      // Always update property with seller info regardless of source
      if (sellerName || sellerEmail || sellerPhone) {
        setProperty(prevProperty => {
          if (!prevProperty) return null;
          return {
            ...prevProperty,
            sellerName: sellerName || "Unknown Seller", // Prevent fallback to "Property Owner"
            sellerEmail,
            sellerPhone
          };
        });
      }
      
    } catch (err) {
      console.error("Error fetching seller info:", err);
    }
  };
  
  const checkWaitlistStatus = async (propertyId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('waitlist_requests')
        .select('status')
        .eq('property_id', propertyId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking waitlist status:", error);
        return;
      }
      
      console.log("Current waitlist status:", data?.status);
      
      if (data) {
        setWaitlistStatus(data.status as 'pending' | 'accepted' | 'declined');
        
        // Show contact info if waitlist request was accepted
        if (data.status === 'accepted') {
          setIsApproved(true);
          setShowContact(true);
          setShouldShowSellerInfo(true);
        } else if (data.status === 'pending') {
          setShouldShowSellerInfo(true);
        }
      } else {
        // No waitlist request found
        setWaitlistStatus(null);
        
        // If this is the property owner, show contact info
        if (property && property.userId === userId) {
          setIsOwner(true);
          setShowContact(true);
          setShouldShowSellerInfo(true);
        }
      }
    } catch (err) {
      console.error("Error checking waitlist status:", err);
    }
  };
  
  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);
  
  const refreshProperty = () => {
    fetchProperty();
  };
  
  return {
    property,
    isLoading,
    error,
    sellerInfo,
    showContact,
    waitlistStatus,
    refreshProperty,
    isOwner,
    isApproved,
    shouldShowSellerInfo
  };
}
