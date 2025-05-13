
// Define the Property type to maintain compatibility across the codebase
interface Property {
  id: string;
  price: number;
  market_price: number; // Database field name
  marketPrice?: number; // UI field name - optional to maintain compatibility
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
  belowMarket?: number; // Used in UI but calculated, not stored
  waitlistCount?: number; // Used in UI but calculated, not stored
  year_built?: string; // Adding optional properties referenced in usePropertyDetail
  lot_size?: string;
  parking?: string;
}

// Define other shared types to fix the build errors
interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_id?: string; // Make it optional for compatibility
  propertyId: string;
  property?: {
    title: string;
  };
  status: "pending" | "accepted" | "declined";
  createdAt: string; // Added for sorting
}

// Define Json type for jsonb fields
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Define RewardStatusDetails type for reward status
interface RewardStatusDetails {
  claimed: boolean;
  foundBuyer: boolean;
  submittedOffer: boolean;
  offerAccepted: boolean;
  dealClosed: boolean;
  [key: string]: boolean; // Index signature to fix TypeScript errors
}

// Define Notification type
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
