
export interface RewardStatusDetails {
  claimed: boolean;
  foundBuyer: boolean;
  submittedOffer: boolean;
  offerAccepted: boolean;
  dealClosed: boolean;
  foundBuyerDate?: string;
  submittedOfferDate?: string;
  offerAcceptedDate?: string;
  dealClosedDate?: string;
  buyerName?: string;
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
  buyers?: RewardStatusDetails[];
}
