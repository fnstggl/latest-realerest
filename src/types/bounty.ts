
export type BuyerStatus = 'Interested Buyer' | 'Considering Buyer' | 'Uninterested Buyer';

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
  [key: string]: string | boolean | undefined;
}

export interface RewardStatusDetails {
  claimed: boolean;
  foundBuyer: boolean;
  submittedOffer: boolean;
  offerAccepted: boolean;
  dealClosed: boolean;
  buyers: BuyerProgress[];
  [key: string]: boolean | BuyerProgress[] | any;
}
