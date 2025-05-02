
export type BuyerStatus = "Interested Buyer" | "Considering Buyer" | "Uninterested Buyer";

export interface BuyerProgress {
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
}

export interface RewardStatusDetails {
  claimed: boolean;
  buyers: BuyerProgress[];
}

export interface BountyClaim {
  id: string;
  user_id: string;
  property_id: string;
  buyer_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  status_details: RewardStatusDetails;
}
