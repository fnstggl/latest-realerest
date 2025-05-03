
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '@/types/messages';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageListProps {
  conversations: Conversation[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  conversations,
  loading
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/messages/${conversation.id}`);
  };
  
  const handlePropertyClick = (e: React.MouseEvent, propertyId?: string) => {
    if (propertyId) {
      e.stopPropagation();
      navigate(`/property/${propertyId}`);
    }
  };
  
  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };
  
  if (loading) {
    return <div className="p-4 space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-200">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>)}
      </div>;
  }
  
  if (conversations.length === 0) {
    return <div className="p-12 text-center">
        <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold mb-2">No Messages Yet</h3>
        <p className="text-gray-500 mb-4">You haven't messaged anyone yet.</p>
        <Button onClick={() => navigate('/search')} className="text-white bg-black font-extrabold">
          Find Properties
        </Button>
      </div>;
  }
  
  return (
    <div className="divide-y divide-gray-100">
      {conversations.map(conversation => {
        if (!conversation.id) {
          console.warn('Conversation missing ID, skipping render');
          return null;
        }
        
        const isUnread = !conversation.latestMessage.isRead && conversation.latestMessage.senderId !== user?.id;
        
        // Ensure we have valid values for display
        const displayName = conversation.otherUserName || 'Unknown User';
        
        // Get first letter of name for avatar
        const firstLetter = displayName.charAt(0).toUpperCase();
        
        // Role-based background colors for the role pill
        const roleStyles = {
          seller: 'bg-[#FDE1D3] text-[#ea384c]',
          wholesaler: 'bg-[#FEF7CD] text-[#F97316]',
          buyer: 'bg-[#F2FCE2] text-[#4CA154]'
        };
        
        // Choose the correct style based on role, defaulting to buyer
        const roleStyle = roleStyles[conversation.otherUserRole as keyof typeof roleStyles] || roleStyles.buyer;
                
        return (
          <div 
            key={conversation.id} 
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? 'bg-blue-50' : ''}`}
            onClick={() => handleConversationClick(conversation)}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 bg-gray-200 border border-gray-200">
                <AvatarFallback className="text-gray-600 font-semibold">
                  {firstLetter}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-lg truncate">
                    {displayName}
                  </h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${roleStyle}`}>
                    {conversation.otherUserRole || 'buyer'}
                  </span>
                </div>
                
                {conversation.propertyId && conversation.propertyTitle && (
                  <div 
                    className="flex items-center text-xs text-[#0892D0] cursor-pointer hover:underline mb-1" 
                    onClick={e => handlePropertyClick(e, conversation.propertyId)}
                  >
                    <Home size={12} className="mr-1" />
                    <span className="truncate">Regarding: {conversation.propertyTitle}</span>
                    <ExternalLink size={10} className="ml-1 flex-shrink-0" />
                  </div>
                )}
                
                <p className={`text-sm ${isUnread ? 'font-semibold' : 'text-gray-600'} truncate`}>
                  {conversation.latestMessage.senderId === user?.id ? 'You: ' : ''}
                  {truncateMessage(conversation.latestMessage.content)}
                </p>
              </div>
              
              <div className="text-right flex flex-col items-end min-w-20">
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(conversation.latestMessage.timestamp), {
                    addSuffix: true
                  })}
                </p>
                
                {isUnread && (
                  <div className="px-2 py-1 text-xs font-bold rounded-full mt-1 inline-block text-white bg-rose-600">
                    NEW
                  </div>
                )}
                
                {conversation.propertyImage && (
                  <div 
                    className="h-16 w-16 rounded-md border border-gray-200 shadow-sm overflow-hidden mt-2 cursor-pointer hidden sm:block" 
                    onClick={e => handlePropertyClick(e, conversation.propertyId)}
                  >
                    <img 
                      src={conversation.propertyImage} 
                      alt={conversation.propertyTitle || 'Property'} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
