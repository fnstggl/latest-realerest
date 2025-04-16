
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/context/NotificationContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface NotificationCenterProps {
  showIndicator?: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ showIndicator = true }) => {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Show a toast for new notifications (but not when popover is open)
  useEffect(() => {
    // Show toast for the most recent unread notification when it appears
    const getLatestUnread = () => {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length > 0) {
        return unreadNotifications[0]; // Latest is at the top
      }
      return null;
    };

    const latestUnread = getLatestUnread();
    if (latestUnread && !isOpen) {
      // Only show toast if notification popup is not open
      toast(latestUnread.title, {
        description: latestUnread.message,
        duration: 5000,
      });
    }
  }, [notifications, isOpen]);

  // Safer function to mark all as read with error handling
  const handleMarkAllAsRead = useCallback(() => {
    try {
      clearAll();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }, [clearAll]);

  // Only show loading state when actually fetching data
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      setIsLoading(true);
      // Set a shorter timeout for loading indicator
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, notifications.length]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    
    // Mark all as read only when opening and there are unread notifications
    if (open && unreadCount > 0) {
      try {
        handleMarkAllAsRead();
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    }
  }, [unreadCount, handleMarkAllAsRead]);

  // Handle notification click with context-aware navigation
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setIsOpen(false);
    
    if (!notification.properties) return;
    
    // Navigate based on notification type
    if (notification.type === 'message' && notification.properties.conversationId) {
      // For messages - go to the specific conversation
      navigate(`/messages/${notification.properties.conversationId}`);
    } else if (notification.type === 'new_listing' && notification.properties.propertyId) {
      // For property owners - go to the waitlist tab to review requests
      navigate('/dashboard', { state: { activeTab: 'waitlist' } });
    } else if (notification.properties.propertyId) {
      // For buyers or general property notifications - go to the property page
      navigate(`/property/${notification.properties.propertyId}`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
        >
          <Bell size={20} className="text-black" />
          {unreadCount > 0 && showIndicator && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#0892D0] text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 neo-border neo-shadow-sm" align="end">
        <div className="border-b-4 border-black p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Notifications</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold"
            >
              Mark all as read
            </Button>
          </div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            // Loading skeleton - simplified with fewer items
            <div className="space-y-4 p-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 ${!notification.read ? 'bg-blue-50' : ''} cursor-pointer hover:bg-gray-50 transition-colors`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{notification.title}</h4>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="bg-[#0892D0] px-2 py-1 text-xs font-bold rounded text-white">
                        NEW
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
