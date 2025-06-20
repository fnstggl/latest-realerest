
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  sending?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  sending = false,
  placeholder = 'Type a message...'
}) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || sending) return;
    
    try {
      await onSendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [message, onSendMessage, disabled, sending]);
  
  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || sending}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-polysans font-bold placeholder:font-polysans placeholder:font-bold"
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled || sending}
          className="bg-[#fd4801] text-white px-4 py-2 rounded-md hover:bg-[#fd4801]/90 transition-colors disabled:bg-gray-300 ml-2"
        >
          {sending ? (
            <div className="h-6 w-6 border-2 border-t-transparent border-white rounded-full animate-spin" />
          ) : (
            <SendHorizonal size={20} />
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
