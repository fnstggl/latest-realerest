
// Define the types for bounty status to fix TypeScript errors
export interface RewardStatusDetails {
  claimed: boolean;
  foundBuyer: boolean;
  submittedOffer: boolean;
  offerAccepted: boolean;
  dealClosed: boolean;
}

export type BountyStatus = 'claimed' | 'in_progress' | 'completed' | 'cancelled';

export interface BountyClaim {
  id: string;
  user_id: string;
  property_id: string;
  buyer_id?: string | null;
  created_at: string;
  updated_at: string;
  status: BountyStatus;
  status_details: RewardStatusDetails;
}
