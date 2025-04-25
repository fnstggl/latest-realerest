
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Home, User, Bell, ClipboardCheck, Plus, CreditCard, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import PropertiesTab from "@/components/dashboard/PropertiesTab";
import WaitlistTab from "@/components/dashboard/WaitlistTab";
import WaitlistedTab from "@/components/dashboard/WaitlistedTab";
import OffersTab from "@/components/dashboard/OffersTab";
import AccountTab from "@/components/dashboard/AccountTab";
import NotificationsTab from "@/components/dashboard/NotificationsTab";
import LikedPropertiesTab from "@/components/dashboard/LikedPropertiesTab";
import BountiesTab from "@/components/dashboard/BountiesTab";
import RewardsTab from "@/components/dashboard/RewardsTab";
import { TabNav } from "@/components/dashboard/TabNav";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const { notifications, markAsRead, clearAll } = useNotifications();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getTabItems = () => {
    const baseItems = [
      {
        name: "Account",
        value: "account",
        icon: User,
        content: (
          <TabsContent value="account" className="space-y-6">
            <AccountTab user={user} />
          </TabsContent>
        )
      },
      {
        name: "Notifications",
        value: "notifications",
        icon: Bell,
        content: (
          <TabsContent value="notifications" className="space-y-6">
            <NotificationsTab notifications={notifications} markAsRead={markAsRead} clearAll={clearAll} />
          </TabsContent>
        )
      }
    ];

    if (user?.accountType === 'seller') {
      return [
        {
          name: "Properties",
          value: "properties",
          icon: Home,
          content: (
            <TabsContent value="properties" className="space-y-6">
              <PropertiesTab />
            </TabsContent>
          )
        },
        {
          name: "Waitlist",
          value: "waitlist",
          icon: ClipboardCheck,
          content: (
            <TabsContent value="waitlist" className="space-y-6">
              <WaitlistTab />
            </TabsContent>
          )
        },
        {
          name: "Offers",
          value: "offers",
          icon: CreditCard,
          content: (
            <TabsContent value="offers" className="space-y-6">
              <OffersTab />
            </TabsContent>
          )
        },
        ...baseItems
      ];
    }

    if (user?.accountType === 'buyer') {
      return [
        {
          name: "Liked",
          value: "liked",
          icon: Heart,
          content: (
            <TabsContent value="liked" className="space-y-6">
              <LikedPropertiesTab />
            </TabsContent>
          )
        },
        {
          name: "Waitlisted",
          value: "waitlisted",
          icon: ClipboardCheck,
          content: (
            <TabsContent value="waitlisted" className="space-y-6">
              <WaitlistedTab />
            </TabsContent>
          )
        },
        {
          name: "Offers",
          value: "offers",
          icon: CreditCard,
          content: (
            <TabsContent value="offers" className="space-y-6">
              <OffersTab />
            </TabsContent>
          )
        },
        ...baseItems
      ];
    }

    // Wholesaler tabs
    return [
      {
        name: "Bounties",
        value: "bounties",
        icon: Award,
        content: (
          <TabsContent value="bounties" className="space-y-6">
            <BountiesTab />
          </TabsContent>
        )
      },
      {
        name: "Rewards",
        value: "rewards",
        icon: Award,
        content: (
          <TabsContent value="rewards" className="space-y-6">
            <RewardsTab />
          </TabsContent>
        )
      },
      {
        name: "Liked",
        value: "liked",
        icon: Heart,
        content: (
          <TabsContent value="liked" className="space-y-6">
            <LikedPropertiesTab />
          </TabsContent>
        )
      },
      ...baseItems
    ];
  };

  if (!isMounted) {
    return <LoadingSpinner fullScreen />;
  }

  // Set initial active tab based on account type
  useEffect(() => {
    if (user?.accountType === 'seller' && activeTab === 'liked') {
      setActiveTab('properties');
    } else if (user?.accountType === 'buyer' && activeTab === 'properties') {
      setActiveTab('liked');
    } else if (user?.accountType === 'wholesaler' && activeTab === 'properties') {
      setActiveTab('bounties');
    }
  }, [user?.accountType]);

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mx-0 my-[35px] text-black">Dashboard</h1>
              <p className="text-lg text-black">Manage your properties and waitlists</p>
            </div>
            
            {user?.accountType === 'seller' && (
              <Button 
                className="relative bg-white text-black border border-gray-200 hover:bg-white transition-all rounded-xl 
                           text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2" 
                onClick={() => navigate('/sell/create')}
              >
                <Plus size={16} className="mr-1 sm:mr-2" />
                <span>Add Property</span>
                <span 
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </Button>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabNav 
              items={getTabItems()} 
              activeTab={activeTab} 
              onValueChange={setActiveTab} 
            />
            
            {getTabItems().find(item => item.value === activeTab)?.content}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
