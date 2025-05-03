
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types/messages';
import { UserRole } from '@/components/UserTag';

interface UseConversationDataProps {
  conversationId: string | undefined;
  fetchMessages?: (id: string) => Promise<Message[]>;
  markMessagesAsRead?: (id: string) => void;
  navigateToMessages: () => void;
}

export interface ConversationData {
  otherUserName: string;
  otherUserRole: UserRole;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  sendMessage: (content: string) => Promise<boolean>;
}

export const useConversationData = ({
  conversationId,
  fetchMessages,
  markMessagesAsRead,
  navigateToMessages
}: UseConversationDataProps): ConversationData => {
  const { user } = useAuth();
  const [otherUserName, setOtherUserName] = useState<string>('');
  const [otherUserRole, setOtherUserRole] = useState<UserRole>('buyer');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      navigateToMessages();
      return;
    }
    
    const fetchConversationData = async () => {
      setLoading(true);
      
      try {
        // First, get conversation participants
        const { data: convoData, error: convoError } = await supabase
          .from('conversations')
          .select('participant1, participant2')
          .eq('id', conversationId)
          .single();
          
        if (convoError || !convoData) {
          console.error('Error fetching conversation:', convoError);
          navigateToMessages();
          return;
        }
        
        // Find the other user's ID
        const otherUserId = convoData.participant1 === user?.id ? convoData.participant2 : convoData.participant1;
        
        // Get other user's profile info with improved profile data fetching
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, email, account_type')
          .eq('id', otherUserId)
          .single();
          
        if (!profileError && profileData) {
          // Prefer name over email for display
          setOtherUserName(profileData.name || profileData.email || 'Unknown User');
          
          // Ensure we only use valid role types
          const roleType = 
            profileData.account_type === 'seller' || 
            profileData.account_type === 'buyer' || 
            profileData.account_type === 'wholesaler' 
              ? profileData.account_type as UserRole 
              : 'buyer';
          setOtherUserRole(roleType);
        } else {
          // Fallback to getting email via RPC function if profile fetch fails
          const { data: userData } = await supabase.rpc('get_user_email', {
            user_id_param: otherUserId
          });
          
          if (userData) {
            setOtherUserName(userData);
            setOtherUserRole('buyer'); // Default role if we couldn't get from profile
          }
        }
        
        // Get messages using our hook
        if (conversationId && fetchMessages) {
          const messagesData = await fetchMessages(conversationId);
          setMessages(messagesData);
          
          // Mark messages as read
          if (conversationId && markMessagesAsRead) {
            markMessagesAsRead(conversationId);
          }
        }
      } catch (error) {
        console.error('Error in conversation data fetching:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversationData();
    
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
            isMine: payload.new.sender_id === user?.id,
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          // Mark received message as read immediately
          if (payload.new.sender_id !== user?.id && conversationId && markMessagesAsRead) {
            markMessagesAsRead(conversationId);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [conversationId, user?.id, navigateToMessages, markMessagesAsRead, fetchMessages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !conversationId || !user?.id) return false;
    
    try {
      setSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          is_read: false
        });
        
      if (error) {
        console.error('Error sending message:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in send message:', error);
      return false;
    } finally {
      setSending(false);
    }
  }, [conversationId, user?.id]);

  return {
    otherUserName,
    otherUserRole,
    messages,
    loading,
    sending,
    sendMessage
  };
};
