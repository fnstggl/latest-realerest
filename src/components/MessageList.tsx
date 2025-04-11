
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Conversation } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface MessageListProps {
  conversations: Conversation[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ conversations, loading }) => {
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
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-200">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <div className="p-12 text-center">
        <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold mb-2">No Messages Yet</h3>
        <p className="text-gray-500 mb-4">You haven't messaged anyone yet.</p>
        <Button 
          onClick={() => navigate('/search')}
          className="neo-button-primary"
        >
          Find Properties
        </Button>
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const isUnread = !conversation.latestMessage.isRead && conversation.latestMessage.senderId !== user?.id;
        return (
          <div 
            key={conversation.id} 
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? 'bg-blue-50' : ''}`}
            onClick={() => handleConversationClick(conversation)}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{conversation.otherUserName}</h3>
                
                {conversation.propertyId && conversation.propertyTitle && (
                  <div 
                    className="flex items-center text-sm text-blue-600 cursor-pointer hover:underline mb-1"
                    onClick={(e) => handlePropertyClick(e, conversation.propertyId)}
                  >
                    <Home size={14} className="mr-1" />
                    <span>Regarding: {conversation.propertyTitle}</span>
                    <ExternalLink size={12} className="ml-1" />
                  </div>
                )}
                
                <p className={`text-sm ${isUnread ? 'font-semibold' : 'text-gray-600'}`}>
                  {conversation.latestMessage.senderId === user?.id ? 'You: ' : ''}
                  {truncateMessage(conversation.latestMessage.content)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(conversation.latestMessage.timestamp), { addSuffix: true })}
                </p>
                {isUnread && (
                  <div className="bg-blue-200 px-2 py-1 text-xs font-bold rounded mt-1 inline-block">
                    NEW
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
