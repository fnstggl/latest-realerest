
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type?: 'info' | 'success' | 'warning' | 'error' | 'new_listing';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error' | 'new_listing') => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Calculate unread count only when needed using useMemo
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );
  
  // Load notifications only once on initial mount or when user changes
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        setNotifications([]);
        return;
      }
      
      setLoading(true);
      
      try {
        const storageKey = `notifications_${user.id}`;
        const savedNotifications = localStorage.getItem(storageKey);
        
        if (savedNotifications) {
          try {
            // Parse stored notifications and convert timestamp strings back to Date objects
            const parsedNotifications = JSON.parse(savedNotifications).map((notification: any) => ({
              ...notification,
              timestamp: new Date(notification.timestamp)
            }));
            setNotifications(parsedNotifications);
          } catch (parseError) {
            console.error('Failed to parse notifications from localStorage', parseError);
            // Reset to empty array if data is corrupted
            setNotifications([]);
            // Clear corrupted data
            localStorage.removeItem(storageKey);
          }
        }
      } catch (error) {
        console.error('Error loading notifications from localStorage', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotifications();
  }, [user?.id]);
  
  // Set up Supabase real-time subscription for notifications
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications' 
        }, 
        (payload) => {
          console.log('New notification received:', payload);
          
          // Create a notification from the payload
          if (payload.new) {
            const { title, message, type } = payload.new;
            
            // Add the notification to the state
            const newNotification: Notification = {
              id: uuidv4(),
              title: title || 'New Notification',
              message: message || 'You have a new notification',
              read: false,
              timestamp: new Date(),
              type: type || 'info'
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show a toast for real-time notification
            toast(title || 'New Notification', {
              description: message || 'You have a new notification',
              duration: 5000
            });
          }
        }
      )
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Debounced save to localStorage with error handling
  useEffect(() => {
    if (!user || loading || notifications.length === 0) return;
    
    const storageKey = `notifications_${user.id}`;
    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(notifications));
      } catch (error) {
        console.error('Error saving notifications to localStorage', error);
      }
    }, 500);
    
    return () => clearTimeout(saveTimer);
  }, [notifications, user, loading]);
  
  // Memoize functions to avoid re-renders
  const addNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' | 'new_listing' = 'info') => {
    const newNotification: Notification = {
      id: uuidv4(),
      title,
      message,
      read: false,
      timestamp: new Date(),
      type
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a toast for immediate feedback
    toast(title, {
      description: message,
      duration: 5000
    });
  }, []);
  
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);
  
  const clearAll = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }, []);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
    removeNotification
  }), [notifications, unreadCount, addNotification, markAsRead, clearAll, removeNotification]);
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
