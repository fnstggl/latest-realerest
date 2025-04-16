
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useMessages } from '@/hooks/useMessages';

const ChatIcon: React.FC = () => {
  const navigate = useNavigate();
  const { unreadCount } = useMessages();

  return (
    <Button 
      variant="ghost" 
      size="icon"
      className="relative hover:bg-white/20 hover:shadow-[0_0_10px_rgba(8,146,208,0.5)]"
      onClick={() => navigate('/messages')}
    >
      <MessageSquare size={20} className="text-black" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#0892D0] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default ChatIcon;
