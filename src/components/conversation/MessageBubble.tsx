
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
      <div className={`max-w-[70%] relative ${
        isCurrentUser 
          ? 'bg-white/90 p-3' 
          : 'bg-white/90 border border-gray-200 shadow-sm p-3'
      } rounded-lg`}>
        {isCurrentUser && (
          <span 
            className="absolute inset-0 rounded-lg opacity-100 pointer-events-none"
            style={{
              background: "transparent",
              border: "2px solid #fd4801",
              borderRadius: "inherit"
            }}
          />
        )}
        <p className="whitespace-pre-wrap font-polysans font-bold text-[#01204b]">{message.content}</p>
        <p className={`text-xs mt-1 font-polysans font-semibold ${isCurrentUser ? 'text-gray-500' : 'text-gray-500'}`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
