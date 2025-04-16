
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const [showAddForm, setShowAddForm] = useState(false);
  const { notifications, markAsRead, clearAll } = useNotifications();
  
  const {
    myProperties,
    setMyProperties,
    waitlistUsers,
    setWaitlistUsers,
    isLoading,
    setIsLoading
  } = useProperties(user?.id);

  // Set active tab based on navigation state if provided
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state to avoid persisting it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Dashboard</h1>
              <p className="text-lg">Manage your properties and waitlists</p>
            </div>
            
            <Button 
              className="layer-3 glass-content backdrop-blur-md border border-white/40 hover:translate-y-[-5px] transition-all"
              onClick={() => navigate('/sell/create')}
            >
              <Plus size={18} className="mr-2" />
              Add Property
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="layer-2 backdrop-blur-md border-2 border-white/30 bg-white/70 shadow-lg">
              <TabsTrigger value="properties" className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white data-[state=active]:shadow-none font-bold">
                <Home size={18} className="mr-2" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="waitlist" className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white data-[state=active]:shadow-none font-bold">
                <ClipboardCheck size={18} className="mr-2" />
                Waitlist
              </TabsTrigger>
              <TabsTrigger value="offers" className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white data-[state=active]:shadow-none font-bold">
                <CreditCard size={18} className="mr-2" />
                Offers
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white data-[state=active]:shadow-none font-bold">
                <User size={18} className="mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white data-[state=active]:shadow-none font-bold">
                <Bell size={18} className="mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-6 glass-card backdrop-blur-lg border border-white/40 p-6 shadow-lg">
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
            
            {/* Waitlist Tab */}
            <TabsContent value="waitlist" className="space-y-6 glass-card backdrop-blur-lg border border-white/40 p-6 shadow-lg">
              <WaitlistTab 
                waitlistUsers={waitlistUsers}
                setWaitlistUsers={setWaitlistUsers}
              />
            </TabsContent>
            
            {/* Offers Tab */}
            <TabsContent value="offers" className="space-y-6 glass-card backdrop-blur-lg border border-white/40 p-6 shadow-lg">
              <OffersTab />
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6 glass-card backdrop-blur-lg border border-white/40 p-6 shadow-lg">
              <AccountTab user={user} logout={logout} />
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 glass-card backdrop-blur-lg border border-white/40 p-6 shadow-lg">
              <NotificationsTab 
                notifications={notifications}
                markAsRead={markAsRead}
                clearAll={clearAll}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
