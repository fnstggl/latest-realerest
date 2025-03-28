import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Home, Plus, Settings, User, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, accountType, setAccountType } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data
  const savedProperties = [
    {
      id: "prop1",
      title: "Modern Craftsman Home",
      price: 425000,
      location: "Portland, OR",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=roam-in-color-z3QZ6gjGKOA-unsplash.jpg",
    },
    {
      id: "prop2",
      title: "Downtown Luxury Condo",
      price: 610000,
      location: "Seattle, WA",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=scott-webb-167099-unsplash.jpg",
    },
  ];
  
  const listedProperties = [
    {
      id: "list1",
      title: "Renovated Victorian",
      price: 750000,
      status: "active",
      views: 124,
      inquiries: 8,
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=todd-kent-178j8tJrNlc-unsplash.jpg",
    },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };
  
  const handleAccountTypeChange = () => {
    const newType = accountType === 'buyer' ? 'seller' : 'buyer';
    setAccountType(newType);
    toast({
      title: "Account type changed",
      description: `Your account is now set to ${newType} mode.`,
    });
  };
  
  if (!user) {
    navigate('/signin');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 hidden md:block">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#ea384c] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black">DD</div>
            <span className="font-bold text-black text-xl">DoneDeal</span>
          </div>
          
          <nav className="space-y-2">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("overview")}
            >
              <Home className="mr-2 h-4 w-4" />
              Overview
            </Button>
            
            {accountType === 'buyer' && (
              <Button 
                variant={activeTab === "saved" ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab("saved")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Saved Properties
              </Button>
            )}
            
            {accountType === 'seller' && (
              <>
                <Button 
                  variant={activeTab === "listings" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("listings")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  My Listings
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start mt-4" 
                  onClick={() => navigate('/sell/create')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Listing
                </Button>
              </>
            )}
            
            <Button 
              variant={activeTab === "account" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("account")}
            >
              <User className="mr-2 h-4 w-4" />
              Account
            </Button>
            
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    id="account-type" 
                    checked={accountType === 'seller'}
                    onCheckedChange={handleAccountTypeChange}
                  />
                  <Label htmlFor="account-type" className="font-medium">
                    {accountType === 'buyer' ? 'Buyer Account' : 'Seller Account'}
                  </Label>
                </div>
                
                <Button 
                  variant="outline" 
                  className="md:hidden" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {accountType === 'buyer' && (
                  <TabsTrigger value="saved">Saved Properties</TabsTrigger>
                )}
                {accountType === 'seller' && (
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                )}
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Welcome, {user.name}</h2>
                    <p className="text-gray-600 mb-4">
                      You are currently in {accountType} mode. You can switch between buyer and seller modes using the toggle above.
                    </p>
                    
                    {accountType === 'buyer' ? (
                      <Button onClick={() => navigate('/search')}>
                        Browse Properties
                      </Button>
                    ) : (
                      <Button onClick={() => navigate('/sell/create')}>
                        Create New Listing
                      </Button>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                      {accountType === 'buyer' && (
                        <>
                          <div>
                            <p className="text-gray-600">Saved Properties</p>
                            <p className="text-2xl font-bold">{savedProperties.length}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Recent Searches</p>
                            <p className="text-2xl font-bold">5</p>
                          </div>
                        </>
                      )}
                      
                      {accountType === 'seller' && (
                        <>
                          <div>
                            <p className="text-gray-600">Active Listings</p>
                            <p className="text-2xl font-bold">{listedProperties.length}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Views</p>
                            <p className="text-2xl font-bold">124</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Inquiries</p>
                            <p className="text-2xl font-bold">8</p>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="saved">
                <h2 className="text-2xl font-bold mb-6">Saved Properties</h2>
                
                {savedProperties.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map(property => (
                      <Card key={property.id} className="overflow-hidden">
                        <img 
                          src={property.image} 
                          alt={property.title} 
                          className="h-48 w-full object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-lg">{property.title}</h3>
                          <p className="text-gray-600">{property.location}</p>
                          <p className="text-xl font-bold mt-2">${property.price.toLocaleString()}</p>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm">View Details</Button>
                            <Button size="sm" variant="outline">Remove</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">No saved properties yet</h3>
                    <p className="text-gray-600 mb-4">Start browsing and save properties you're interested in.</p>
                    <Button onClick={() => navigate('/search')}>Browse Properties</Button>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="listings">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Listings</h2>
                  <Button onClick={() => navigate('/sell/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Listing
                  </Button>
                </div>
                
                {listedProperties.length > 0 ? (
                  <div className="space-y-4">
                    {listedProperties.map(property => (
                      <Card key={property.id} className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <img 
                            src={property.image} 
                            alt={property.title} 
                            className="h-48 w-full md:w-48 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg">{property.title}</h3>
                                <p className="text-xl font-bold mt-1">${property.price.toLocaleString()}</p>
                              </div>
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                {property.status.toUpperCase()}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-gray-600 text-sm">Views</p>
                                <p className="font-bold">{property.views}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 text-sm">Inquiries</p>
                                <p className="font-bold">{property.inquiries}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-6">
                              <Button size="sm">Edit Listing</Button>
                              <Button size="sm" variant="outline">View Details</Button>
                              <Button size="sm" variant="destructive">Remove</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-4">Create your first property listing to get started.</p>
                    <Button onClick={() => navigate('/sell/create')}>Create Listing</Button>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="account">
                <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Personal Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={user.name} readOnly className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" value={user.email} readOnly className="mt-1" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2">Account Type</h3>
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="account-type-2" 
                          checked={accountType === 'seller'}
                          onCheckedChange={handleAccountTypeChange}
                        />
                        <Label htmlFor="account-type-2">
                          {accountType === 'buyer' ? 'Buyer Account' : 'Seller Account'}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {accountType === 'buyer' 
                          ? 'As a buyer, you can browse and save properties.' 
                          : 'As a seller, you can create and manage property listings.'}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="price-alerts">Price Drop Alerts</Label>
                          <Switch id="price-alerts" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="new-listings">New Listing Alerts</Label>
                          <Switch id="new-listings" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2">Privacy Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="profile-visibility">Profile Visibility</Label>
                          <Switch id="profile-visibility" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="data-sharing">Data Sharing</Label>
                          <Switch id="data-sharing" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
