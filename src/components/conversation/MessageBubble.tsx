
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '@/hooks/useMessages';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
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
};

export default MessageBubble;
