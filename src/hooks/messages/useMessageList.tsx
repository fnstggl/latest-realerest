
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Message, MessageData } from '@/types/messages';

export const useMessageList = () => {
  const { user } = useAuth();

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, property_offers!messages_related_offer_id_fkey(property_id)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      
      // Process messages to include property IDs
      const processedMessages = await Promise.all(data.map(async (message: MessageData) => {
        let propertyId = undefined;
        
        // Check if property_id exists directly on the message
        if ('property_id' in message && message.property_id) {
          propertyId = message.property_id;
        }
        // If not, check if it has a related offer
        else if (message.related_offer_id) {
          const { data: offerData } = await supabase
            .from('property_offers')
            .select('property_id')
            .eq('id', message.related_offer_id)
            .maybeSingle();
            
          if (offerData) {
            propertyId = offerData.property_id;
          }
        }
        
        return {
          id: message.id,
          conversationId: message.conversation_id,
          senderId: message.sender_id,
          content: message.content,
          timestamp: message.created_at,
          isRead: message.is_read,
          isMine: message.sender_id === user?.id,
          relatedOfferId: message.related_offer_id,
          propertyId
        };
      }));
      
      return processedMessages;
    } catch (error) {
      console.error('Error processing messages:', error);
      return [];
    }
  }, [user?.id]);

  const markMessagesAsRead = useCallback(async (conversationId: string, refreshCallback?: () => void) => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
        
      if (refreshCallback) refreshCallback();
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }, [user?.id]);

  return {
    fetchMessages,
    markMessagesAsRead
  };
};
