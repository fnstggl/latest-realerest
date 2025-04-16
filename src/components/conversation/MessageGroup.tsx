
import React from 'react';
import { Message } from '@/hooks/useMessages';
import MessageBubble from './MessageBubble';

interface MessageGroupProps {
  date: string;
  messages: Message[];
  currentUserId?: string;
}

const MessageGroup: React.FC<MessageGroupProps> = ({ date, messages, currentUserId }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
          {new Date().toDateString() === date ? 'Today' : date}
        </div>
      </div>
      
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        return (
          <MessageBubble 
            key={message.id} 
            message={message} 
            isCurrentUser={isCurrentUser} 
          />
        );
      })}
    </div>
  );
};

export default MessageGroup;
