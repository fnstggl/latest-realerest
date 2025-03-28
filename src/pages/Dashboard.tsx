
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Home, Settings, Package, ChevronRight, Plus, Bell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import PropertyCard from '@/components/PropertyCard';

// Mock data for listings - this will be replaced with real data
const mockListings = [
  {
    id: "prop1",
    title: "Modern Craftsman Home",
    price: 425000,
    marketPrice: 520000,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=roam-in-color-z3QZ6gjGKOA-unsplash.jpg",
    location: "Portland, OR",
    beds: 3,
    baths: 2,
    sqft: 1850,
    belowMarket: 18,
  }
];

// Mock waitlist data - this will be connected to real data
const mockWaitlistUsers = [
  { id: 'user1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567', propertyId: 'prop1', status: 'pending' },
  { id: 'user2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-987-6543', propertyId: 'prop1', status: 'pending' }
];

interface Listing {
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
}

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  status: 'pending' | 'accepted' | 'declined';
}

const Dashboard: React.FC = () => {
  const { user, logout, accountType } = useAuth();
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const { toast } = useToast();

  // Simulating data fetching - in a real app, this would connect to a database
  useEffect(() => {
    // In a real app, we would fetch the user's listings and waitlist users from the database
    if (accountType === 'seller') {
      setListings(mockListings);
      setWaitlistUsers(mockWaitlistUsers);
      setNotificationCount(mockWaitlistUsers.filter(user => user.status === 'pending').length);
    }
  }, [accountType]);

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  const handleAcceptUser = (userId: string) => {
    setWaitlistUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: 'accepted' } : user
      )
    );
    
    toast({
      title: "Buyer accepted!",
      description: "The buyer has been notified and can now view the full property details.",
    });
    
    // Decrease notification count
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const handleDeclineUser = (userId: string) => {
    setWaitlistUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: 'declined' } : user
      )
    );
    
    toast({
      title: "Buyer declined",
      description: "The buyer has been removed from the waitlist.",
    });
    
    // Decrease notification count
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.name}! ({accountType})
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and listings here.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            {accountType === 'seller' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h3 className="font-bold">Waitlist Notifications</h3>
                    {waitlistUsers.filter(user => user.status === 'pending').length > 0 ? (
                      waitlistUsers
                        .filter(user => user.status === 'pending')
                        .map(user => (
                          <div key={user.id} className="border-b pb-2">
                            <p><strong>{user.name}</strong> joined the waitlist for one of your properties.</p>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={() => handleAcceptUser(user.id)}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeclineUser(user.id)}
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p>No new notifications</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="account" className="w-full space-y-4">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            {accountType === 'seller' && (
              <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            )}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" value={user?.name} disabled />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" value={user?.email} disabled />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Account</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="listings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Listings</h2>
              <Button onClick={() => navigate('/sell/create')}>
                <Plus className="mr-2" size={16} />
                Create New Listing
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <CardDescription>
                  Here are your currently active listings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {listings.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map(listing => (
                      <PropertyCard key={listing.id} {...listing} />
                    ))}
                  </div>
                ) : (
                  <p>No active listings found.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="secondary" onClick={() => navigate('/sell/manage')}>View All Listings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          {accountType === 'seller' && (
            <TabsContent value="waitlist" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Waitlist Management</CardTitle>
                  <CardDescription>
                    Manage buyers who have joined the waitlist for your properties.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {waitlistUsers.length > 0 ? (
                    <div className="space-y-4">
                      {waitlistUsers.map(user => (
                        <div key={user.id} className="border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email} • {user.phone}</p>
                              <p className="text-sm">
                                Status: <span className={
                                  user.status === 'accepted' 
                                    ? 'text-green-500 font-bold' 
                                    : user.status === 'declined' 
                                      ? 'text-red-500 font-bold'
                                      : 'text-yellow-500 font-bold'
                                }>
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                              </p>
                            </div>
                            {user.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={() => handleAcceptUser(user.id)}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleDeclineUser(user.id)}
                                >
                                  Decline
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No users have joined the waitlist yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>
                  Customize your experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme">Dark Mode</Label>
                  <Switch id="theme" checked={isDarkTheme} onCheckedChange={(checked) => {
                    setIsDarkTheme(checked);
                    if (checked) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                    toast({
                      title: "Theme toggled!",
                      description: `Dark mode is now ${checked ? 'enabled' : 'disabled'}.`,
                    })
                  }} />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
