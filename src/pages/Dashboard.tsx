// Fix imports for notification context
import { useNotifications } from '@/context/NotificationContext';
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProperties } from '@/hooks/useProperties';
import PropertyCard from '@/components/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();
  const { properties, loading, error, fetchProperties } = useProperties();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const handleNotificationClick = (id: string, conversationId?: string, senderId?: string) => {
    markAsRead(id);
    if (conversationId) {
      navigate(`/messages/${conversationId}`);
    } else {
      navigate('/messages');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 mt-16 sm:mt-20">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Dashboard</h1>
            <p className="text-sm sm:text-base md:text-lg">Welcome, {user?.email}!</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/property/create')} className="text-white bg-black font-extrabold">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Property
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.properties?.conversationId, notification.properties?.senderId)}
                  className="bg-white/90 border border-gray-200 rounded-md p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="font-semibold">{notification.title}</div>
                  <div className="text-sm text-gray-600">{notification.message}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Properties</h2>
            <Button variant="link" onClick={() => navigate('/properties')}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-40 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
