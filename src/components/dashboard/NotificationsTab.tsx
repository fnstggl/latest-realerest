
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type?: 'info' | 'success' | 'warning' | 'error' | 'new_listing';
  properties?: any;
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
  return (
    <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
      <div className="border-b-4 border-black p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Recent Notifications</h2>
          <Button 
            onClick={clearAll}
            className="neo-button font-bold" 
            variant="outline"
          >
            Mark All as Read
          </Button>
        </div>
      </div>
      
      {notifications.length > 0 ? (
        <div className="divide-y-2 divide-gray-200">
          {notifications.map(notification => (
            <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-blue-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{notification.title}</h3>
                  <p className="mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {notification.timestamp.toLocaleString()}
                  </p>
                  
                  {/* Show view property button if it's a property-related notification */}
                  {notification.properties?.propertyId && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2 text-sm"
                      onClick={() => {
                        markAsRead(notification.id);
                        window.location.href = `/property/${notification.properties.propertyId}`;
                      }}
                    >
                      View Property
                    </Button>
                  )}
                </div>
                {!notification.read && (
                  <div className="bg-blue-200 px-2 py-1 text-xs font-bold rounded">NEW</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <Bell size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">No Notifications</h3>
          <p className="text-gray-500">You don't have any notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
