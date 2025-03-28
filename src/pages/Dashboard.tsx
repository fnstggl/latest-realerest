
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building, User, Clock, Settings, CheckCircle, XCircle, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PropertyCard from '@/components/PropertyCard';

interface Property {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  image: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  sellerId?: string;
}

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyTitle: string;
  status: 'pending' | 'accepted' | 'declined';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, accountType, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    // Fetch user's properties
    if (accountType === 'seller' && user?.id) {
      const userListingsJSON = localStorage.getItem(`userListings-${user.id}`);
      if (userListingsJSON) {
        setProperties(JSON.parse(userListingsJSON));
      }
    }

    // Get waitlist data
    const waitlistDataJSON = localStorage.getItem('waitlistData');
    if (waitlistDataJSON) {
      const allWaitlistData = JSON.parse(waitlistDataJSON) as WaitlistUser[];
      
      if (accountType === 'seller') {
        // Filter waitlist entries for properties owned by this seller
        const sellerProperties = properties.map(prop => prop.id);
        const sellerWaitlistUsers = allWaitlistData.filter(
          entry => sellerProperties.includes(entry.propertyId)
        );
        setWaitlistUsers(sellerWaitlistUsers);
        
        // Set notification count
        const pendingRequests = sellerWaitlistUsers.filter(
          entry => entry.status === 'pending'
        ).length;
        setNotificationCount(pendingRequests);
      } else {
        // For buyers, show waitlist entries they've made
        const buyerWaitlistEntries = allWaitlistData.filter(
          entry => entry.id === user?.id
        );
        setWaitlistUsers(buyerWaitlistEntries);
      }
    }
  }, [isAuthenticated, navigate, user, accountType, properties]);

  const handleWaitlistAction = (userId: string, propertyId: string, action: 'accepted' | 'declined') => {
    const waitlistDataJSON = localStorage.getItem('waitlistData');
    if (waitlistDataJSON) {
      const allWaitlistData = JSON.parse(waitlistDataJSON) as WaitlistUser[];
      
      // Update the status of the specific entry
      const updatedWaitlistData = allWaitlistData.map(entry => {
        if (entry.id === userId && entry.propertyId === propertyId) {
          return { ...entry, status: action };
        }
        return entry;
      });
      
      // Save back to localStorage
      localStorage.setItem('waitlistData', JSON.stringify(updatedWaitlistData));
      
      // Update state
      const sellerProperties = properties.map(prop => prop.id);
      const sellerWaitlistUsers = updatedWaitlistData.filter(
        entry => sellerProperties.includes(entry.propertyId)
      );
      setWaitlistUsers(sellerWaitlistUsers);
      
      // Update notification count
      const pendingRequests = sellerWaitlistUsers.filter(
        entry => entry.status === 'pending'
      ).length;
      setNotificationCount(pendingRequests);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          {accountType === 'seller' && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d60013] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-black">
                    {notificationCount}
                  </span>
                )}
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
                  <div className="p-4 border-b-2 border-black">
                    <h3 className="font-bold">Waitlist Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {waitlistUsers.length > 0 ? (
                      waitlistUsers.map((waitlistUser, index) => (
                        <div key={index} className="p-4 border-b border-gray-200">
                          <p className="font-bold">{waitlistUser.name}</p>
                          <p className="text-sm">Wants to view: {waitlistUser.propertyTitle}</p>
                          <p className="text-sm">Status: {waitlistUser.status}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p>No waitlist requests</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full bg-white border-4 border-black p-1 mb-8">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white px-4 py-2 font-bold border-2 border-transparent data-[state=active]:border-black"
            >
              <Home size={18} className="mr-2" />
              Overview
            </TabsTrigger>
            
            {accountType === 'seller' && (
              <>
                <TabsTrigger 
                  value="listings" 
                  className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white px-4 py-2 font-bold border-2 border-transparent data-[state=active]:border-black"
                >
                  <Building size={18} className="mr-2" />
                  My Listings
                </TabsTrigger>
                
                <TabsTrigger 
                  value="waitlist" 
                  className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white px-4 py-2 font-bold border-2 border-transparent data-[state=active]:border-black"
                >
                  <Clock size={18} className="mr-2" />
                  Waitlist
                  {notificationCount > 0 && (
                    <span className="ml-2 bg-[#d60013] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-black">
                      {notificationCount}
                    </span>
                  )}
                </TabsTrigger>
              </>
            )}
            
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white px-4 py-2 font-bold border-2 border-transparent data-[state=active]:border-black"
            >
              <User size={18} className="mr-2" />
              Profile
            </TabsTrigger>
            
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white px-4 py-2 font-bold border-2 border-transparent data-[state=active]:border-black"
            >
              <Settings size={18} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <h2 className="text-xl font-bold mb-4">Welcome back, {user?.name}!</h2>
                <p className="mb-4">You are logged in as a <span className="font-bold">{accountType.toUpperCase()}</span></p>
                
                {accountType === 'seller' ? (
                  <div>
                    <p className="mb-4">Quick actions:</p>
                    <div className="flex flex-col gap-3">
                      <Button asChild className="neo-button-primary">
                        <Link to="/sell/create">Create New Listing</Link>
                      </Button>
                      <Button asChild variant="outline" className="neo-button">
                        <Link to="/manage-listings">Manage Listings</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4">Quick actions:</p>
                    <div className="flex flex-col gap-3">
                      <Button asChild className="neo-button-primary">
                        <Link to="/search">Browse Properties</Link>
                      </Button>
                      <Button asChild variant="outline" className="neo-button">
                        <Link to="/saved-properties">Saved Properties</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <h2 className="text-xl font-bold mb-4">Activity Summary</h2>
                
                {accountType === 'seller' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Listings:</span>
                      <span className="font-bold">{properties.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Waitlist Requests:</span>
                      <span className="font-bold">{waitlistUsers.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Views This Week:</span>
                      <span className="font-bold">{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Waitlist Requests Sent:</span>
                      <span className="font-bold">{waitlistUsers.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Waitlist Requests Accepted:</span>
                      <span className="font-bold">
                        {waitlistUsers.filter(user => user.status === 'accepted').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Properties Viewed:</span>
                      <span className="font-bold">{Math.floor(Math.random() * 20)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {accountType === 'seller' && (
            <>
              <TabsContent value="listings" className="mt-6">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My Listings</h2>
                  <Button asChild className="neo-button-primary">
                    <Link to="/sell/create">Add New Listing</Link>
                  </Button>
                </div>
                
                {properties.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                      <PropertyCard 
                        key={property.id}
                        {...property}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-bold mb-4">No Listings Yet</h3>
                    <p className="mb-6">You haven't created any property listings yet.</p>
                    <Button asChild className="neo-button-primary">
                      <Link to="/sell/create">Create Your First Listing</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="waitlist" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Waitlist Requests</h2>
                
                {waitlistUsers.length > 0 ? (
                  <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {waitlistUsers.map((waitlistUser, index) => (
                      <div key={index} className={`p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between ${index !== waitlistUsers.length - 1 ? 'border-b-2 border-black' : ''}`}>
                        <div>
                          <h3 className="font-bold text-lg">{waitlistUser.name}</h3>
                          <p>{waitlistUser.email}</p>
                          <p>{waitlistUser.phone}</p>
                          <p className="text-sm mt-1">
                            Property: <span className="font-bold">{waitlistUser.propertyTitle}</span>
                          </p>
                          <p className="text-sm mt-1">
                            Status: <span className={`font-bold ${
                              waitlistUser.status === 'accepted' ? 'text-green-600' : 
                              waitlistUser.status === 'declined' ? 'text-red-600' : ''
                            }`}>
                              {waitlistUser.status.toUpperCase()}
                            </span>
                          </p>
                        </div>
                        
                        {waitlistUser.status === 'pending' && (
                          <div className="flex gap-2 mt-4 sm:mt-0">
                            <Button 
                              className="neo-button border-green-600 flex items-center"
                              onClick={() => handleWaitlistAction(waitlistUser.id, waitlistUser.propertyId, 'accepted')}
                            >
                              <CheckCircle size={18} className="mr-2 text-green-600" />
                              Accept
                            </Button>
                            <Button 
                              variant="outline" 
                              className="neo-button border-red-600 flex items-center"
                              onClick={() => handleWaitlistAction(waitlistUser.id, waitlistUser.propertyId, 'declined')}
                            >
                              <XCircle size={18} className="mr-2 text-red-600" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-bold mb-2">No Waitlist Requests</h3>
                    <p>You don't have any waitlist requests for your properties yet.</p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
          
          <TabsContent value="profile" className="mt-6">
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
              <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-bold">Name</Label>
                  <Input 
                    id="name" 
                    value={user?.name || ''} 
                    disabled 
                    className="mt-2 border-2 border-black" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-lg font-bold">Email</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="mt-2 border-2 border-black" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="accountType" className="text-lg font-bold">Account Type</Label>
                  <Input 
                    id="accountType" 
                    value={accountType.toUpperCase()} 
                    disabled 
                    className="mt-2 border-2 border-black" 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <Button className="neo-button">Change Password</Button>
                </div>
                
                <div>
                  <Button className="neo-button">Notification Settings</Button>
                </div>
                
                <div>
                  <Button className="neo-button-primary">Update Account Information</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
