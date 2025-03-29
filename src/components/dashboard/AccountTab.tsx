
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccountTabProps {
  user: any;
  logout: () => void;
}

const AccountTab: React.FC<AccountTabProps> = ({ user, logout }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Account Information</h2>
        </div>
        
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="font-bold">Full Name</Label>
              <Input
                id="name"
                defaultValue={user?.name || ""}
                className="mt-2 border-2 border-black"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="font-bold">Email Address</Label>
              <Input
                id="email"
                defaultValue={user?.email || ""}
                className="mt-2 border-2 border-black"
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="font-bold">Phone Number</Label>
              <Input
                id="phone"
                defaultValue=""
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
    </div>
  );
};

export default AccountTab;
