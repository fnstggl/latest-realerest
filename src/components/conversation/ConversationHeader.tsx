
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '@/components/UserTag';

interface ConversationHeaderProps {
  displayName: string;
  userRole: UserRole;
  isLoading: boolean;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  displayName, 
  userRole,
  isLoading
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
        <h1 className="font-polysans font-bold text-xl sm:text-2xl text-[#01204b]">{displayName}</h1>
        {/* UserTag is hidden as requested */}
      </div>
    </div>
  );
};

export default ConversationHeader;
