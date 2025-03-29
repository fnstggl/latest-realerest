
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AccountTabProps {
  user: any;
  logout: () => void;
}

const AccountTab: React.FC<AccountTabProps> = ({ user, logout }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        if (data) {
          setFormData({
            name: user?.name || data.name || "",
            email: user?.email || data.email || "",
            phone: data.phone || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone
        })
        .eq('id', user.id);
        
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        return;
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Exception updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Account Information</h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="font-bold">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 border-2 border-black"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="font-bold">Email Address</Label>
              <Input
                id="email"
                value={formData.email}
                className="mt-2 border-2 border-black"
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="font-bold">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-2 border-2 border-black"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          
          <Button className="neo-button-primary" disabled={saving} type="submit">
            {saving ? "Saving Changes..." : "Save Changes"}
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
