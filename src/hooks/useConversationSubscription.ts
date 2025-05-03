
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, useMessages } from '@/hooks/useMessages';

interface UseConversationSubscriptionProps {
  conversationId: string;
  userId?: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  markMessagesAsRead?: (conversationId: string) => void;
}

export const useConversationSubscription = ({
  conversationId,
  userId,
  setMessages,
  markMessagesAsRead
}: UseConversationSubscriptionProps) => {
  useEffect(() => {
    if (!conversationId) return;
    
    // Set up subscription for new messages
    const messagesSubscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            content: payload.new.content,
            senderId: payload.new.sender_id,
            conversationId: payload.new.conversation_id,
            timestamp: payload.new.created_at,
            isRead: payload.new.is_read,
            isMine: payload.new.sender_id === userId,
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          // Mark received message as read immediately
          if (payload.new.sender_id !== userId && conversationId && markMessagesAsRead) {
            markMessagesAsRead(conversationId);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [conversationId, userId, markMessagesAsRead, setMessages]);
};
