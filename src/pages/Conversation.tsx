import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MessageGroup from '@/components/conversation/MessageGroup';
import MessageInput from '@/components/conversation/MessageInput';
import { Message } from '@/hooks/useMessages';
import { motion } from 'framer-motion';
import UserTag, { UserRole } from '@/components/UserTag';

const Conversation: React.FC = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUserName, setOtherUserName] = useState<string>('');
  const [otherUserRole, setOtherUserRole] = useState<UserRole>('buyer');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { markMessagesAsRead } = useMessages();

  useEffect(() => {
    if (!conversationId) {
      navigate('/messages');
      return;
    }
    
    const fetchMessages = async () => {
      setLoading(true);
      
      try {
        // First, get conversation participants
        const { data: convoData, error: convoError } = await supabase
          .from('conversations')
          .select('user_id_1, user_id_2')
          .eq('id', conversationId)
          .single();
          
        if (convoError || !convoData) {
          console.error('Error fetching conversation:', convoError);
          navigate('/messages');
          return;
        }
        
        // Find the other user's ID
        const otherUserId = convoData.user_id_1 === user?.id ? convoData.user_id_2 : convoData.user_id_1;
        
        // Get other user's profile info
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, account_type')
          .eq('id', otherUserId)
          .single();
          
        if (!profileError && profileData) {
          setOtherUserName(profileData.name || 'Unknown User');
          
          // Ensure we only use valid role types
          const roleType = 
            profileData.account_type === 'seller' || 
            profileData.account_type === 'buyer' || 
            profileData.account_type === 'wholesaler' 
              ? profileData.account_type as UserRole 
              : 'buyer';
          setOtherUserRole(roleType);
        }
        
        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at');
          
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
        } else if (messagesData) {
          const formattedMessages = messagesData.map(message => ({
            id: message.id,
            content: message.content,
            senderId: message.sender_id,
            timestamp: message.created_at,
            isRead: message.is_read,
            isMine: message.sender_id === user?.id,
          }));
          
          setMessages(formattedMessages);
          
          // Mark messages as read
          if (conversationId) {
            markMessagesAsRead(conversationId);
          }
        }
      } catch (error) {
        console.error('Error in conversation data fetching:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up subscription for new messages
    const messagesSubscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            content: payload.new.content,
            senderId: payload.new.sender_id,
            timestamp: payload.new.created_at,
            isRead: payload.new.is_read,
            isMine: payload.new.sender_id === user?.id,
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          // Mark received message as read immediately
          if (payload.new.sender_id !== user?.id && conversationId) {
            markMessagesAsRead(conversationId);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [conversationId, user?.id, navigate, markMessagesAsRead]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !conversationId || !user?.id) return false;
    
    try {
      setSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          is_read: false
        });
        
      if (error) {
        console.error('Error sending message:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in send message:', error);
      return false;
    } finally {
      setSending(false);
    }
  }, [conversationId, user?.id]);
  
  const groupMessages = (messages: Message[]) => {
    const groupedMessages: { senderId: string; messages: Message[] }[] = [];
    let currentGroup: { senderId: string; messages: Message[] } | null = null;
    
    messages.forEach(message => {
      if (!currentGroup || currentGroup.senderId !== message.senderId) {
        if (currentGroup) {
          groupedMessages.push(currentGroup);
        }
        currentGroup = { senderId: message.senderId, messages: [message] };
      } else {
        currentGroup.messages.push(message);
      }
    });
    
    if (currentGroup) {
      groupedMessages.push(currentGroup);
    }
    
    return groupedMessages;
  };
  
  const groupedMessages = groupMessages(messages);

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
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/messages')}
              className="hover:bg-gray-200 text-gray-800"
            >
              <ArrowLeft />
            </Button>
            <div className="flex items-center">
              <h1 className="font-bold text-xl sm:text-2xl">{otherUserName}</h1>
              <UserTag role={otherUserRole} />
            </div>
          </div>
          
          <div className="flex-1 bg-white shadow-sm rounded-t-lg border border-gray-200 overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="loading-container">
                  <div className="pulsing-circle" />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  groupedMessages.map((group, i) => (
                    <MessageGroup 
                      key={i}
                      messages={group.messages}
                      isMine={group.messages[0].isMine}
                      senderName={group.messages[0].isMine ? 'You' : otherUserName}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            
            <MessageInput 
              onSendMessage={sendMessage}
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
