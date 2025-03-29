
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Load notifications from localStorage on initial mount and when user changes
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      
      if (user) {
        try {
          const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
          if (savedNotifications) {
            // Parse stored notifications and convert timestamp strings back to Date objects
            const parsedNotifications = JSON.parse(savedNotifications).map((notification: any) => ({
              ...notification,
              timestamp: new Date(notification.timestamp)
            }));
            setNotifications(parsedNotifications);
          }
        } catch (error) {
          console.error('Error loading notifications from localStorage', error);
        }
      } else {
        // Clear notifications when user logs out
        setNotifications([]);
      }
      
      // Small delay to ensure we don't show loading indicators for too short a time
      setTimeout(() => {
        setLoading(false);
      }, 200);
    };
    
    loadNotifications();
  }, [user]);
  
  // Save notifications to localStorage whenever they change, but throttle the saves
  useEffect(() => {
    if (!user || loading) return;
    
    const saveTimer = setTimeout(() => {
      if (user && notifications.length > 0) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
      }
    }, 300); // Throttle saves to reduce performance impact
    
    return () => clearTimeout(saveTimer);
  }, [notifications, user, loading]);
  
  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotification: Notification = {
      id: uuidv4(),
      title,
      message,
      read: false,
      timestamp: new Date(),
      type
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const clearAll = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      clearAll,
      removeNotification
    }}>
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
