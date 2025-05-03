
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
        // Fetch conversation data
        const { data: convoData, error: convoError } = await supabase
          .from('conversations')
          .select('participant1, participant2')
          .eq('id', conversationId)
          .maybeSingle();

        if (convoError || !convoData) {
          console.error('Error fetching conversation:', convoError);
          navigateToMessages();
          return;
        }

        // Determine other user ID
        const otherUserId =
          convoData.participant1 === user?.id
            ? convoData.participant2
            : convoData.participant1;
        
        console.log('Fetching profile for user ID:', otherUserId);

        // COMPLETELY NEW APPROACH: Robust profile fetching with retry mechanism
        const fetchUserProfile = async (userId: string, retryCount = 2): Promise<{name?: string, email?: string, accountType?: string}> => {
          try {
            // Try to get profile from profiles table
            const { data, error } = await supabase
              .from('profiles')
              .select('name, email, account_type')
              .eq('id', userId)
              .maybeSingle();
              
            if (error) throw error;
            
            if (data) {
              console.log('Found profile data:', data);
              return {
                name: data.name,
                email: data.email,
                accountType: data.account_type
              };
            }
            
            // If no profile found and we have retries left
            if (retryCount > 0) {
              console.log(`No profile found, retrying (${retryCount} attempts left)`);
              // Wait before retry to allow for any race conditions
              await new Promise(resolve => setTimeout(resolve, 300));
              return fetchUserProfile(userId, retryCount - 1);
            }
            
            // Last resort - get email through RPC
            console.log('Falling back to RPC email lookup');
            const { data: emailData } = await supabase.rpc('get_user_email', {
              user_id_param: userId
            });
            
            return { email: emailData };
          } catch (err) {
            console.error('Error fetching user profile:', err);
            
            // If we have retries left, try again
            if (retryCount > 0) {
              console.log(`Error occurred, retrying (${retryCount} attempts left)`);
              await new Promise(resolve => setTimeout(resolve, 500));
              return fetchUserProfile(userId, retryCount - 1);
            }
            
            return {};
          }
        };
        
        // Execute the fetch with retries
        const userProfile = await fetchUserProfile(otherUserId);
        
        // Set user name with clear priority order
        if (userProfile.name && userProfile.name.trim() !== '') {
          setOtherUserName(userProfile.name);
          console.log('Using profile name:', userProfile.name);
        } else if (userProfile.email && userProfile.email.trim() !== '') {
          setOtherUserName(userProfile.email);
          console.log('Using email as name:', userProfile.email);
        } else {
          setOtherUserName('Unknown User');
          console.log('No user info found, using default name');
        }
        
        // Set role with validation
        if (userProfile.accountType === 'seller' || 
            userProfile.accountType === 'buyer' || 
            userProfile.accountType === 'wholesaler') {
          setOtherUserRole(userProfile.accountType as UserRole);
          console.log('User role set to:', userProfile.accountType);
        } else {
          setOtherUserRole('buyer');
          console.log('Invalid or missing role, using default buyer role');
        }

        // Fetch messages if we have a conversation ID
        if (conversationId && fetchMessages) {
          const messagesData = await fetchMessages(conversationId);
          setMessages(messagesData);

          // Mark messages as read if needed
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

    // Set up real-time subscription for new messages
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

          // Mark messages as read if they're not from the current user
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
