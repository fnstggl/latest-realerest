import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserEmail?: string;
  latestMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  relatedOfferId?: string;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('id, participant1, participant2, updated_at')
        .or(`participant1.eq.${user.id},participant2.eq.${user.id}`)
        .order('updated_at', { ascending: false });
        
      if (conversationError) {
        console.error('Error fetching conversations:', conversationError);
        return;
      }
      
      if (!conversationData || conversationData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }
      
      const conversationsWithDetails = await Promise.all(
        conversationData.map(async (conversation) => {
          const otherUserId = conversation.participant1 === user.id 
            ? conversation.participant2 
            : conversation.participant1;
            
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', otherUserId)
            .single();
            
          const { data: messageData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          let userName = profileData?.name;
          if (!userName) {
            const { data: userData } = await supabase.rpc('get_user_email', {
              user_id_param: otherUserId
            });
            userName = userData || "Unknown";
          }
            
          return {
            id: conversation.id,
            otherUserId,
            otherUserName: userName,
            otherUserEmail: profileData?.email,
            latestMessage: messageData ? {
              content: messageData.content,
              timestamp: messageData.created_at,
              isRead: messageData.is_read,
              senderId: messageData.sender_id
            } : {
              content: 'No messages yet',
              timestamp: conversation.updated_at,
              isRead: true,
              senderId: ''
            }
          };
        })
      );
      
      setConversations(conversationsWithDetails);
      
      const unread = conversationsWithDetails.reduce((count, conversation) => {
        if (!conversation.latestMessage.isRead && conversation.latestMessage.senderId !== user.id) {
          return count + 1;
        }
        return count;
      }, 0);
      
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error processing conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      
      return data.map(message => ({
        id: message.id,
        conversationId: message.conversation_id,
        senderId: message.sender_id,
        content: message.content,
        timestamp: message.created_at,
        isRead: message.is_read,
        relatedOfferId: message.related_offer_id
      }));
    } catch (error) {
      console.error('Error processing messages:', error);
      return [];
    }
  }, [user?.id]);

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

  const markConversationAsRead = useCallback(async (conversationId: string) => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
        
      fetchConversations();
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }, [user?.id, fetchConversations]);

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
            fetchConversations();
            
            if (message.sender_id !== user.id) {
              supabase
                .from('profiles')
                .select('name')
                .eq('id', message.sender_id)
                .single()
                .then(({ data }) => {
                  if (data) {
                    supabase
                      .from('notifications')
                      .insert({
                        user_id: user.id,
                        title: 'New Message',
                        message: `${data.name || 'Someone'}: ${message.content}`,
                        type: 'message',
                        properties: {
                          conversationId: message.conversation_id,
                          senderId: message.sender_id
                        }
                      });
                      
                    toast('New Message', {
                      description: `${data.name || 'Someone'}: ${message.content}`,
                      action: {
                        label: 'View',
                        onClick: () => window.location.href = `/messages/${message.conversation_id}`
                      }
                    });
                  }
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
          fetchConversations();
        }
      )
      .subscribe();
    
    fetchConversations();
    
    return () => {
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(conversationSubscription);
    };
  }, [user?.id, fetchConversations]);

  return {
    conversations,
    loading,
    unreadCount,
    fetchMessages,
    sendMessage,
    getOrCreateConversation,
    markConversationAsRead,
    refreshConversations: fetchConversations
  };
};
