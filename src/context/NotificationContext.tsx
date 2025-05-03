
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';

type NotificationProperties = {
  propertyId?: string;
  conversationId?: string;
  buyerId?: string;
  sellerId?: string;
  [key: string]: any;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: string;
  properties?: NotificationProperties;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  clearAll: () => {},
  addNotification: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

// Helper to check if a notification appears to be a duplicate based on content
const isDuplicateNotification = (newNotification: Omit<Notification, 'id' | 'timestamp' | 'read'>, existingNotifications: Notification[]): boolean => {
  // For waitlist notifications, be extra cautious about duplicates
  if (newNotification.type === 'new_listing') {
    return existingNotifications.some(n => 
      n.title === newNotification.title && 
      n.message === newNotification.message &&
      n.type === newNotification.type &&
      n.properties?.propertyId === newNotification.properties?.propertyId
    );
  }
  
  // Standard duplicate check for other notifications
  return existingNotifications.some(n => 
    n.title === newNotification.title && 
    n.message === newNotification.message
  );
};

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  // Add a ref to track the latest notification added to prevent duplicates
  const lastAddedNotificationRef = useRef<string>('');
  // Add a ref to track notification toasts to prevent duplicates
  const notificationToastsRef = useRef<Set<string>>(new Set());
  // Track already processed notification IDs
  const processedNotificationIdsRef = useRef<Set<string>>(new Set());

  // Load previously processed notification IDs from localStorage on mount
  useEffect(() => {
    try {
      const storedIds = localStorage.getItem('processedNotificationIds');
      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        if (Array.isArray(parsedIds)) {
          processedNotificationIdsRef.current = new Set(parsedIds);
        }
      }
    } catch (err) {
      console.error('Failed to load processed notification IDs:', err);
    }
  }, []);

  // Fetch notifications when user changes
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        if (data) {
          const formattedNotifications: Notification[] = data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || 'info',
            read: n.read || false,
            timestamp: n.created_at,
            properties: n.properties as NotificationProperties || {},
          }));
          setNotifications(formattedNotifications);
          
          // Store all existing notification IDs in our processed set
          formattedNotifications.forEach(n => {
            processedNotificationIdsRef.current.add(n.id);
          });
          
          // Update localStorage with processed IDs
          try {
            localStorage.setItem('processedNotificationIds', 
              JSON.stringify([...processedNotificationIdsRef.current]));
          } catch (err) {
            console.error('Failed to save processed notification IDs:', err);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          // Check if we've already processed this notification
          if (payload.new.id === lastAddedNotificationRef.current || 
              processedNotificationIdsRef.current.has(payload.new.id)) {
            return;
          }
          
          // Add this notification ID to our processed set
          processedNotificationIdsRef.current.add(payload.new.id);
          
          // Update localStorage with processed IDs
          try {
            localStorage.setItem('processedNotificationIds', 
              JSON.stringify([...processedNotificationIdsRef.current]));
          } catch (err) {
            console.error('Failed to save processed notification IDs:', err);
          }
          
          const newNotification: Notification = {
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            type: payload.new.type || 'info',
            read: payload.new.read || false,
            timestamp: payload.new.created_at,
            properties: payload.new.properties as NotificationProperties || {},
          };
          
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Clear all notifications (mark all as read)
  const clearAll = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!user?.id) return;

    // Check if we've already processed a similar notification recently
    const notificationKey = `${notification.title}-${notification.message}-${notification.properties?.propertyId || ''}`;
    if (notificationToastsRef.current.has(notificationKey)) {
      return;
    }
    
    // Check if this notification appears to be a duplicate of an existing one
    if (isDuplicateNotification(notification, notifications)) {
      console.log('Preventing duplicate notification:', notification.title);
      return;
    }
    
    // Add to tracking set and remove after a delay
    notificationToastsRef.current.add(notificationKey);
    setTimeout(() => {
      notificationToastsRef.current.delete(notificationKey);
    }, 5000);

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          properties: notification.properties || {},
        }])
        .select();

      if (error) {
        console.error('Error adding notification:', error);
        return;
      }

      if (data && data.length > 0) {
        // Store the latest notification ID to prevent duplicates
        lastAddedNotificationRef.current = data[0].id;
        
        // Add this notification ID to our processed set
        processedNotificationIdsRef.current.add(data[0].id);
        
        // Update localStorage with processed IDs
        try {
          localStorage.setItem('processedNotificationIds', 
            JSON.stringify([...processedNotificationIdsRef.current]));
        } catch (err) {
          console.error('Failed to save processed notification IDs:', err);
        }

        const newNotification: Notification = {
          id: data[0].id,
          title: data[0].title,
          message: data[0].message,
          type: data[0].type,
          read: false,
          timestamp: data[0].created_at,
          properties: data[0].properties as NotificationProperties || {},
        };

        setNotifications(prev => [newNotification, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const contextValue = {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    addNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
