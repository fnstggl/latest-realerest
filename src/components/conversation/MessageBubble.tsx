
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
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
              backgroundOrigin: "border-box",
              backgroundClip: "border-box",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude"
            }}
          />
        )}
        <p className="whitespace-pre-wrap text-black">{message.content}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-gray-500' : 'text-gray-500'}`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
