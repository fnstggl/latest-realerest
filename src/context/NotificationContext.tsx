
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

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
