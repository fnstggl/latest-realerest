
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
            <span className="absolute -top-1 -right-1 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0892D0] via-[#54C5F8] to-[#0892D0] animate-spin"></span>
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-black">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      
      <PopoverContent className="w-80 p-0 border border-gray-200 shadow-md rounded-lg bg-white/95 backdrop-blur-sm" align="end">
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Notifications</h3>
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs text-black hover:text-black font-medium relative group overflow-hidden">
              <span className="relative z-10">Mark all as read</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" style={{
              background: "transparent",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
              backgroundOrigin: "border-box",
              backgroundClip: "border-box",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude"
            }} />
            </Button>
          </div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ?
        // Loading skeleton - simplified with fewer items
        <div className="space-y-4 p-4">
              {[1, 2].map(i => <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>)}
            </div> : notifications.length > 0 ? <div className="divide-y divide-gray-100">
              {notifications.map(notification => <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-blue-50' : ''} cursor-pointer hover:bg-gray-50 transition-colors`} onClick={() => handleNotificationClick(notification)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{notification.title}</h4>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
  {new Date(notification.timestamp).toISOString().split('T')[0]}
                      </p>
                    </div>
                    {!notification.read && <div className="px-2 py-1 text-xs font-bold rounded text-white bg-black">
                        NEW
                      </div>}
                  </div>
                </div>)}
            </div> : <div className="p-8 text-center">
              <p className="text-gray-500">No notifications</p>
            </div>}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
