
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useNotifications } from "@/context/NotificationContext";

interface NotificationCenterProps {
  showIndicator?: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  showIndicator = true
}) => {
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleClearAll = () => {
    clearAll();
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read"
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <Bell />
          {showIndicator && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Notifications</h3>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                className="font-bold"
              >
                Mark All as Read
              </Button>
            )}
          </div>
          
          {notifications.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-md border ${notification.read ? 'bg-background' : 'bg-muted'}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No notifications</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
