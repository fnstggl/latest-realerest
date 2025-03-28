import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Home, Settings, Package, ChevronRight, Plus } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const { user, logout, accountType } = useAuth();
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate('/');
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
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>

        <Tabs defaultvalue="account" className="w-full space-y-4">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
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
                <p>No active listings found.</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary">View All Listings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
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
