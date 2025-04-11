
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useMessages } from '@/hooks/useMessages';
import { motion } from 'framer-motion';
import MessageList from '@/components/MessageList';

const Messages: React.FC = () => {
  const { conversations, loading, refreshConversations } = useMessages();

  useEffect(() => {
    console.log("Messages page - refreshing conversations");
    refreshConversations();
  }, [refreshConversations]);

  // Log conversations for debugging
  useEffect(() => {
    console.log("Current conversations:", conversations);
  }, [conversations]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Messages</h1>
              <p className="text-lg">Connect with buyers and sellers</p>
            </div>
          </div>
          
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="border-b-4 border-black p-4 bg-gray-50">
              <h2 className="text-xl font-bold">Conversations</h2>
            </div>
            
            <MessageList 
              conversations={conversations}
              loading={loading}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
