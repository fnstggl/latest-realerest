import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Message, useMessages } from '@/hooks/useMessages';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MessageGroup from '@/components/conversation/MessageGroup';
import MessageInput from '@/components/conversation/MessageInput';

const Conversation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<{ id: string; name: string; } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { fetchMessages, sendMessage, markConversationAsRead } = useMessages();

  useEffect(() => {
    const loadConversation = async () => {
      if (!id || !user?.id) return;
      
      setLoading(true);
      try {
        const { data: conversation } = await supabase
          .from('conversations')
          .select('participant1, participant2')
          .eq('id', id)
          .single();
        
        if (!conversation) {
          navigate('/messages');
          return;
        }
        
        const otherUserId = conversation.participant1 === user.id 
          ? conversation.participant2 
          : conversation.participant1;
          
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', otherUserId)
          .maybeSingle();
          
        let userName = "Unknown User";
        
        if (profileData && profileData.name) {
          userName = profileData.name;
        } else {
          console.log("No profile name found, falling back to email for user ID:", otherUserId);
          const { data: userData } = await supabase.rpc('get_user_email', {
            user_id_param: otherUserId
          });
          
          userName = userData || "Unknown User";
        }
        
        setOtherUser({ id: otherUserId, name: userName });
        
        const messageData = await fetchMessages(id);
        setMessages(messageData);
        
        await markConversationAsRead(id);
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
    
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!id || !message.trim() || !user?.id) return;
    
    setSending(true);
    try {
      await sendMessage(id, message);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

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
            
            <h1 className="text-2xl font-bold">{loading ? 'Loading...' : otherUser?.name || "Unknown User"}</h1>
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
                    <MessageGroup 
                      key={date} 
                      date={date} 
                      messages={dateMessages} 
                      currentUserId={user?.id} 
                    />
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
            
            <MessageInput 
              onSendMessage={handleSendMessage}
              sending={sending}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Conversation;
