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
  properties?: any;
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
        // First try to load from Supabase (primary source)
        const { data: dbNotifications, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching notifications from DB:', error);
          // Fall back to localStorage if DB fetch fails
          loadFromLocalStorage();
          return;
        }
        
        if (dbNotifications && dbNotifications.length > 0) {
          // Transform the data to match our Notification interface
          const transformedNotifications: Notification[] = dbNotifications.map(notification => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            read: notification.read || false,
            timestamp: new Date(notification.created_at || Date.now()),
            type: notification.type as 'info' | 'success' | 'warning' | 'error' | 'new_listing',
            properties: notification.properties
          }));
          
          setNotifications(transformedNotifications);
        } else {
          // If no notifications in DB, try localStorage
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading notifications from Supabase', error);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const loadFromLocalStorage = () => {
      try {
        const storageKey = `notifications_${user!.id}`;
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
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Notification change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Create a notification from the payload
            if (payload.new) {
              const { id, title, message, type, properties, created_at, read } = payload.new;
              
              // Add the notification to the state
              const newNotification: Notification = {
                id,
                title: title || 'New Notification',
                message: message || 'You have a new notification',
                read: read || false,
                timestamp: new Date(created_at || Date.now()),
                type: type || 'info',
                properties: properties
              };
              
              setNotifications(prev => {
                // Check if we already have this notification to avoid duplicates
                const exists = prev.some(n => n.id === id);
                if (exists) return prev;
                return [newNotification, ...prev];
              });
              
              // Show a toast for real-time notification
              toast(title || 'New Notification', {
                description: message || 'You have a new notification',
                duration: 5000
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            // Update existing notification
            setNotifications(prev => 
              prev.map(notification => 
                notification.id === payload.new.id 
                  ? { 
                      ...notification, 
                      read: payload.new.read,
                      title: payload.new.title,
                      message: payload.new.message,
                      properties: payload.new.properties
                    } 
                  : notification
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted notification
            setNotifications(prev => 
              prev.filter(notification => notification.id !== payload.old.id)
            );
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
  
  // Improved markAsRead function
  const markAsRead = useCallback(async (id: string) => {
    // Update the local state immediately for UI responsiveness
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update the database if the user is logged in
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);
          
        if (error) {
          console.error('Error marking notification as read in database:', error);
        }
      } catch (error) {
        console.error('Exception marking notification as read:', error);
      }
    }
  }, [user?.id]);
  
  const clearAll = useCallback(async () => {
    // Update local state
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Update database if user is logged in
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('read', false);
          
        if (error) {
          console.error('Error marking all notifications as read in database:', error);
        }
      } catch (error) {
        console.error('Exception marking all notifications as read:', error);
      }
    }
  }, [user?.id]);
  
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
