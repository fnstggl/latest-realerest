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
  const { markMessagesAsRead, fetchMessages } = useMessages();

  useEffect(() => {
    if (!conversationId) {
      navigate('/messages');
      return;
    }
    
    const fetchConversationData = async () => {
      setLoading(true);
      
      try {
        // First, get conversation participants
        const { data: convoData, error: convoError } = await supabase
          .from('conversations')
          .select('participant1, participant2')
          .eq('id', conversationId)
          .single();
          
        if (convoError || !convoData) {
          console.error('Error fetching conversation:', convoError);
          navigate('/messages');
          return;
        }
        
        // Find the other user's ID
        const otherUserId = convoData.participant1 === user?.id ? convoData.participant2 : convoData.participant1;
        
        // Get other user's profile info with improved profile data fetching
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, email, account_type')
          .eq('id', otherUserId)
          .single();
          
        if (!profileError && profileData) {
          // Prefer name over email for display
          setOtherUserName(profileData.name || profileData.email || 'Unknown User');
          
          // Ensure we only use valid role types
          const roleType = 
            profileData.account_type === 'seller' || 
            profileData.account_type === 'buyer' || 
            profileData.account_type === 'wholesaler' 
              ? profileData.account_type as UserRole 
              : 'buyer';
          setOtherUserRole(roleType);
        } else {
          // Fallback to getting email via RPC function if profile fetch fails
          const { data: userData } = await supabase.rpc('get_user_email', {
            user_id_param: otherUserId
          });
          
          if (userData) {
            setOtherUserName(userData);
            setOtherUserRole('buyer'); // Default role if we couldn't get from profile
          }
        }
        
        // Get messages using our hook
        if (conversationId && fetchMessages) {
          const messagesData = await fetchMessages(conversationId);
          setMessages(messagesData);
          
          // Mark messages as read
          if (conversationId && markMessagesAsRead) {
            markMessagesAsRead(conversationId);
          }
        }
      } catch (error) {
        console.error('Error in conversation data fetching:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversationData();
    
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
            conversationId: payload.new.conversation_id,
            timestamp: payload.new.created_at,
            isRead: payload.new.is_read,
            isMine: payload.new.sender_id === user?.id,
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          // Mark received message as read immediately
          if (payload.new.sender_id !== user?.id && conversationId && markMessagesAsRead) {
            markMessagesAsRead(conversationId);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [conversationId, user?.id, navigate, markMessagesAsRead, fetchMessages]);
  
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
  
  // Adapter function to match the MessageInput component's expected signature
  const handleSendMessage = async (message: string): Promise<void> => {
    await sendMessage(message);
  };
  
  const groupMessages = (messages: Message[]) => {
    // Group messages by date
    const messagesByDate: Record<string, Message[]> = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!messagesByDate[date]) {
        messagesByDate[date] = [];
      }
      messagesByDate[date].push(message);
    });
    
    return Object.entries(messagesByDate).map(([date, messages]) => ({
      date,
      messages
    }));
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
                      date={group.date}
                      messages={group.messages}
                      currentUserId={user?.id}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            
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
