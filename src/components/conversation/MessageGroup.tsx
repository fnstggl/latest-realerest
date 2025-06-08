
import React from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '@/hooks/useMessages';

interface MessageGroupProps {
  date: string;
  messages: Message[];
  currentUserId?: string;
}

const MessageGroup: React.FC<MessageGroupProps> = ({ date, messages, currentUserId }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-center mb-4">
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-polysans font-semibold">
          {date}
        </span>
      </div>
      <div className="space-y-3">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.sender_id === currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageGroup;
