
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import UserTag, { UserRole } from '@/components/UserTag';

interface ConversationHeaderProps {
  otherUserName: string;
  otherUserRole: UserRole;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  otherUserName, 
  otherUserRole 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-3 mb-4 sm:mb-6">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate('/messages')}
        className="hover:bg-gray-200 text-gray-800"
      >
        <ArrowLeft />
      </Button>
      <div className="flex items-center">
        <h1 className="font-bold text-xl sm:text-2xl">{otherUserName}</h1>
        <UserTag role={otherUserRole} />
      </div>
    </div>
  );
};

export default ConversationHeader;
