
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
          ? 'bg-[#0892D0]/90 text-white shadow-sm' 
          : 'bg-white/90 border border-gray-200 shadow-sm'
      } rounded-lg p-3`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
