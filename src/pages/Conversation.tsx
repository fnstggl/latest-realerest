
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import MessageInput from '@/components/conversation/MessageInput';
import { motion } from 'framer-motion';
import { Message, useMessages } from '@/hooks/useMessages';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConversationHeader from '@/components/conversation/ConversationHeader';
import ConversationContent from '@/components/conversation/ConversationContent';
import { useConversationData } from '@/hooks/useConversationData';
import { useConversationSubscription } from '@/hooks/useConversationSubscription';
import { groupMessagesByDate } from '@/utils/messageUtils';

const Conversation: React.FC = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Add state for messages to handle subscription updates
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const { markMessagesAsRead } = useMessages();
  
  // Redirect if no conversation ID or user
  if (!conversationId || !user) {
    navigate('/messages');
    return null;
  }
  
  // Load conversation data
  const { 
    messages, 
    loading, 
    sending,
    otherUserId,
    otherUserProfile,
    profileLoading,
    sendMessage
  } = useConversationData(conversationId, user?.id);
  
  // Update local messages when conversation data changes
  React.useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);
  
  // Set up subscription to new messages
  useConversationSubscription({
    conversationId,
    userId: user?.id,
    setMessages: setLocalMessages,
    markMessagesAsRead
  });
  
  // Group messages by date using the local messages that include subscription updates
  const groupedMessages = groupMessagesByDate(localMessages);
  
  // Determine loading states and display values
  const isLoading = loading || profileLoading;
  const displayName = otherUserProfile?.name || "Loading...";
  const userRole = otherUserProfile?.role || "buyer";
  
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
            displayName={displayName}
            userRole={userRole} 
            isLoading={isLoading}
          />
          
          <div className="flex-1 bg-white shadow-sm rounded-t-lg border border-gray-200 overflow-hidden flex flex-col">
            <ConversationContent
              isLoading={isLoading}
              messages={localMessages}
              currentUserId={user?.id}
              groupedMessages={groupedMessages}
            />
            
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={isLoading || sending}
              sending={sending}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Conversation;
