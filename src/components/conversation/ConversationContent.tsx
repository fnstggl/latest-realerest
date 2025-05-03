
import React, { useRef, useEffect } from 'react';
import MessageGroup from '@/components/conversation/MessageGroup';
import { Message } from '@/hooks/useMessages';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ConversationContentProps {
  isLoading: boolean;
  messages: Message[];
  currentUserId?: string;
  groupedMessages: {
    date: string;
    messages: Message[];
  }[];
}

const ConversationContent: React.FC<ConversationContentProps> = ({
  isLoading,
  messages,
  currentUserId,
  groupedMessages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return <LoadingSpinner className="flex-1" />;
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

export default ConversationContent;
