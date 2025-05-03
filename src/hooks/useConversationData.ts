
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMessages, Message } from '@/hooks/useMessages';
import { useUserProfiles, UserProfile } from '@/hooks/useUserProfiles';

interface UseConversationDataResult {
  messages: Message[];
  loading: boolean;
  sending: boolean;
  otherUserId: string | null;
  otherUserProfile: UserProfile | null;
  profileLoading: boolean;
  sendMessage: (content: string) => Promise<boolean>;
}

export const useConversationData = (
  conversationId: string | undefined, 
  userId: string | undefined
): UseConversationDataResult => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [otherUserProfile, setOtherUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const { markMessagesAsRead, fetchMessages } = useMessages();
  const { getUserProfile } = useUserProfiles();

  // Fetch conversation data
  useEffect(() => {
    if (!conversationId || !userId) return;
    
    const fetchConversationData = async () => {
      setLoading(true);
      
      try {
        console.log(`[Conversation] Starting data fetch for conversation: ${conversationId}`);
        
        // First, get conversation participants
        const { data: convoData, error: convoError } = await supabase
          .from('conversations')
          .select('participant1, participant2')
          .eq('id', conversationId)
          .single();
          
        if (convoError || !convoData) {
          console.error('[Conversation] Error fetching conversation:', convoError);
          return;
        }
        
        // Find the other user's ID
        const otherUserId = convoData.participant1 === userId ? convoData.participant2 : convoData.participant1;
        setOtherUserId(otherUserId);
        console.log('[Conversation] Identified other user ID in conversation:', otherUserId);
        
        // Fetch messages
        if (fetchMessages) {
          try {
            const data = await fetchMessages(conversationId);
            console.log(`[Conversation] Fetched ${data.length} messages`);
            setMessages(data);
            
            // Mark messages as read
            if (markMessagesAsRead) {
              markMessagesAsRead(conversationId);
            }
          } catch (error) {
            console.error('[Conversation] Error fetching messages:', error);
          }
        }
        
        // Fetch user profile separately to avoid race conditions
        setProfileLoading(true);
        try {
          const profile = await getUserProfile(otherUserId);
          console.log(`[Conversation] User profile retrieved:`, profile);
          
          if (profile) {
            setOtherUserProfile(profile);
          } else {
            throw new Error("Failed to fetch profile");
          }
        } catch (error) {
          console.error('[Conversation] Error getting user profile:', error);
          // Create fallback profile
          setOtherUserProfile({
            id: otherUserId,
            name: "Unknown User",
            email: "",
            role: "buyer",
            _source: "fallback"
          });
        } finally {
          setProfileLoading(false);
        }
      } catch (error) {
        console.error('[Conversation] Error in conversation data fetching:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversationData();
  }, [conversationId, userId, fetchMessages, markMessagesAsRead, getUserProfile]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !conversationId || !userId) return false;
    
    try {
      setSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
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
  }, [conversationId, userId]);

  return {
    messages,
    loading,
    sending,
    otherUserId,
    otherUserProfile,
    profileLoading,
    sendMessage
  };
};
