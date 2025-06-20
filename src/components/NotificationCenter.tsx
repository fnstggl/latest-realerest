
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from '@/context/NotificationContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface NotificationCenterProps {
  showIndicator?: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  showIndicator = true
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearAll
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Track notifications we've already shown toasts for
  const latestNotificationRef = useRef<string | null>(null);
  // Add a flag to prevent toast stacking
  const toastLockRef = useRef(false);
  // Add storage for shown notification IDs to prevent showing the same one multiple times
  const shownNotificationIdsRef = useRef<Set<string>>(new Set());
  // Add a ref to track the initial mount
  const isInitialMountRef = useRef(true);

  // On component mount, load the previously shown notification IDs from localStorage
  useEffect(() => {
    try {
      const storedIds = localStorage.getItem('shownNotificationIds');
      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        if (Array.isArray(parsedIds)) {
          shownNotificationIdsRef.current = new Set(parsedIds);
        }
      }
    } catch (err) {
      console.error('Failed to load shown notification IDs:', err);
    }

    // Clear the initial mount flag after a short delay to allow the component to fully render
    const timer = setTimeout(() => {
      isInitialMountRef.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
    
    // Skip toast notification on initial mount or when there's no unread notification
    if (isInitialMountRef.current || !latestUnread) {
      return;
    }
    
    // Special handling for waitlist notifications to prevent repeats
    const isWaitlistNotification = latestUnread.type === 'new_listing' || 
      (latestUnread.properties && latestUnread.properties.propertyId);
    
    if (latestUnread && 
        !isOpen && 
        latestUnread.id !== latestNotificationRef.current && 
        !toastLockRef.current && 
        !shownNotificationIdsRef.current.has(latestUnread.id)) {
      
      // Only show toast if notification popup is not open, 
      // we haven't shown this notification before,
      // and no other toast is currently active,
      // and this specific notification ID hasn't been shown before
      latestNotificationRef.current = latestUnread.id;
      toastLockRef.current = true;
      
      // Add this notification ID to our set of shown notifications
      shownNotificationIdsRef.current.add(latestUnread.id);
      
      // Save to localStorage to persist across page refreshes/navigations
      try {
        localStorage.setItem('shownNotificationIds', 
          JSON.stringify([...shownNotificationIdsRef.current]));
      } catch (err) {
        console.error('Failed to save shown notification IDs:', err);
      }
      
      const toastType = latestUnread.type === 'info' ? 'info' : 
                       latestUnread.type === 'error' ? 'error' : 'success';
                       
      toast[toastType](latestUnread.title, {
        description: latestUnread.message,
        // Release lock after toast is dismissed
        onDismiss: () => {
          setTimeout(() => {
            toastLockRef.current = false;
          }, 300);
        }
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
      navigate('/dashboard', {
        state: {
          activeTab: 'waitlist'
        }
      });
    } else if (notification.properties.propertyId) {
      // For buyers or general property notifications - go to the property page
      navigate(`/property/${notification.properties.propertyId}`);
    }
  };

  // Get notification badge based on type
  const getNotificationBadge = (type?: string) => {
    switch (type) {
      case 'like':
        return (
          <Badge 
            className="bg-blue-100 text-blue-700 border-blue-200 font-polysans font-bold text-xs px-2 py-1"
            style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#93c5fd' }}
          >
            LIKE
          </Badge>
        );
      case 'offer':
        return (
          <Badge 
            className="bg-green-100 text-green-700 border-green-200 font-polysans font-bold text-xs px-2 py-1"
            style={{ backgroundColor: '#dcfce7', color: '#15803d', borderColor: '#86efac' }}
          >
            OFFER
          </Badge>
        );
      case 'counter_offer':
        return (
          <Badge 
            className="bg-orange-100 text-orange-700 border-orange-200 font-polysans font-bold text-xs px-2 py-1"
            style={{ backgroundColor: '#fed7aa', color: '#c2410c', borderColor: '#fdba74' }}
          >
            COUNTER
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-transparent" 
        >
          <Bell size={20} className="text-black" />
          {unreadCount > 0 && showIndicator && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 border border-gray-200 shadow-md rounded-lg bg-white/95 backdrop-blur-sm" align="end">
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-polysans text-black">Notifications</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead} 
              className="text-xs text-black hover:text-black font-medium relative border-[#FFFFFF] hover:border-[#fd4801] hover:bg-white rounded-lg px-3 py-1"
            >
              Mark all as read
            </Button>
          </div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            // Loading skeleton - simplified with fewer items
            <div className="space-y-4 p-4">
              {[1, 2].map(i => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 ${!notification.read ? 'bg-blue-50' : ''} cursor-pointer hover:bg-gray-50 transition-colors`} 
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-polysans text-[#01204b]">{notification.title}</h4>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <p className="text-sm font-polysans-semibold">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="px-2 py-1 text-xs font-bold rounded text-white bg-black">
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
