
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useMessages } from '@/hooks/useMessages';
import { motion } from 'framer-motion';
import MessageList from '@/components/MessageList';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Messages: React.FC = () => {
  const {
    conversations,
    loading: messagesLoading,
    refreshConversations
  } = useMessages();
  
  const { 
    getUserProfiles, 
    loading: profilesLoading 
  } = useUserProfiles();
  
  const [userProfilesMap, setUserProfilesMap] = useState<Record<string, any>>({});
  const [profilesLoaded, setProfilesLoaded] = useState<boolean>(false);

  // Load conversations when component mounts
  useEffect(() => {
    console.log("[Messages] Component mounted - refreshing conversations");
    refreshConversations();
  }, [refreshConversations]);

  // Load user profiles for all conversations
  useEffect(() => {
    const loadUserProfiles = async () => {
      if (!conversations.length) {
        setProfilesLoaded(true);
        return;
      }
      
      // Extract all unique user IDs from the conversations
      const userIds = [...new Set(conversations.map(conv => conv.otherUserId))];
      
      if (userIds.length === 0) {
        setProfilesLoaded(true);
        return;
      }
      
      console.log('[Messages] Fetching profiles for conversations:', userIds);
      
      try {
        const profiles = await getUserProfiles(userIds);
        console.log('[Messages] Profiles loaded successfully:', profiles);
        setUserProfilesMap(profiles);
      } catch (err) {
        console.error('[Messages] Error loading user profiles:', err);
      } finally {
        setProfilesLoaded(true);
      }
    };
    
    loadUserProfiles();
  }, [conversations, getUserProfiles]);

  // Determine if we're still loading data
  const isLoading = messagesLoading || !profilesLoaded;

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 mt-16 sm:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Messages</h1>
              <p className="text-sm sm:text-base md:text-lg">Connect with buyers and sellers</p>
            </div>
          </div>

          <div className="bg-white/90 border border-gray-200 rounded-xl shadow-sm">
            <div className="border-b border-gray-200 p-3 sm:p-4 rounded-t-xl">
              <h2 className="text-lg sm:text-xl font-bold">Conversations</h2>
            </div>

            {isLoading ? (
              <LoadingSpinner className="min-h-[300px]" />
            ) : (
              <MessageList 
                conversations={conversations} 
                userProfilesMap={userProfilesMap} 
                loading={false} 
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
