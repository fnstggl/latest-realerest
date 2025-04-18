
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
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
    setIsLoading
  } = useProperties(user?.id);

  // Update the active tab based on URL search parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
    
    // Property ID can be used by the waitlist tab to filter
    const propertyId = searchParams.get('propertyId');
    if (propertyId && tab === 'waitlist') {
      // You can pass this to the WaitlistTab component if needed
    }
  }, [searchParams]);
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mx-0 my-[35px] text-black">Dashboard</h1>
              <p className="text-lg text-black">Manage your properties and waitlists</p>
            </div>
            
            <Button className="relative bg-white text-black border border-gray-200 hover:bg-white transition-all rounded-xl" onClick={() => navigate('/sell/create')}>
              <Plus size={18} className="mr-2" />
              <span>Add Property</span>
              <span 
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
                style={{
                  background: "transparent",
                  border: "2px solid transparent",
                  backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude"
                }}
              />
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
            <TabsList className="bg-white border border-gray-200 shadow-sm">
              <TabsTrigger value="properties" className="data-[state=active]:text-black data-[state=active]:bg-white data-[state=active]:shadow-none font-bold relative text-black hover:bg-white group">
                <Home size={18} className="mr-2" />
                Properties
                <span 
                  className="absolute inset-0 opacity-0 data-[state=active]:opacity-100 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </TabsTrigger>
              <TabsTrigger value="waitlist" className="data-[state=active]:text-black data-[state=active]:bg-white data-[state=active]:shadow-none font-bold relative text-black hover:bg-white group">
                <ClipboardCheck size={18} className="mr-2" />
                Waitlist
                <span 
                  className="absolute inset-0 opacity-0 data-[state=active]:opacity-100 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </TabsTrigger>
              
              <TabsTrigger value="offers" className="data-[state=active]:text-black data-[state=active]:bg-white data-[state=active]:shadow-none font-bold relative text-black hover:bg-white group">
                <CreditCard size={18} className="mr-2" />
                Offers
                <span 
                  className="absolute inset-0 opacity-0 data-[state=active]:opacity-100 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:text-black data-[state=active]:bg-white data-[state=active]:shadow-none font-bold relative text-black hover:bg-white group">
                <User size={18} className="mr-2" />
                Account
                <span 
                  className="absolute inset-0 opacity-0 data-[state=active]:opacity-100 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:text-black data-[state=active]:bg-white data-[state=active]:shadow-none font-bold relative text-black hover:bg-white group">
                <Bell size={18} className="mr-2" />
                Notifications
                <span 
                  className="absolute inset-0 opacity-0 data-[state=active]:opacity-100 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </TabsTrigger>
            </TabsList>
            
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
            
            <TabsContent value="waitlist" className="space-y-6">
              <WaitlistTab 
                waitlistUsers={waitlistUsers} 
                setWaitlistUsers={setWaitlistUsers} 
                propertyFilter={searchParams.get('propertyId')} 
              />
            </TabsContent>
            
            <TabsContent value="offers" className="space-y-6">
              <OffersTab />
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6 bg-white border border-gray-200 p-6 shadow-sm rounded-xl">
              <AccountTab user={user} logout={logout} />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 bg-white border border-gray-200 p-6 shadow-sm rounded-xl">
              <NotificationsTab notifications={notifications} markAsRead={markAsRead} clearAll={clearAll} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
