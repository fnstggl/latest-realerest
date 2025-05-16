
// Define the Property type to maintain compatibility across the codebase
interface Property {
  id: string;
  price: number;
  market_price: number; // Database field name
  marketPrice: number; // UI field name - no longer optional to fix type conflicts
  beds: number;
  baths: number;
  sqft: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  after_repair_value?: number;
  estimated_rehab?: number;
  reward?: number; 
  title: string;
  location: string;
  description?: string;
  images?: string[];
  image?: string; // Optional alias for first image - for compatibility
  property_type?: string;
  full_address?: string;
  additional_images?: string;
  additional_images_link?: string;
  belowMarket: number; // Changed from optional to required to match expectations
  waitlistCount?: number; // Used in UI but calculated, not stored
  lot_size?: string;  // Added missing property
  year_built?: string; // Added missing property
  parking?: string;    // Added missing property
}

// Define other shared types to fix the build errors
interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_id: string; // No longer optional to fix type conflicts
  propertyId: string;
  property?: {
    title: string;
  };
  status: "pending" | "accepted" | "declined";
  createdAt: string; // Added for sorting
}

// Define BuyerProgress and BuyerStatus types for the RewardProgress component
interface BuyerProgress {
  id: string;
  name: string;
  status?: BuyerStatus;
  foundBuyer: boolean;
  submittedOffer: boolean;
  offerAccepted: boolean;
  dealClosed: boolean;
  foundBuyerDate?: string;
  submittedOfferDate?: string;
  offerAcceptedDate?: string;
  dealClosedDate?: string;
  [key: string]: string | boolean | undefined; // Index signature for flexible access
}

type BuyerStatus = "Interested Buyer" | "Considering Buyer" | "Uninterested Buyer";

// Define RewardStatusDetails type for reward status
interface RewardStatusDetails {
  claimed: boolean;
  foundBuyer?: boolean;
  submittedOffer?: boolean;
  offerAccepted?: boolean;
  dealClosed?: boolean;
  buyers: BuyerProgress[];
  [key: string]: boolean | BuyerProgress[] | any; // Index signature to fix TypeScript errors
}

// Define Notification type ensuring timestamp is string or Date
interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  properties?: any;
  user_id: string;
  created_at: string;
  timestamp?: string | Date;
}

// Define Json type for jsonb fields
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
