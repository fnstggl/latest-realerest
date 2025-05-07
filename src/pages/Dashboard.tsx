import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Heart, ListChecks, MessageSquare, Coins, Gem, CreditCard, User, Bell } from 'lucide-react';
import PropertiesTab from '@/components/dashboard/PropertiesTab';
import WaitlistTab from '@/components/dashboard/WaitlistTab';
import LikedPropertiesTab from '@/components/dashboard/LikedPropertiesTab';
import OffersTab from '@/components/dashboard/OffersTab';
import RewardsTab from '@/components/dashboard/RewardsTab';
import AccountTab from '@/components/dashboard/AccountTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';
import WaitlistedTab from '@/components/dashboard/WaitlistedTab';
import BountiesTab from '@/components/dashboard/BountiesTab';
import PayoutsTab from '@/components/dashboard/PayoutsTab';
import { useProperties } from '@/hooks/useProperties';
import { useNotifications } from '@/context/NotificationContext';

// Fix TypeScript error by using a consistent Notification type
interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type?: 'info' | 'success' | 'warning' | 'error' | 'new_listing' | 'message';
  properties?: {
    propertyId?: string;
    conversationId?: string;
    buyerId?: string;
    sellerId?: string;
    [key: string]: any;
  };
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { myProperties, isLoading, error, waitlistUsers, setWaitlistUsers } = useProperties(user?.id);
  const { notifications, markAsRead, clearAll } = useNotifications();
  const [waitlistedProperties, setWaitlistedProperties] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchWaitlistedProperties = async () => {
      // Placeholder for fetching properties the user has waitlisted
      // Replace with actual data fetching logic
      setWaitlistedProperties([]);
    };

    if (user) {
      fetchWaitlistedProperties();
    }
  }, [user]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Store the active tab in localStorage
    localStorage.setItem('activeDashboardTab', tab);
  };

  // Load active tab from localStorage on component mount
  useEffect(() => {
    const storedTab = localStorage.getItem('activeDashboardTab');
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Convert notifications from context to the dashboard format
  const formattedNotifications = useMemo(() => {
    return notifications.map(notification => ({
      ...notification,
      timestamp: new Date(notification.timestamp)
    })) as DashboardNotification[];
  }, [notifications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD6DC] via-[#F8F5FC] to-[#B6D7FF]">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="font-bold">
            Logout
          </Button>
        </div>
        
        <nav className="space-x-4 sm:space-x-6 lg:space-x-8">
          <Button variant="ghost" onClick={() => handleTabChange('waitlisted')} className={`gap-2 ${activeTab === 'waitlisted' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <ListChecks size={16} />
            Waitlisted
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('properties')} className={`gap-2 ${activeTab === 'properties' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <Home size={16} />
            My Properties
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('waitlist')} className={`gap-2 ${activeTab === 'waitlist' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <User size={16} />
            Waitlist Requests
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('likes')} className={`gap-2 ${activeTab === 'likes' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <Heart size={16} />
            Liked Properties
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('offers')} className={`gap-2 ${activeTab === 'offers' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <MessageSquare size={16} />
            Offers
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('rewards')} className={`gap-2 ${activeTab === 'rewards' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <Coins size={16} />
            Rewards
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('bounties')} className={`gap-2 ${activeTab === 'bounties' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <Gem size={16} />
            Bounties
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('payouts')} className={`gap-2 ${activeTab === 'payouts' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <CreditCard size={16} />
            Payouts
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('account')} className={`gap-2 ${activeTab === 'account' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <User size={16} />
            Account
          </Button>
          <Button variant="ghost" onClick={() => handleTabChange('notifications')} className={`gap-2 ${activeTab === 'notifications' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
            <Bell size={16} />
            Notifications
          </Button>
        </nav>
        
        <div className="mt-8">
          {activeTab === 'waitlisted' && <WaitlistedTab waitlistedProperties={waitlistedProperties} />}
          {activeTab === 'properties' && <PropertiesTab properties={myProperties} isLoading={isLoading} error={error} />}
          {activeTab === 'waitlist' && <WaitlistTab waitlistUsers={waitlistUsers} setWaitlistUsers={setWaitlistUsers} />}
          {activeTab === 'likes' && <LikedPropertiesTab />}
          {activeTab === 'offers' && <OffersTab />}
          {activeTab === 'rewards' && <RewardsTab />}
          {activeTab === 'bounties' && <BountiesTab />}
          {activeTab === 'payouts' && <PayoutsTab />}
          {activeTab === 'account' && <AccountTab />}
          {activeTab === 'notifications' && <NotificationsTab 
            notifications={formattedNotifications} 
            markAsRead={markAsRead} 
            clearAll={clearAll} 
          />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
