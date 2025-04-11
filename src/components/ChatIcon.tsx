
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
      className="relative"
      onClick={() => navigate('/messages')}
    >
      <MessageSquare size={20} className="text-black" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default ChatIcon;
