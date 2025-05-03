
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Conversation } from '@/types/messages';
import { getUserDisplayName } from '@/utils/userUtils';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('Fetching conversations for user ID:', user.id);
      
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
        console.log('No conversations found for user:', user.id);
        setConversations([]);
        setLoading(false);
        return;
      }
      
      console.log('Conversations found:', conversationData.length);
      
      const conversationsWithDetails = await Promise.all(
        conversationData.map(async (conversation) => {
          // Determine the other user's ID
          const otherUserId = conversation.participant1 === user.id 
            ? conversation.participant2 
            : conversation.participant1;
            
          if (!otherUserId) {
            console.error('Invalid conversation data - missing participant:', conversation);
            return null;
          }
          
          console.log(`Processing conversation ${conversation.id} with other user ${otherUserId}`);
          
          // Get profile data including name and account_type
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, name, email, account_type')
            .eq('id', otherUserId)
            .maybeSingle();
            
          console.log('Profile data for user:', profileData);
          
          // Initialize with default values
          let otherUserName = "Unknown User";
          let otherUserRole: 'seller' | 'buyer' | 'wholesaler' = 'buyer';
          
          if (profileData) {
            // Prioritize name over email
            otherUserName = profileData.name || profileData.email || "Unknown User";
            
            // Validate account_type before using as role
            if (profileData.account_type === 'seller' || 
                profileData.account_type === 'buyer' || 
                profileData.account_type === 'wholesaler') {
              otherUserRole = profileData.account_type as 'seller' | 'buyer' | 'wholesaler';
            }
          } else {
            // If no profile found, try to get email as fallback
            const { data: userData } = await supabase.rpc('get_user_email', {
              user_id_param: otherUserId
            });
            
            if (userData) {
              otherUserName = userData;
            }
          }
            
          // Get the latest message and property information
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
          
          // Create the conversation object
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
          } as Conversation;
        })
      );
      
      // Filter out any null conversations (from invalid data)
      const validConversations = conversationsWithDetails.filter(
        (conv): conv is Conversation => conv !== null
      );
      
      console.log('Processed conversations:', validConversations);
      
      // Set the conversations state
      setConversations(validConversations);
      
      // Calculate unread message count
      const unread = validConversations.reduce((count, conversation) => {
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

  return {
    conversations,
    loading,
    unreadCount,
    refreshConversations: fetchConversations
  };
};
