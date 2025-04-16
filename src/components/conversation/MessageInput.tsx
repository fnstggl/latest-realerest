
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
    <div className="border-t border-gray-200 p-4 bg-white/80">
      <div className="flex items-end space-x-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="resize-none border border-gray-200 focus:border-[#0892D0] focus:ring-[#0892D0]/20"
          rows={2}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sending}
          className="h-16 w-16 bg-[#0892D0] hover:bg-[#0892D0]/90 text-white flex items-center justify-center"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
