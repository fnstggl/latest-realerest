
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
        <div className="relative rounded-lg group">
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="h-16 w-16 bg-white hover:bg-white text-black flex items-center justify-center relative z-10"
            style={{ borderRadius: "0.5rem" }} // Explicitly set border radius to match the outer span
          >
            <Send size={20} className="relative z-10" />
          </Button>
          <span 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0", 
              bottom: "0",
              borderRadius: "0.5rem",
              padding: "2px",
              background: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
              maskImage: "linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              pointerEvents: "none"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
