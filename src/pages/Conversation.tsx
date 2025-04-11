
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Message, useMessages } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Conversation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<{ id: string; name: string; } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { fetchMessages, sendMessage, markConversationAsRead } = useMessages();

  // Fetch conversation details and messages
  useEffect(() => {
    const loadConversation = async () => {
      if (!id || !user?.id) return;
      
      setLoading(true);
      try {
        // Fetch conversation details
        const { data: conversation } = await supabase
          .from('conversations')
          .select('participant1, participant2')
          .eq('id', id)
          .single();
        
        if (!conversation) {
          navigate('/messages');
          return;
        }
        
        // Determine the other user
        const otherUserId = conversation.participant1 === user.id 
          ? conversation.participant2 
          : conversation.participant1;
          
        // Fetch other user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', otherUserId)
          .single();
          
        if (profile) {
          setOtherUser({ id: otherUserId, name: profile.name || profile.email || "Unknown" });
        } else {
          // Fallback to fetching from auth.users using the RPC function
          const { data: userData } = await supabase.rpc('get_user_email', {
            user_id_param: otherUserId
          });
          
          setOtherUser({ id: otherUserId, name: userData || "Unknown" });
        }
        
        // Fetch messages
        const messageData = await fetchMessages(id);
        setMessages(messageData);
        
        // Mark conversation as read
        await markConversationAsRead(id);
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel(`messages:${id}`)
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${id}`
        },
        async (payload) => {
          // Fetch the fresh message to ensure we have all fields
          const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();
            
          if (data) {
            const newMsg: Message = {
              id: data.id,
              conversationId: data.conversation_id,
              senderId: data.sender_id,
              content: data.content,
              timestamp: data.created_at,
              isRead: data.is_read,
              relatedOfferId: data.related_offer_id
            };
            
            setMessages(prev => [...prev, newMsg]);
            
            // Mark message as read if it's not from the current user
            if (data.sender_id !== user.id) {
              await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', data.id);
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id, user?.id, fetchMessages, navigate, markConversationAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!id || !newMessage.trim() || !user?.id) return;
    
    setSending(true);
    try {
      const sentMessage = await sendMessage(id, newMessage);
      if (sentMessage) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce<{ [date: string]: Message[] }>((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/messages')}
              className="mr-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
            
            <h1 className="text-2xl font-bold">{loading ? 'Loading...' : otherUser?.name || "Unknown"}</h1>
          </div>
          
          <Card className="flex-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${i % 2 === 0 ? 'bg-gray-100' : 'bg-blue-100'} rounded-lg p-3`}>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-2 w-16 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date} className="space-y-4">
                      <div className="flex justify-center">
                        <div className="bg-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                          {new Date().toDateString() === date ? 'Today' : date}
                        </div>
                      </div>
                      
                      {dateMessages.map((message) => {
                        const isCurrentUser = message.senderId === user?.id;
                        return (
                          <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${
                              isCurrentUser 
                                ? 'bg-[#0d2f72] text-white neo-shadow-sm' 
                                : 'border-4 border-black bg-white neo-shadow-sm'
                            } rounded-none p-3`}>
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t-4 border-black p-4">
              <div className="flex items-end space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="resize-none border-2 border-black focus:ring-0"
                  rows={2}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="h-20 w-20 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#0d2f72] text-white flex items-center justify-center"
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Conversation;
