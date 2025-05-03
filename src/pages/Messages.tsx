
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useMessages } from '@/hooks/useMessages';
import { motion } from 'framer-motion';
import MessageList from '@/components/MessageList';

const Messages: React.FC = () => {
  const {
    conversations,
    loading,
    refreshConversations
  } = useMessages();

  useEffect(() => {
    console.log("Messages page - refreshing conversations");
    refreshConversations();
  }, [refreshConversations]);

  // Log conversations for debugging
  useEffect(() => {
    console.log("Current conversations:", conversations);
  }, [conversations]);

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />

      {/* Increased top margin from mt-4 sm:mt-6 to mt-16 sm:mt-20 to clear navbar */}
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
            <div className="border-b border-white-200 p-3 sm:p-4 rounded-t-xl">
              <h2 className="text-lg sm:text-xl font-bold">Conversations</h2>
            </div>

            {loading ? (
              <div className="min-h-[300px] flex items-center justify-center p-4 sm:p-8">
                <div className="loading-container">
                  <div className="pulsing-circle" />
                </div>
              </div>
            ) : (
              <MessageList conversations={conversations} loading={false} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
