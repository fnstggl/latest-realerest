
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Conversation } from '@/types/messages';

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
      
      // Process conversations with improved profile fetching
      const processedConversations = await Promise.all(
        conversationData.map(async (conversation) => {
          // Determine the other user's ID
          const otherUserId = conversation.participant1 === user.id 
            ? conversation.participant2 
            : conversation.participant1;
            
          console.log(`Processing conversation ${conversation.id} with other user ${otherUserId}`);
          
          // Default values
          let otherUserName = "Unknown User";
          let otherUserRole = "buyer";
          
          // IMPROVED: Direct, reliable profile data fetch
          if (otherUserId) {
            try {
              // Fetch profile with retry mechanism
              const fetchProfile = async (retries = 2) => {
                const { data, error } = await supabase
                  .from('profiles')
                  .select('name, email, account_type')
                  .eq('id', otherUserId)
                  .maybeSingle();
                
                if (error) {
                  console.error(`Profile fetch error (attempt ${3-retries})`, error);
                  if (retries > 0) return fetchProfile(retries - 1);
                  return null;
                }
                return data;
              };
              
              const profileData = await fetchProfile();
              
              if (profileData) {
                // Name priority: profile name > profile email > fallback to email lookup
                otherUserName = profileData.name && profileData.name.trim() !== '' 
                  ? profileData.name.trim() 
                  : (profileData.email && profileData.email.trim() !== '' 
                    ? profileData.email.trim() 
                    : "Unknown User");
                
                // Explicitly validate account_type before using it
                if (['seller', 'buyer', 'wholesaler'].includes(profileData.account_type)) {
                  otherUserRole = profileData.account_type;
                  console.log(`User ${otherUserId} role set to: ${otherUserRole}`);
                } else {
                  console.warn(`Invalid account_type "${profileData.account_type}" for user ${otherUserId}, using default`);
                }
              } else {
                // Fallback to direct email lookup
                const { data: userData } = await supabase.rpc('get_user_email', {
                  user_id_param: otherUserId
                });
                
                if (userData) {
                  otherUserName = userData;
                  console.log(`Fallback to email for ${otherUserId}: ${userData}`);
                }
              }
            } catch (err) {
              console.error(`Error processing user ${otherUserId}:`, err);
            }
          }
            
          // Get the latest message in a separate query
          const { data: messageData } = await supabase
            .from('messages')
            .select('id, content, created_at, is_read, sender_id, related_offer_id, property_id, conversation_id')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          // Property information processing
          let propertyId = undefined;
          let propertyTitle = undefined;
          let propertyImage = undefined;
          
          if (messageData) {
            propertyId = messageData.property_id;
            
            // If we have a propertyId from message but no related_offer_id, try to fetch property details
            if (!propertyId && messageData.related_offer_id) {
              try {
                const { data: offerData } = await supabase
                  .from('property_offers')
                  .select('property_id')
                  .eq('id', messageData.related_offer_id)
                  .maybeSingle();
                  
                if (offerData?.property_id) {
                  propertyId = offerData.property_id;
                }
              } catch (err) {
                console.error('Error fetching offer data:', err);
              }
            }
          }
          
          // If we found a property ID, get its details
          if (propertyId) {
            try {
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
            } catch (err) {
              console.error('Error fetching property data:', err);
            }
          }
          
          // Create the conversation object with all collected data
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
      
      // Filter out any invalid conversations
      const validConversations = processedConversations.filter(Boolean);
      
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
