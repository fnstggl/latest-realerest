
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  timestamp: string;
  isRead: boolean;
  isMine?: boolean;
}

export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserProfile?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    account_type?: string;
  } | null;
  lastMessage?: {
    content: string;
    is_read: boolean;
    sender_id: string;
    created_at: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  otherUserName?: string;
  otherUserRole?: string;
}

export function useMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refreshConversations = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data: conversationData, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1.eq.${user.id},participant2.eq.${user.id}`)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('[useMessages] Error fetching conversations:', error);
        return;
      }
      
      if (!conversationData.length) {
        setConversations([]);
        setLoading(false);
        return;
      }
      
      let totalUnreadCount = 0;
      
      const enrichedConversations = await Promise.all(
        conversationData.map(async (convo) => {
          // Determine the other user in the conversation
          const otherUserId = convo.participant1 === user.id ? convo.participant2 : convo.participant1;
          
          // Get the last message in the conversation
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('content, is_read, sender_id, created_at')
            .eq('conversation_id', convo.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          // Count unread messages
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', convo.id)
            .eq('sender_id', otherUserId)
            .eq('is_read', false);
            
          if (unreadCount) {
            totalUnreadCount += unreadCount;
          }
          
          // Get other user's profile
          const { data: otherUserProfile } = await supabase
            .from('profiles')
            .select('name, email, phone, account_type')
            .eq('id', otherUserId)
            .maybeSingle();
          
          return {
            id: convo.id,
            otherUserId,
            otherUserProfile,
            otherUserName: otherUserProfile?.name || 'Unknown User',
            otherUserRole: otherUserProfile?.account_type || 'buyer',
            lastMessage: lastMessageData || undefined,
            unreadCount: unreadCount || 0,
            createdAt: convo.created_at,
            updatedAt: convo.updated_at
          };
        })
      );
      
      setUnreadCount(totalUnreadCount);
      setConversations(enrichedConversations);
    } catch (err) {
      console.error('[useMessages] Error processing conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const getOrCreateConversation = useCallback(async (otherUserId: string) => {
    if (!user?.id || !otherUserId) return null;
    
    try {
      // Check if conversation already exists
      const { data: existingConvo } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant1.eq.${user.id},participant2.eq.${otherUserId}),and(participant1.eq.${otherUserId},participant2.eq.${user.id})`)
        .maybeSingle();
      
      if (existingConvo?.id) {
        return existingConvo.id;
      }
      
      // Create a new conversation
      const { data: newConvo, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant1: user.id,
          participant2: otherUserId
        })
        .select('id')
        .single();
        
      if (createError) {
        console.error('[useMessages] Error creating conversation:', createError);
        return null;
      }
      
      return newConvo?.id || null;
    } catch (err) {
      console.error('[useMessages] Error in getOrCreateConversation:', err);
      return null;
    }
  }, [user?.id]);

  // Get user display name (email or name)
  const getUserDisplayName = useCallback(async (userId: string): Promise<string> => {
    if (!userId) return 'Unknown User';
    
    try {
      // First try to get profile from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileData?.name) return profileData.name;
      if (profileData?.email) return profileData.email;
      
      // If no profile or name/email is found, try using RPC to get email
      console.log("[getUserDisplayName] Falling back to RPC for", userId);
      const { data: emailData, error: emailError } = await supabase.rpc(
        'get_user_email', 
        { user_id_param: userId }
      );
      
      if (emailError) {
        console.error("[getUserDisplayName] RPC error:", emailError);
        return 'Unknown User';
      }
      
      if (emailData) {
        console.log("[getUserDisplayName] SUCCESS via RPC for", userId + ":", { email: emailData });
        return emailData;
      }
      
      return 'Unknown User';
    } catch (err) {
      console.error("[getUserDisplayName] Error:", err);
      return 'Unknown User';
    }
  }, []);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('[fetchMessages] Error:', error);
        return [];
      }
      
      return data.map(message => ({
        id: message.id,
        content: message.content,
        senderId: message.sender_id,
        conversationId: message.conversation_id,
        timestamp: message.created_at,
        isRead: message.is_read,
        isMine: message.sender_id === user?.id
      }));
    } catch (err) {
      console.error('[fetchMessages] Error:', err);
      return [];
    }
  }, [user?.id]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    if (!user?.id || !conversationId) return;
    
    try {
      // Update messages where current user is NOT the sender (they received the messages)
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
      
      if (error) {
        console.error('[markMessagesAsRead] Error:', error);
      }
      
      // Refresh conversations to update unread counts
      await refreshConversations();
    } catch (err) {
      console.error('[markMessagesAsRead] Error:', err);
    }
  }, [user?.id, refreshConversations]);
  
  return {
    conversations,
    loading,
    unreadCount,
    refreshConversations,
    getOrCreateConversation,
    getUserDisplayName,
    fetchMessages,
    markMessagesAsRead
  };
}
