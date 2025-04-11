
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Conversation, useMessages } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Messages: React.FC = () => {
  const { conversations, loading, refreshConversations } = useMessages();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/messages/${conversation.id}`);
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

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
            
            {loading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-200">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : conversations.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation) => {
                  const isUnread = !conversation.latestMessage.isRead && conversation.latestMessage.senderId !== user?.id;
                  return (
                    <div 
                      key={conversation.id} 
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? 'bg-blue-50' : ''}`}
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{conversation.otherUserName}</h3>
                          <p className={`text-sm ${isUnread ? 'font-semibold' : 'text-gray-600'}`}>
                            {conversation.latestMessage.senderId === user?.id ? 'You: ' : ''}
                            {truncateMessage(conversation.latestMessage.content)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(conversation.latestMessage.timestamp), { addSuffix: true })}
                          </p>
                          {isUnread && (
                            <div className="bg-blue-200 px-2 py-1 text-xs font-bold rounded mt-1 inline-block">
                              NEW
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">No Messages Yet</h3>
                <p className="text-gray-500 mb-4">You haven't messaged anyone yet.</p>
                <Button 
                  onClick={() => navigate('/search')}
                  className="neo-button-primary"
                >
                  Find Properties
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
