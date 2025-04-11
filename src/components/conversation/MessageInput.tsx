
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  sending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, sending }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t-4 border-black p-4">
      <div className="flex items-end space-x-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="resize-none border-2 border-black focus:ring-0"
          rows={2}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sending}
          className="h-20 w-20 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#0d2f72] text-white flex items-center justify-center"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
