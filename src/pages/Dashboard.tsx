
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import TabNav from '@/components/dashboard/TabNav';
import PropertiesTab from '@/components/dashboard/PropertiesTab';
import OffersTab from '@/components/dashboard/OffersTab';
import LikedPropertiesTab from '@/components/dashboard/LikedPropertiesTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';
import AccountTab from '@/components/dashboard/AccountTab';
import RewardsTab from '@/components/dashboard/RewardsTab';
import WaitlistTab from '@/components/dashboard/WaitlistTab';
import WaitlistedTab from '@/components/dashboard/WaitlistedTab';
import BountiesTab from '@/components/dashboard/BountiesTab';
import PayoutsTab from '@/components/dashboard/PayoutsTab';
import { useNotifications } from '@/context/NotificationContext';
import SEO from '@/components/SEO';

type DashboardTab = 'properties' | 'offers' | 'liked' | 'notifications' | 'account' | 'rewards' | 'waitlist' | 'waitlisted' | 'bounties' | 'payouts';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('properties');
  const { notifications, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (activeTab === 'notifications' && notifications.length > 0) {
      markAllAsRead();
    }
  }, [activeTab, notifications.length, markAllAsRead]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'properties':
        return <PropertiesTab />;
      case 'offers':
        return <OffersTab />;
      case 'liked':
        return <LikedPropertiesTab />;
      case 'notifications':
        return <NotificationsTab notifications={notifications} />;
      case 'account':
        return <AccountTab />;
      case 'rewards':
        return <RewardsTab />;
      case 'waitlist':
        return <WaitlistTab />;
      case 'waitlisted':
        return <WaitlistedTab />;
      case 'bounties':
        return <BountiesTab />;
      case 'payouts':
        return <PayoutsTab />;
      default:
        return <PropertiesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] pt-24">
      <SEO
        title="Dashboard | Realer Estate"
        description="Manage your properties, offers, and account settings on Realer Estate."
        canonical="/dashboard"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#01204b] mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'User'}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
