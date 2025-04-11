
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
      className="relative p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
      onClick={() => navigate('/messages')}
    >
      <MessageSquare size={20} className="text-black" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#C42924] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default ChatIcon;
