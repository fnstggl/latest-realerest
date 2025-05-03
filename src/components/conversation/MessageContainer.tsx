
import React, { useRef, useEffect } from 'react';
import { Message } from '@/types/messages';
import MessageGroup from './MessageGroup';

interface MessageContainerProps {
  loading: boolean;
  messages: Message[];
  currentUserId?: string;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ 
  loading, 
  messages,
  currentUserId 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group messages by date
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="loading-container">
          <div className="pulsing-circle" />
        </div>
      </div>
    );
  }

  return (
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
            currentUserId={currentUserId}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageContainer;
