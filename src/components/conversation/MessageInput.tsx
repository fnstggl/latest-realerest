
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
          className="resize-none border border-gray-200 focus:border-gray-300 focus:ring-transparent"
          rows={2}
        />
        <div className="relative">
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="h-16 w-16 bg-white text-black flex items-center justify-center relative overflow-hidden"
          >
            <span 
              className="absolute inset-0 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
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
            <Send size={20} className="relative z-10" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
