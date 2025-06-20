
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Conversation } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/hooks/useUserProfiles';

interface MessageListProps {
  conversations: Conversation[];
  loading: boolean;
  userProfilesMap: Record<string, UserProfile>;
}

// Function to get consistent random color for a user
const getUserProfileColor = (userId: string): string => {
  const colors = ['#aaaaae', '#ff92ac', '#ff594f', '#ffa742', '#ffcd48', '#70de7f', '#76d0fb', '#ab92f8'];
  
  // Create a simple hash from the userId to ensure consistency
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get consistent index
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

const MessageList: React.FC<MessageListProps> = ({
  conversations,
  loading,
  userProfilesMap
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
    if (!message) return "";
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
  
  // Debug output for profilesMap
  console.log('[MessageList] ProfilesMap received:', userProfilesMap);
  
  return <div className="divide-y divide-gray-200">
      {conversations.map(conversation => {
        const isUnread = conversation.lastMessage && 
                      !conversation.lastMessage.is_read && 
                      conversation.lastMessage.sender_id !== user?.id;
        
        // Get profile from our profiles map with proper debugging
        const otherUserId = conversation.otherUserId;
        const userProfile = userProfilesMap[otherUserId];
        
        console.log(`[MessageList] Getting profile for ${otherUserId}:`, 
                    userProfile || 'Not found in map');
        
        // CRITICAL FIX: Properly prioritize profile names over fallbacks
        // 1. First priority: Use profile name from userProfilesMap if available and not empty
        // 2. Second priority: Fall back to conversation.otherUserName (legacy data)
        // 3. Last resort: "Unknown User"
        let displayName = "Unknown User";
        
        if (userProfile?.name && userProfile.name.trim() !== '') {
          displayName = userProfile.name.trim();
        } else if (conversation.otherUserName && conversation.otherUserName.trim() !== '') {
          displayName = conversation.otherUserName.trim();
        }
        
        console.log(`[MessageList] Final display name for ${otherUserId}: "${displayName}" (from ${userProfile?.name ? 'profile' : 'conversation fallback'})`);
        
        // Get consistent profile picture color for this user
        const profileColor = getUserProfileColor(otherUserId);
        
        return <div 
                key={conversation.id} 
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? 'bg-blue-50' : ''} rounded-lg my-2 mx-1`} 
                onClick={() => handleConversationClick(conversation)}
              >
              <div className="flex items-start">
                <div className="mr-3 flex flex-col items-center">
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: profileColor }}
                  >
                    {displayName.charAt(0).toUpperCase() || '?'}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-polysans font-bold text-lg text-[#01204b]">
                      {displayName}
                    </h3>
                    {/* UserTag is hidden as requested */}
                  </div>
                  
                  {conversation.propertyId && conversation.propertyTitle && <div className="flex items-center text-sm text-[#0892D0] cursor-pointer hover:underline mb-1" onClick={e => handlePropertyClick(e, conversation.propertyId)}>
                      <Home size={14} className="mr-1" />
                      <span>Regarding: {conversation.propertyTitle}</span>
                      <ExternalLink size={12} className="ml-1" />
                    </div>}
                  
                  <p className={`text-sm font-polysans font-semibold ${isUnread ? 'font-semibold' : 'text-gray-600'}`}>
                    {conversation.lastMessage ? (conversation.lastMessage.sender_id === user?.id ? 'You: ' : '') : ''}
                    {truncateMessage(conversation.lastMessage?.content || 'Start a conversation...')}
                  </p>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <p className="text-xs text-gray-500 mb-2 font-polysans font-semibold">
                    {conversation.lastMessage?.created_at 
                      ? formatDistanceToNow(new Date(conversation.lastMessage.created_at), {
                          addSuffix: true
                        })
                      : 'New conversation'}
                  </p>
                  
                  {isUnread && <div className="px-2 py-1 text-xs font-bold rounded mt-1 inline-block text-white bg-rose-600">
                      NEW
                    </div>}
                    
                  {conversation.propertyImage && (
                    <div 
                      className="h-16 w-16 rounded-md border border-gray-200 shadow-sm overflow-hidden mt-2 cursor-pointer" 
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
            </div>;
      })}
    </div>;
};

export default MessageList;
