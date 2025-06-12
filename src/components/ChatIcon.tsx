
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useMessages } from '@/hooks/useMessages';

const ChatIcon: React.FC = () => {
  const navigate = useNavigate();
  const { unreadCount } = useMessages();

  const handleClick = () => {
    navigate('/messages');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative hover:bg-transparent" 
      onClick={handleClick}
    >
      <MessageCircle size={20} className="text-black" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      )}
    </Button>
  );
};

export default ChatIcon;
