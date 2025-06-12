
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Mail, Bell, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import AccountTypeSelector from "./AccountTypeSelector";

interface AccountTabProps {
  user: any;
  logout: () => void;
  accountType: string;
  onUpdateAccountType: (type: string) => void;
}

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const AccountTab: React.FC<AccountTabProps> = ({
  user,
  logout,
  accountType,
  onUpdateAccountType
}) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: ""
  });

  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    marketing: false
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      try {
        const {
          data,
          error
        } = await supabase.from('profiles').select('*').eq('id', user.id).single();
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

          console.log("Retrieved profile data:", data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      id,
      value
    } = e.target;
    setFormData(prev => ({
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
      console.log("Updating profile with data:", {
        id: user.id,
        name: formData.name,
        phone: formData.phone,
        email: user.email
      });
      const {
        error
      } = await supabase.from('profiles').upsert({
        id: user.id,
        name: formData.name,
        phone: formData.phone,
        email: user.email
      }, {
        onConflict: 'id'
      });
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        return;
      }
      toast.success("Profile updated successfully");

      const {
        data: updatedProfile
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      console.log("Profile after update:", updatedProfile);
    } catch (error) {
      console.error("Exception updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    toast.success("Notification preferences updated");
    setNotificationDialogOpen(false);
  };

  const onUpdatePassword = async (data: z.infer<typeof passwordSchema>) => {
    setUpdatingPassword(true);
    try {
      const {
        error
      } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      if (error) {
        console.error("Error updating password:", error);
        toast.error(error.message || "Failed to update password");
        return;
      }
      toast.success("Password updated successfully");
      setPasswordDialogOpen(false);
      passwordForm.reset();
    } catch (error) {
      console.error("Exception updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    try {
      logout();
      navigate('/', { replace: true });
      toast.success("You have been signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return <div className="space-y-6">
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <AccountTypeSelector 
        currentType={accountType}
        userId={user?.id}
        onUpdate={onUpdateAccountType}
      />
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-polysans text-[#01204b]">Account Information</h2>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="font-polysans text-[#01204b]">Full Name</Label>
            <Input id="name" value={formData.name} onChange={handleInputChange} className="mt-2 border-2 border-[#01204b] font-polysans-semibold bg-white" />
          </div>
          
          <div>
            <Label htmlFor="email" className="font-polysans text-[#01204b]">Email Address</Label>
            <Input id="email" value={formData.email} className="mt-2 border-2 border-[#01204b] font-polysans-semibold bg-gray-50" disabled />
          </div>
          
          <div>
            <Label htmlFor="phone" className="font-polysans text-[#01204b]">Phone Number</Label>
            <Input id="phone" value={formData.phone} onChange={handleInputChange} className="mt-2 border-2 border-[#01204b] font-polysans-semibold bg-white" placeholder="Enter your phone number" />
          </div>
        </div>
        
        <div className="relative">
          <button type="submit" disabled={saving} className="bg-white font-polysans text-[#01204b] border-[3px] border-[#fd4801] px-6 py-2 hover:bg-white transition-all relative rounded-md text-xs">
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
    
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-polysans text-[#01204b] mb-6">Account Settings</h2>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg transition-all">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-polysans text-[#01204b] text-lg">Notification Preferences</h3>
              <p className="text-gray-600 font-polysans-semibold">Manage how you receive notifications</p>
            </div>
            <Button className="border border-gray-200 font-polysans hover:bg-gray-50" variant="outline" onClick={() => setNotificationDialogOpen(true)}>
              <Bell size={18} className="mr-2" />
              Manage
            </Button>
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg transition-all">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-polysans text-[#01204b] text-lg">Password & Security</h3>
              <p className="text-gray-600 font-polysans-semibold">Update your password and security settings</p>
            </div>
            <Button className="border border-gray-200 font-polysans hover:bg-gray-50" variant="outline" onClick={() => setPasswordDialogOpen(true)}>
              <Lock size={18} className="mr-2" />
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-polysans text-[#01204b] mb-6">Account Actions</h2>
      
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-center font-polysans bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-500 transition-all" 
          onClick={handleSignOut}
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
    
    <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
      <DialogContent className="bg-white border border-gray-200 rounded-xl">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <Switch checked={notificationPrefs.email} onCheckedChange={checked => setNotificationPrefs(prev => ({
              ...prev,
              email: checked
            }))} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold">Push Notifications</h4>
              <p className="text-sm text-gray-500">Get notified in your browser</p>
            </div>
            <Switch checked={notificationPrefs.push} onCheckedChange={checked => setNotificationPrefs(prev => ({
              ...prev,
              push: checked
            }))} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold">Marketing Emails</h4>
              <p className="text-sm text-gray-500">Receive promotional offers</p>
            </div>
            <Switch checked={notificationPrefs.marketing} onCheckedChange={checked => setNotificationPrefs(prev => ({
              ...prev,
              marketing: checked
            }))} />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setNotificationDialogOpen(false)} className="border border-gray-200">
            Cancel
          </Button>
          <Button onClick={handleNotificationUpdate} className="bg-[#fd4801] text-white hover:bg-[#fd4801] hover:shadow-[0_0_15px_rgba(253,72,1,0.7)] transition-all">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
      <DialogContent className="bg-white border border-gray-200 rounded-xl">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
        </DialogHeader>
        
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4 py-4">
            <FormField control={passwordForm.control} name="currentPassword" render={({
              field
            }) => <FormItem>
                    <FormLabel className="font-bold">Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="border-2 border-[#01204b] bg-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            
            <FormField control={passwordForm.control} name="newPassword" render={({
              field
            }) => <FormItem>
                    <FormLabel className="font-bold">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="border-2 border-[#01204b] bg-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            
            <FormField control={passwordForm.control} name="confirmPassword" render={({
              field
            }) => <FormItem>
                    <FormLabel className="font-bold">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="border-2 border-[#01204b] bg-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)} className="border border-gray-200">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#fd4801] text-white hover:bg-[#fd4801] hover:shadow-[0_0_15px_rgba(253,72,1,0.7)] transition-all" disabled={updatingPassword}>
                {updatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  </div>;
};

export default AccountTab;
