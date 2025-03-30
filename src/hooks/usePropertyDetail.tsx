
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PropertyDetail {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  description?: string;
  image: string;
  images?: string[];
  location: string;
  full_address?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  sellerId?: string;
  sellerName?: string;
  afterRepairValue?: number;
  estimatedRehab?: number;
  comparables?: string[];
  createdAt?: string;
  sellerPhone?: string | null;
  sellerEmail?: string | null;
}

export const usePropertyDetail = (propertyId: string | undefined) => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { user } = useAuth();

  // Check if user is on the waitlist and approved
  useEffect(() => {
    if (!user?.id || !propertyId) return;
    
    const checkWaitlistStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlist_requests')
          .select('status')
          .eq('property_id', propertyId)
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking waitlist status:", error);
          return;
        }
        
        if (data) {
          const isUserApproved = data.status === 'accepted';
          setIsApproved(isUserApproved);
          console.log("Waitlist status:", data.status, "isApproved set to:", isUserApproved);
        }
      } catch (error) {
        console.error("Error checking waitlist approval:", error);
      }
    };
    
    checkWaitlistStatus();
  }, [user?.id, propertyId]);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      
      setLoading(true);
      try {
        // Fetch property data
        const { data: propertyData, error: propertyError } = await supabase
          .from('property_listings')
          .select('*')
          .eq('id', propertyId)
          .single();
          
        if (propertyError) {
          console.error("Error fetching property:", propertyError);
          throw propertyError;
        }
        
        console.log("Property data from Supabase:", propertyData);
        
        if (!propertyData.user_id) {
          console.error("No user_id found for this property listing");
          toast.error("Seller information not available for this listing");
        }
        
        // Fetch seller information from profiles table
        let sellerData = null;
        if (propertyData.user_id) {
          const { data: seller, error: sellerError } = await supabase
            .from('profiles')
            .select('name, email, phone')
            .eq('id', propertyData.user_id)
            .single();
          
          if (sellerError) {
            console.error("Error fetching seller profile:", sellerError);
            if (sellerError.code === 'PGRST116') {
              console.log("No profile found for user ID:", propertyData.user_id);
            }
          } else {
            sellerData = seller;
            console.log("Seller data from Supabase:", sellerData);
          }
        }
        
        // Transform property data
        if (propertyData) {
          const transformedProperty: PropertyDetail = {
            id: propertyData.id,
            title: propertyData.title || 'Property Listing',
            price: Number(propertyData.price) || 0,
            marketPrice: Number(propertyData.market_price) || 0,
            description: propertyData.description,
            image: propertyData.images && propertyData.images.length > 0 
              ? propertyData.images[0] 
              : '/placeholder.svg',
            images: propertyData.images || [],
            location: propertyData.location || 'Unknown location',
            full_address: propertyData.full_address || '',
            beds: propertyData.beds || 0,
            baths: propertyData.baths || 0,
            sqft: propertyData.sqft || 0,
            belowMarket: calculateBelowMarket(Number(propertyData.market_price), Number(propertyData.price)),
            sellerId: propertyData.user_id || null,
            sellerName: sellerData?.name || 'Property Owner',
            sellerPhone: sellerData?.phone || null,
            sellerEmail: sellerData?.email || null,
            afterRepairValue: propertyData.after_repair_value !== null 
              ? Number(propertyData.after_repair_value) 
              : undefined,
            estimatedRehab: propertyData.estimated_rehab !== null 
              ? Number(propertyData.estimated_rehab) 
              : undefined
          };
          
          setProperty(transformedProperty);
          
          if (user?.id && user.id === propertyData.user_id) {
            setIsOwner(true);
          }
        } else {
          fallbackToLocalStorage();
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        fallbackToLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const fallbackToLocalStorage = () => {
      try {
        const allListingsJSON = localStorage.getItem('propertyListings');
        if (allListingsJSON) {
          const allListings = JSON.parse(allListingsJSON);
          const foundProperty = allListings.find((p: PropertyDetail) => p.id === propertyId);
          
          if (foundProperty) {
            setProperty(foundProperty);
            
            if (user?.id && foundProperty.sellerId === user.id) {
              setIsOwner(true);
            }
          } else {
            toast.error("Property not found");
          }
        } else {
          toast.error("No property listings found");
        }
      } catch (error) {
        console.error("Error fetching property from localStorage:", error);
        toast.error("Failed to load property details");
      }
    };
    
    const calculateBelowMarket = (marketPrice: number, listingPrice: number): number => {
      if (!marketPrice || !listingPrice || marketPrice <= 0) return 0;
      return Math.round(((marketPrice - listingPrice) / marketPrice) * 100);
    };

    fetchProperty();
  }, [propertyId, user?.id]);

  // Determine if the seller contact info should be shown
  const shouldShowSellerInfo = isOwner || isApproved;
  console.log("Debug - isOwner:", isOwner, "isApproved:", isApproved, "shouldShowSellerInfo:", shouldShowSellerInfo);
  if (property) {
    console.log("Debug - Seller data to display:", {
      name: property.sellerName,
      phone: property.sellerPhone,
      email: property.sellerEmail
    });
  }

  return {
    property,
    loading,
    isOwner,
    isApproved,
    shouldShowSellerInfo
  };
};
