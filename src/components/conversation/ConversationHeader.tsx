
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '@/components/UserTag';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ConversationHeaderProps {
  otherUserName: string;
  otherUserRole: UserRole;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  otherUserName, 
  otherUserRole 
}) => {
  const navigate = useNavigate();
  
  // First letter of name for avatar
  const firstLetter = otherUserName?.charAt(0).toUpperCase() || '?';
  
  // Role-based colors
  const roleStyles = {
    seller: 'bg-[#FDE1D3] text-[#ea384c]',
    wholesaler: 'bg-[#FEF7CD] text-[#F97316]',
    buyer: 'bg-[#F2FCE2] text-[#4CA154]'
  };
  
  // Choose the correct style based on role, defaulting to buyer
  const roleStyle = roleStyles[otherUserRole] || roleStyles.buyer;
  
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
      
      <Avatar className="h-10 w-10 bg-gray-200 border border-gray-200 mr-2">
        <AvatarFallback className="text-gray-600 font-semibold">
          {firstLetter}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center flex-wrap gap-2">
        <h1 className="font-bold text-xl sm:text-2xl">{otherUserName}</h1>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${roleStyle}`}>
          {otherUserRole}
        </span>
      </div>
    </div>
  );
};

export default ConversationHeader;
