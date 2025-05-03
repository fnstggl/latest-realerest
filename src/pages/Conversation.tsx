
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import MessageInput from '@/components/conversation/MessageInput';
import { motion } from 'framer-motion';
import { useConversationData } from '@/hooks/messages/useConversationData';
import ConversationHeader from '@/components/conversation/ConversationHeader';
import MessageContainer from '@/components/conversation/MessageContainer';

const Conversation: React.FC = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchMessages, markMessagesAsRead } = useMessages();

  const { 
    otherUserName, 
    otherUserRole, 
    messages, 
    loading, 
    sending, 
    sendMessage 
  } = useConversationData({
    conversationId,
    fetchMessages,
    markMessagesAsRead,
    navigateToMessages: () => navigate('/messages')
  });
  
  // Adapter function to match the MessageInput component's expected signature
  const handleSendMessage = async (message: string): Promise<void> => {
    await sendMessage(message);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col container mx-auto px-3 sm:px-4 py-8 sm:py-12 mt-16 sm:mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <ConversationHeader 
            otherUserName={otherUserName} 
            otherUserRole={otherUserRole} 
          />
          
          <div className="flex-1 bg-white shadow-sm rounded-t-lg border border-gray-200 overflow-hidden flex flex-col">
            <MessageContainer
              loading={loading}
              messages={messages}
              currentUserId={user?.id}
            />
            
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={loading || sending}
              sending={sending}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Conversation;
