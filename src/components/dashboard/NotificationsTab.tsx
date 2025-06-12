
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface NotificationProperties {
  propertyId?: string;
  conversationId?: string;
  buyerId?: string;
  sellerId?: string;
  [key: string]: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type?: 'info' | 'success' | 'warning' | 'error' | 'new_listing' | 'message' | 'like' | 'offer' | 'counter_offer';
  properties?: NotificationProperties;
}

interface NotificationsTabProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationCenter: React.FC<NotificationsTabProps> = ({ 
  notifications, 
  markAsRead,
  clearAll
}) => {
  const navigate = useNavigate();
  
  // Handle notification click with context-aware navigation
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (!notification.properties) return;
    
    // Navigate based on notification type
    if (notification.type === 'new_listing' && notification.properties.propertyId) {
      // For property owners - go to the waitlist tab to review requests
      navigate('/dashboard', { state: { activeTab: 'waitlist' } });
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-polysans text-[#01204b]">Recent Notifications</h2>
          <Button 
            onClick={clearAll}
            className="font-polysans-semibold border border-gray-200 hover:border-[#0892D0] hover:bg-white" 
            variant="outline"
          >
            Mark All as Read
          </Button>
        </div>
      </div>
      
      {notifications.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 ${!notification.read ? 'bg-blue-50' : 'bg-white'} cursor-pointer hover:bg-gray-50 transition-all`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-polysans text-lg text-[#01204b]">{notification.title}</h3>
                    {getNotificationBadge(notification.type)}
                  </div>
                  <p className="mb-2 font-polysans-semibold text-[#01204b]">{notification.message}</p>
                  <p className="text-sm text-gray-500 font-polysans-semibold">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="bg-[#0892D0] px-2 py-1 text-xs font-polysans rounded text-white">NEW</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white">
          <Bell size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-polysans mb-2 text-[#01204b]">No Notifications</h3>
          <p className="text-gray-500 font-polysans-semibold">You don't have any notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
