
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useMessageActions = () => {
  const { user } = useAuth();

  const sendMessage = useCallback(async (
    conversationId: string, 
    content: string, 
    relatedOfferId?: string
  ) => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          related_offer_id: relatedOfferId
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return null;
      }
      
      return {
        id: data.id,
        conversationId: data.conversation_id,
        senderId: data.sender_id,
        content: data.content,
        timestamp: data.created_at,
        isRead: data.is_read,
        relatedOfferId: data.related_offer_id
      };
    } catch (error) {
      console.error('Error processing message send:', error);
      toast.error('Failed to send message');
      return null;
    }
  }, [user?.id]);

  const getOrCreateConversation = useCallback(async (otherUserId: string) => {
    if (!user?.id || !otherUserId) return null;
    
    try {
      const { data: existingConversation, error: existingError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant1.eq.${user.id},participant2.eq.${otherUserId}),and(participant1.eq.${otherUserId},participant2.eq.${user.id})`)
        .limit(1)
        .maybeSingle();
        
      if (existingError) {
        console.error('Error checking existing conversation:', existingError);
        return null;
      }
      
      if (existingConversation) {
        return existingConversation.id;
      }
      
      const { data: newConversation, error: newError } = await supabase
        .from('conversations')
        .insert({
          participant1: user.id,
          participant2: otherUserId
        })
        .select()
        .single();
        
      if (newError) {
        console.error('Error creating conversation:', newError);
        toast.error('Failed to create conversation');
        return null;
      }
      
      return newConversation.id;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      return null;
    }
  }, [user?.id]);

  const markConversationAsRead = useCallback(async (conversationId: string, refreshCallback?: () => void) => {
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
    sendMessage,
    getOrCreateConversation,
    markConversationAsRead
  };
};
