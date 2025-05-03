
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useConversations } from './messages/useConversations';
import { useMessageList } from './messages/useMessageList';
import { useMessageActions } from './messages/useMessageActions';
import { getUserDisplayName } from '@/utils/userUtils';

export type { Conversation, Message } from '@/types/messages';

export const useMessages = () => {
  const { user } = useAuth();
  const { conversations, loading, unreadCount, refreshConversations } = useConversations();
  const { fetchMessages, markMessagesAsRead } = useMessageList();
  const { sendMessage, getOrCreateConversation, markConversationAsRead } = useMessageActions();

  useEffect(() => {
    if (!user?.id) return;
    
    const messageSubscription = supabase
      .channel('messages_changes')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const message = payload.new as any;
          if (message) {
            refreshConversations();
            
            if (message.sender_id !== user.id) {
              getUserDisplayName(message.sender_id)
                .then(senderName => {
                  supabase
                    .from('notifications')
                    .insert({
                      user_id: user.id,
                      title: 'New Message',
                      message: `${senderName}: ${message.content}`,
                      type: 'message',
                      properties: {
                        conversationId: message.conversation_id,
                        senderId: message.sender_id
                      }
                    });
                    
                  toast('New Message', {
                    description: `${senderName}: ${message.content}`,
                    action: {
                      label: 'View',
                      onClick: () => window.location.href = `/messages/${message.conversation_id}`
                    }
                  });
                });
            }
          }
        }
      )
      .subscribe();
      
    const conversationSubscription = supabase
      .channel('conversations_changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          refreshConversations();
        }
      )
      .subscribe();
    
    refreshConversations();
    
    return () => {
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(conversationSubscription);
    };
  }, [user?.id, refreshConversations]);

  return {
    conversations,
    loading,
    unreadCount,
    fetchMessages,
    sendMessage,
    getOrCreateConversation,
    markConversationAsRead,
    markMessagesAsRead,
    refreshConversations,
    getUserDisplayName
  };
};
