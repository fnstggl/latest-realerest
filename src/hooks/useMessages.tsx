
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserRole?: 'seller' | 'buyer' | 'wholesaler';
  latestMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isMine?: boolean;
  relatedOfferId?: string;
  propertyId?: string;
}

// Type definition to properly parse message data from Supabase
interface MessageData {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  related_offer_id: string;
  property_id?: string; // Make this optional since it might not exist
  property_offers?: {
    property_id: string;
  };
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Get user display name with better error handling
  const getUserDisplayName = useCallback(async (userId: string): Promise<string> => {
    try {
      console.log(`Attempting to get display name for user ID: ${userId}`);
      
      // First try to get the profile name directly
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error(`Error fetching profile for ${userId}:`, profileError);
      }
      
      if (profileData?.name) {
        console.log(`Found profile name for ${userId}:`, profileData.name);
        return profileData.name;
      }
      
      if (profileData?.email) {
        console.log(`No profile name found for ${userId}, using email:`, profileData.email);
        return profileData.email;
      }
      
      // If no profile found or no name, get the email as fallback
      console.log(`No profile found for user ID: ${userId}, falling back to email via RPC`);
      const { data: userData, error: userError } = await supabase.rpc('get_user_email', {
        user_id_param: userId
      });
      
      if (userError) {
        console.error(`Error getting email for ${userId}:`, userError);
      }
      
      if (userData) {
        console.log(`Retrieved email for ${userId}:`, userData);
        return userData;
      }
      
      console.warn(`Could not find any identifying information for user ${userId}`);
      return "Unknown User";
    } catch (error) {
      console.error(`Error getting user display name for ${userId}:`, error);
      return "Unknown User";
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Get all conversations for the current user
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
            
          // Get both name and account_type
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, email, account_type')
            .eq('id', otherUserId)
            .maybeSingle();
            
          let otherUserName = "Unknown User";
          let otherUserRole: 'seller' | 'buyer' | 'wholesaler' = 'buyer';
          
          if (profileData?.name) {
            otherUserName = profileData.name;
            otherUserRole = profileData.account_type as 'seller' | 'buyer' | 'wholesaler' || 'buyer';
          } else if (profileData?.email) {
            otherUserName = profileData.email;
          } else {
            // Fallback to RPC
            const { data: userData } = await supabase.rpc('get_user_email', {
              user_id_param: otherUserId
            });
            
            if (userData) {
              otherUserName = userData;
            }
          }
            
          // Get the latest message and check if it's related to a property
          const { data: messageData } = await supabase
            .from('messages')
            .select('*, property_offers(property_id)')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          let propertyId = undefined;
          let propertyTitle = undefined;
          let propertyImage = undefined;
          
          // Check if the message has property_id directly
          if (messageData && 'property_id' in messageData && messageData.property_id) {
            propertyId = messageData.property_id;
          }
          // If not, check if it has a related offer
          else if (messageData?.related_offer_id) {
            const { data: offerData } = await supabase
              .from('property_offers')
              .select('property_id')
              .eq('id', messageData.related_offer_id)
              .maybeSingle();
              
            if (offerData?.property_id) {
              propertyId = offerData.property_id;
            }
          }
          
          // If we have a property ID, get the property details
          if (propertyId) {
            const { data: propertyData } = await supabase
              .from('property_listings')
              .select('title, images')
              .eq('id', propertyId)
              .maybeSingle();
              
            if (propertyData) {
              propertyTitle = propertyData.title;
              if (propertyData.images && propertyData.images.length > 0) {
                propertyImage = propertyData.images[0];
              }
            }
          }
          
          return {
            id: conversation.id,
            otherUserId,
            otherUserName,
            otherUserRole,
            propertyId,
            propertyTitle,
            propertyImage,
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
  }, [user?.id, getUserDisplayName]);

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

  const markMessagesAsRead = useCallback(async (conversationId: string) => {
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
          fetchConversations();
        }
      )
      .subscribe();
    
    fetchConversations();
    
    return () => {
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(conversationSubscription);
    };
  }, [user?.id, fetchConversations, getUserDisplayName]);

  return {
    conversations,
    loading,
    unreadCount,
    fetchMessages,
    sendMessage,
    getOrCreateConversation,
    markConversationAsRead,
    markMessagesAsRead,
    refreshConversations: fetchConversations,
    getUserDisplayName // Export this function so other components can use it
  };
};
