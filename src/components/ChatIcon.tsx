
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
        <span className="absolute -top-1 -right-1 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0892D0] via-[#54C5F8] to-[#0892D0] animate-spin"></span>
          <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-black">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </span>
      )}
    </Button>
  );
};

export default ChatIcon;
