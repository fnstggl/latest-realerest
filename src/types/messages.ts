
export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserRole?: 'seller' | 'buyer' | 'wholesaler';
  latestMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isMine?: boolean;
  relatedOfferId?: string;
  propertyId?: string;
}

// Type definition to properly parse message data from Supabase
export interface MessageData {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  related_offer_id: string;
  property_id?: string;
  property_offers?: {
    property_id: string;
  };
}
