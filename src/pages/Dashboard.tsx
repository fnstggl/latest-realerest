import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Home, User, Bell, ClipboardCheck, Plus, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import PropertiesTab from "@/components/dashboard/PropertiesTab";
import WaitlistTab from "@/components/dashboard/WaitlistTab";
import OffersTab from "@/components/dashboard/OffersTab";
import AccountTab from "@/components/dashboard/AccountTab";
import NotificationsTab from "@/components/dashboard/NotificationsTab";
import { useProperties } from "@/hooks/useProperties";
import { TabNav } from "@/components/dashboard/TabNav";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    logout
  } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const [showAddForm, setShowAddForm] = useState(false);
  const {
    notifications,
    markAsRead,
    clearAll
  } = useNotifications();
  const {
    myProperties,
    setMyProperties,
    waitlistUsers,
    setWaitlistUsers,
    isLoading,
    setIsLoading,
    error
  } = useProperties(user?.id);

  // Mounted state to ensure proper hydration before rendering content
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set active tab based on navigation state if provided
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state to avoid persisting it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const tabItems = [
    {
      name: "Properties",
      value: "properties",
      icon: Home,
      content: (
        <TabsContent value="properties" className="space-y-6">
          <PropertiesTab 
            myProperties={myProperties} 
            setMyProperties={setMyProperties} 
            waitlistUsers={waitlistUsers} 
            showAddForm={showAddForm} 
            setShowAddForm={setShowAddForm} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            user={user} 
          />
        </TabsContent>
      )
    },
    {
      name: "Waitlist",
      value: "waitlist",
      icon: ClipboardCheck,
      content: (
        <TabsContent value="waitlist" className="space-y-6">
          <WaitlistTab waitlistUsers={waitlistUsers} setWaitlistUsers={setWaitlistUsers} />
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
    {
      name: "Account",
      value: "account",
      icon: User,
      content: (
        <TabsContent value="account" className="space-y-6 bg-white border border-gray-200 p-6 shadow-sm rounded-xl">
          <AccountTab user={user} logout={logout} />
        </TabsContent>
      )
    },
    {
      name: "Notifications",
      value: "notifications",
      icon: Bell,
      content: (
        <TabsContent value="notifications" className="space-y-6 bg-white border border-gray-200 p-6 shadow-sm rounded-xl">
          <NotificationsTab notifications={notifications} markAsRead={markAsRead} clearAll={clearAll} />
        </TabsContent>
      )
    }
  ];

  if (!isMounted) {
    return <LoadingSpinner fullScreen />;
  }

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
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabNav 
              items={tabItems} 
              activeTab={activeTab} 
              onValueChange={setActiveTab} 
            />
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                <p>There was an error loading your data. Please refresh and try again.</p>
              </div>
            )}
            
            {tabItems.find(item => item.value === activeTab)?.content}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
