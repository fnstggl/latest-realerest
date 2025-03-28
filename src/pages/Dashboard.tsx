import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Building2,
  Home,
  User,
  Bell,
  ClipboardCheck,
  Plus,
  Check,
  X,
  Trash2,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNotifications } from "@/context/NotificationContext";
import NotificationCenter from "@/components/NotificationCenter";

// Types
interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  status: "pending" | "accepted" | "declined";
}

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
}

// Mock data
const mockProperties: Property[] = [
  {
    id: "prop1",
    title: "Modern Townhouse",
    price: 350000,
    marketPrice: 420000,
    image: "https://placehold.co/600x400?text=Property+Image",
    location: "123 Main St, San Francisco, CA",
    beds: 3,
    baths: 2,
    sqft: 1800,
    belowMarket: 17,
  },
  {
    id: "prop2",
    title: "Downtown Condo",
    price: 275000,
    marketPrice: 325000,
    image: "https://placehold.co/600x400?text=Property+Image",
    location: "456 Market St, San Francisco, CA",
    beds: 2,
    baths: 2,
    sqft: 1200,
    belowMarket: 15,
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { accountType, setAccountType, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { notifications, markAsRead, clearAll } = useNotifications();
  
  // Form fields
  const [newProperty, setNewProperty] = useState({
    title: "",
    price: "",
    marketPrice: "",
    location: "",
    beds: "",
    baths: "",
    sqft: "",
  });

  useEffect(() => {
    // Load properties from localStorage
    const storedProperties = localStorage.getItem("propertyListings");
    if (storedProperties) {
      const parsedProperties = JSON.parse(storedProperties);
      setMyProperties(parsedProperties);
    } else {
      // No properties in localStorage, set mock data
      setMyProperties(mockProperties);
      // Save mock data to localStorage
      localStorage.setItem("propertyListings", JSON.stringify(mockProperties));
    }

    // Set mock waitlist data
    const mockWaitlistUsers: WaitlistUser[] = [
      {
        id: "user1",
        name: "John Doe",
        email: "john@example.com",
        phone: "555-123-4567",
        propertyId: "prop1",
        status: "pending"
      },
      {
        id: "user2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "555-987-6543",
        propertyId: "prop2",
        status: "accepted"
      },
      {
        id: "user3",
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "555-555-5555",
        propertyId: "prop1",
        status: "declined"
      },
    ];
    
    setWaitlistUsers(mockWaitlistUsers);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: value,
    });
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newProperty.title || !newProperty.price || !newProperty.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Create new property
    const price = parseFloat(newProperty.price);
    const marketPrice = parseFloat(newProperty.marketPrice) || price * 1.2;
    const belowMarket = Math.round(((marketPrice - price) / marketPrice) * 100);
    
    const newPropertyObj: Property = {
      id: `prop${Date.now()}`,
      title: newProperty.title,
      price: price,
      marketPrice: marketPrice,
      image: "https://placehold.co/600x400?text=New+Property",
      location: newProperty.location,
      beds: parseInt(newProperty.beds) || 0,
      baths: parseInt(newProperty.baths) || 0,
      sqft: parseInt(newProperty.sqft) || 0,
      belowMarket: belowMarket,
    };
    
    // Add to properties list
    const updatedProperties = [...myProperties, newPropertyObj];
    setMyProperties(updatedProperties);
    
    // Save to localStorage
    localStorage.setItem("propertyListings", JSON.stringify(updatedProperties));
    
    // Reset form
    setNewProperty({
      title: "",
      price: "",
      marketPrice: "",
      location: "",
      beds: "",
      baths: "",
      sqft: "",
    });
    
    setShowAddForm(false);
    toast.success("Property added successfully!");
  };

  const handleUnlistProperty = (propertyId: string) => {
    // Filter out the property to be removed
    const updatedProperties = myProperties.filter(property => property.id !== propertyId);
    
    // Update state and localStorage
    setMyProperties(updatedProperties);
    localStorage.setItem("propertyListings", JSON.stringify(updatedProperties));
    
    // Remove associated waitlist entries
    const updatedWaitlist = waitlistUsers.filter(user => user.propertyId !== propertyId);
    setWaitlistUsers(updatedWaitlist);
    
    // Show success message
    toast.success("Property unlisted successfully");
  };

  const handleUpdateWaitlistStatus = (userId: string, newStatus: "accepted" | "declined") => {
    const updatedUsers = waitlistUsers.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    
    setWaitlistUsers(updatedUsers);
    
    if (newStatus === "accepted") {
      toast.success("User accepted to waitlist!");
    } else {
      toast.success("User declined from waitlist.");
    }
  };

  // Account type change handler
  const handleAccountTypeChange = (type: 'buyer' | 'seller') => {
    setAccountType(type);
    localStorage.setItem('accountType', type);
    toast.success(`Account type changed to ${type}`);
  };

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
              <p className="text-lg">Manage your {accountType === 'seller' ? 'properties' : 'waitlists'}</p>
            </div>
            
            {accountType === 'seller' && (
              <Button 
                className="neo-button-primary"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={18} className="mr-2" />
                Add Property
              </Button>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <TabsTrigger value="properties" className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white data-[state=active]:shadow-none font-bold">
                <Home size={18} className="mr-2" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="waitlist" className="data-[state=active]:bg-[#d60013] data-[state=active]:text-white data-[state=active]:shadow-none font-bold">
                <ClipboardCheck size={18} className="mr-2" />
                Waitlist
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
            <TabsContent value="properties" className="space-y-6">
              {showAddForm ? (
                <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Add New Property</h2>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowAddForm(false)}
                      className="neo-button"
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  <form onSubmit={handleAddProperty} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="title" className="font-bold">Property Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={newProperty.title}
                          onChange={handleInputChange}
                          placeholder="e.g. Modern Townhouse"
                          className="mt-2 border-2 border-black"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location" className="font-bold">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={newProperty.location}
                          onChange={handleInputChange}
                          placeholder="e.g. 123 Main St, San Francisco, CA"
                          className="mt-2 border-2 border-black"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price" className="font-bold">Asking Price ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={newProperty.price}
                          onChange={handleInputChange}
                          placeholder="e.g. 350000"
                          className="mt-2 border-2 border-black"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="marketPrice" className="font-bold">Market Value ($)</Label>
                        <Input
                          id="marketPrice"
                          name="marketPrice"
                          type="number"
                          value={newProperty.marketPrice}
                          onChange={handleInputChange}
                          placeholder="e.g. 420000"
                          className="mt-2 border-2 border-black"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="beds" className="font-bold">Bedrooms</Label>
                        <Input
                          id="beds"
                          name="beds"
                          type="number"
                          value={newProperty.beds}
                          onChange={handleInputChange}
                          placeholder="e.g. 3"
                          className="mt-2 border-2 border-black"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="baths" className="font-bold">Bathrooms</Label>
                        <Input
                          id="baths"
                          name="baths"
                          type="number"
                          value={newProperty.baths}
                          onChange={handleInputChange}
                          placeholder="e.g. 2"
                          className="mt-2 border-2 border-black"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="sqft" className="font-bold">Square Footage</Label>
                        <Input
                          id="sqft"
                          name="sqft"
                          type="number"
                          value={newProperty.sqft}
                          onChange={handleInputChange}
                          placeholder="e.g. 1800"
                          className="mt-2 border-2 border-black"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="neo-button-primary">
                      Add Property
                    </Button>
                  </form>
                </div>
              ) : (
                <>
                  {myProperties.length > 0 ? (
                    <div className="grid md:grid-cols-1 gap-6">
                      {myProperties.map((property) => (
                        <div key={property.id} className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/3">
                              <img 
                                src={property.image} 
                                alt={property.title} 
                                className="h-64 w-full object-cover border-b-4 md:border-b-0 md:border-r-4 border-black"
                              />
                            </div>
                            <div className="p-6 flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-2xl font-bold">{property.title}</h3>
                                <div className="bg-[#d60013] text-white px-3 py-1 border-2 border-black font-bold">
                                  {property.belowMarket}% BELOW MARKET
                                </div>
                              </div>
                              <p className="text-lg mb-4">{property.location}</p>
                              
                              <div className="flex gap-6 mb-6">
                                <div className="text-2xl font-bold">${property.price.toLocaleString()}</div>
                                <div className="text-gray-500 line-through">${property.marketPrice.toLocaleString()}</div>
                              </div>
                              
                              <div className="flex gap-6 mb-6">
                                <div className="font-bold">{property.beds} Beds</div>
                                <div className="font-bold">{property.baths} Baths</div>
                                <div className="font-bold">{property.sqft.toLocaleString()} sqft</div>
                              </div>
                              
                              <div className="flex gap-4">
                                <Button asChild className="neo-button" variant="outline">
                                  <Link to={`/property/${property.id}`}>View Listing</Link>
                                </Button>
                                {accountType === 'seller' && (
                                  <>
                                    <Button className="neo-button-primary">
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      className="bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                      onClick={() => handleUnlistProperty(property.id)}
                                    >
                                      <Trash2 size={18} className="mr-2" />
                                      Unlist
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {accountType === 'seller' && (
                            <div className="border-t-4 border-black p-4 bg-gray-50">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-bold mr-2">Waitlist:</span>
                                  {waitlistUsers.filter(user => user.propertyId === property.id).length} interested buyers
                                </div>
                                <Button asChild className="neo-button" variant="outline">
                                  <Link to={`/dashboard?tab=waitlist&propertyId=${property.id}`}>
                                    Manage Waitlist
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                      <Building2 size={48} className="mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-4">No Properties Listed</h3>
                      <p className="mb-6">You haven't listed any properties yet.</p>
                      <Button 
                        asChild
                        className="neo-button-primary"
                      >
                        <Link to="/sell/create">
                          <Plus size={18} className="mr-2" />
                          Add Your First Property
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            {/* Waitlist Tab */}
            <TabsContent value="waitlist" className="space-y-6">
              {waitlistUsers.length > 0 ? (
                <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                  <div className="border-b-4 border-black p-4 bg-gray-50">
                    <h2 className="text-xl font-bold">Waitlist Requests</h2>
                  </div>
                  
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-4 border-black">
                        <th className="text-left p-4 font-bold">Name</th>
                        <th className="text-left p-4 font-bold">Contact</th>
                        <th className="text-left p-4 font-bold">Property</th>
                        <th className="text-left p-4 font-bold">Status</th>
                        {accountType === 'seller' && (
                          <th className="text-left p-4 font-bold">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {waitlistUsers.map((user) => {
                        const property = myProperties.find(p => p.id === user.propertyId);
                        return (
                          <tr key={user.id} className="border-b-2 border-gray-200">
                            <td className="p-4 font-bold">{user.name}</td>
                            <td className="p-4">
                              <div>{user.email}</div>
                              <div>{user.phone}</div>
                            </td>
                            <td className="p-4">{property?.title || 'Unknown Property'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 font-bold ${
                                user.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                user.status === 'declined' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.status.toUpperCase()}
                              </span>
                            </td>
                            {accountType === 'seller' && (
                              <td className="p-4">
                                <div className="flex gap-2">
                                  {user.status === 'pending' && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700 border-2 border-black"
                                        onClick={() => handleUpdateWaitlistStatus(user.id, 'accepted')}
                                      >
                                        <Check size={16} className="mr-1" />
                                        Accept
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        className="bg-red-600 hover:bg-red-700 border-2 border-black"
                                        onClick={() => handleUpdateWaitlistStatus(user.id, 'declined')}
                                      >
                                        <X size={16} className="mr-1" />
                                        Decline
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <ClipboardCheck size={48} className="mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">No Waitlist Requests</h3>
                  {accountType === 'buyer' ? (
                    <>
                      <p className="mb-6">You haven't joined any property waitlists yet.</p>
                      <Button asChild className="neo-button-primary">
                        <Link to="/search">Browse Properties</Link>
                      </Button>
                    </>
                  ) : (
                    <p>You don't have any waitlist requests for your properties yet.</p>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Account Information</h2>
                  <div className="bg-[#d60013] text-white px-3 py-1 border-2 border-black font-bold">
                    {accountType.toUpperCase()} ACCOUNT
                  </div>
                </div>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="font-bold">Full Name</Label>
                      <Input
                        id="name"
                        defaultValue="John Doe"
                        className="mt-2 border-2 border-black"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="font-bold">Email Address</Label>
                      <Input
                        id="email"
                        defaultValue="john@example.com"
                        className="mt-2 border-2 border-black"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                      <Input
                        id="phone"
                        defaultValue="555-123-4567"
                        className="mt-2 border-2 border-black"
                      />
                    </div>
                  </div>
                  
                  <Button className="neo-button-primary">
                    Save Changes
                  </Button>
                </form>
              </div>
              
              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
                <h2 className="text-2xl font-bold mb-6">Account Type</h2>
                
                <div className="p-6 border-2 border-black mb-6">
                  <h3 className="font-bold text-lg mb-4">Select your account type:</h3>
                  
                  <RadioGroup 
                    value={accountType} 
                    onValueChange={(value: 'buyer' | 'seller') => handleAccountTypeChange(value)}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between p-4 border-2 border-black hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer" className="font-bold text-lg cursor-pointer">Buyer</Label>
                      </div>
                      <div className="text-gray-600 text-sm max-w-[50%]">
                        Browse properties, join waitlists, and get notified about new deals
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border-2 border-black hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller" className="font-bold text-lg cursor-pointer">Seller</Label>
                      </div>
                      <div className="text-gray-600 text-sm max-w-[50%]">
                        List properties, manage waitlists, and communicate with potential buyers
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border-2 border-black">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Notification Preferences</h3>
                        <p className="text-gray-600">Manage how you receive notifications</p>
                      </div>
                      <Button className="neo-button" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border-2 border-black">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Password & Security</h3>
                        <p className="text-gray-600">Update your password and security settings</p>
                      </div>
                      <Button className="neo-button" variant="outline">
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border-2 border-black">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Subscription Plan</h3>
                        <p className="text-gray-600">You are currently on the Free plan</p>
                      </div>
                      <Button className="neo-button-primary">
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6 mt-6">
                <h2 className="text-2xl font-bold mb-6">Account Actions</h2>
                
                <div className="space-y-4">
                  <Button 
                    variant="destructive" 
                    className="w-full justify-center font-bold bg-red-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
              
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                <div className="border-b-4 border-black p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Recent Notifications</h2>
                    <Button 
                      onClick={clearAll}
                      className="neo-button font-bold" 
                      variant="outline"
                    >
                      Mark All as Read
                    </Button>
                  </div>
                </div>
                
                <div className="divide-y-2 divide-gray-200">
                  <div className="p-4 bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">New waitlist request</h3>
                        <p>John Doe has requested to join the waitlist for Modern Townhouse.</p>
                        <p className="text-sm text-gray-500 mt-2">2 hours ago</p>
                      </div>
                      <div className="bg-blue-200 px-2 py-1 text-xs font-bold rounded">NEW</div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">Price update</h3>
                        <p>The market price for Downtown Condo has been updated.</p>
                        <p className="text-sm text-gray-500 mt-2">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">Waitlist status</h3>
                        <p>Your request to join the waitlist for Suburban House has been accepted.</p>
                        <p className="text-sm text-gray-500 mt-2">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
