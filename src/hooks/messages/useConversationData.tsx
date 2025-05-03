
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types/messages';
import { UserRole } from '@/components/UserTag';
import { getUserDisplayName, getUserRole } from '@/utils/userUtils';

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

        const otherUserId =
          convoData.participant1 === user?.id
            ? convoData.participant2
            : convoData.participant1;
        
        console.log('Fetching profile for user ID:', otherUserId);

        // First, try to get the user's profile from the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, email, account_type')
          .eq('id', otherUserId)
          .maybeSingle(); // Using maybeSingle instead of single to prevent errors

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }

        // Handle profile data if available
        if (profileData) {
          console.log('Profile data retrieved:', profileData);
          
          // Set the user name, prioritizing name over email
          if (profileData.name && profileData.name.trim() !== '') {
            setOtherUserName(profileData.name);
          } else if (profileData.email && profileData.email.trim() !== '') {
            setOtherUserName(profileData.email);
          } else {
            // If both name and email are empty in the profile, we'll get the email using RPC
            const { data: userData } = await supabase.rpc('get_user_email', {
              user_id_param: otherUserId
            });
            setOtherUserName(userData || 'Unknown User');
          }

          // Set user role, with validation to ensure it's a valid role type
          if (profileData.account_type === 'seller' || 
              profileData.account_type === 'buyer' || 
              profileData.account_type === 'wholesaler') {
            setOtherUserRole(profileData.account_type as UserRole);
          } else {
            console.warn(`Invalid account_type "${profileData.account_type}", defaulting to "buyer"`);
            setOtherUserRole('buyer');
          }
        } else {
          // Fallback if no profile data found
          console.log('No profile data found, using fallback method');
          
          // Get user email through RPC call
          const { data: userData } = await supabase.rpc('get_user_email', {
            user_id_param: otherUserId
          });
          
          setOtherUserName(userData || 'Unknown User');
          setOtherUserRole('buyer'); // Default role when no profile data is available
          
          console.log('Fallback name set to:', userData || 'Unknown User');
        }

        if (conversationId && fetchMessages) {
          const messagesData = await fetchMessages(conversationId);
          setMessages(messagesData);

          if (markMessagesAsRead) {
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

    const messagesSubscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
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

          setMessages((prevMessages) => [...prevMessages, newMessage]);

          if (
            payload.new.sender_id !== user?.id &&
            markMessagesAsRead &&
            conversationId
          ) {
            markMessagesAsRead(conversationId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [conversationId, user?.id, navigateToMessages, markMessagesAsRead, fetchMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !conversationId || !user?.id) return false;

      try {
        setSending(true);

        const { error } = await supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          is_read: false,
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
    },
    [conversationId, user?.id]
  );

  return {
    otherUserName,
    otherUserRole,
    messages,
    loading,
    sending,
    sendMessage,
  };
};
