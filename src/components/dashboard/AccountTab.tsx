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
interface AccountTabProps {
  user: any;
  logout: () => void;
}

// Password update form schema
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
  logout
}) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: ""
  });

  // Notification preferences
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    marketing: false
  });

  // Password dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Password form
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

          // Debug log to see what's being retrieved
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
      // Debug log to see what we're sending
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

      // Verify the update was successful
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

  // Handle notification preferences update
  const handleNotificationUpdate = async () => {
    // In a real app, this would save to the database
    // For now, we'll just show a success message
    toast.success("Notification preferences updated");
    setNotificationDialogOpen(false);
  };

  // Handle password update
  const onUpdatePassword = async (data: z.infer<typeof passwordSchema>) => {
    setUpdatingPassword(true);
    try {
      // Update password using Supabase Auth
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
  return <div className="space-y-6">
      <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Account Information</h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="font-bold">Full Name</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} className="mt-2 border border-white/40 focus:border-[#0892D0] focus:shadow-[0_0_10px_rgba(8,146,208,0.5)]" />
            </div>
            
            <div>
              <Label htmlFor="email" className="font-bold">Email Address</Label>
              <Input id="email" value={formData.email} className="mt-2 border border-white/40 bg-gray-50" disabled />
            </div>
            
            <div>
              <Label htmlFor="phone" className="font-bold">Phone Number</Label>
              <Input id="phone" value={formData.phone} onChange={handleInputChange} className="mt-2 border border-white/40 focus:border-[#0892D0] focus:shadow-[0_0_10px_rgba(8,146,208,0.5)]" placeholder="Enter your phone number" />
            </div>
          </div>
          
          <div className="relative">
            <button type="submit" disabled={saving} className="bg-white text-black border border-transparent px-4 py-2 hover:bg-white/90 transition-all relative rounded-md text-xs">
              {saving ? "Saving Changes..." : "Save Changes"}
              <span className="absolute inset-[-2px] -z-10 rounded-lg opacity-100 transition-all" style={{
              background: "transparent",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
              backgroundOrigin: "border-box",
              backgroundClip: "border-box",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude"
            }} />
            </button>
          </div>
        </form>
      </div>
      
      <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-white/40 rounded-lg transition-all">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Notification Preferences</h3>
                <p className="text-gray-600">Manage how you receive notifications</p>
              </div>
              <Button className="border border-white/40 hover:bg-gray-50" variant="outline" onClick={() => setNotificationDialogOpen(true)}>
                <Bell size={18} className="mr-2" />
                Manage
              </Button>
            </div>
          </div>
          
          <div className="p-4 border border-white/40 rounded-lg transition-all">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Password & Security</h3>
                <p className="text-gray-600">Update your password and security settings</p>
              </div>
              <Button className="border border-white/40 hover:bg-gray-50" variant="outline" onClick={() => setPasswordDialogOpen(true)}>
                <Lock size={18} className="mr-2" />
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6">Account Actions</h2>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-center font-bold bg-white/50 hover:bg-red-50 text-red-600 border border-white/40 hover:border-red-500 hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all" onClick={() => {
          logout();
          navigate('/');
        }}>
            <LogOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Notification Preferences Dialog */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="glass-card backdrop-blur-lg border border-white/40 rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch checked={notificationPrefs.email} onCheckedChange={checked => setNotificationPrefs(prev => ({
              ...prev,
              email: checked
            }))} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-gray-500">Get notified in your browser</p>
              </div>
              <Switch checked={notificationPrefs.push} onCheckedChange={checked => setNotificationPrefs(prev => ({
              ...prev,
              push: checked
            }))} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Emails</h4>
                <p className="text-sm text-gray-500">Receive promotional offers</p>
              </div>
              <Switch checked={notificationPrefs.marketing} onCheckedChange={checked => setNotificationPrefs(prev => ({
              ...prev,
              marketing: checked
            }))} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotificationDialogOpen(false)} className="border border-white/40 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)]">
              Cancel
            </Button>
            <Button onClick={handleNotificationUpdate} className="bg-[#0892D0] text-white hover:bg-[#0892D0]/90 hover:shadow-[0_0_15px_rgba(8,146,208,0.7)] transition-all">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Password Update Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="glass-card backdrop-blur-lg border border-white/40 rounded-xl shadow-lg">
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
                      <Input type="password" className="border border-white/40 focus:border-[#0892D0] focus:shadow-[0_0_10px_rgba(8,146,208,0.5)]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={passwordForm.control} name="newPassword" render={({
              field
            }) => <FormItem>
                    <FormLabel className="font-bold">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="border border-white/40 focus:border-[#0892D0] focus:shadow-[0_0_10px_rgba(8,146,208,0.5)]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={passwordForm.control} name="confirmPassword" render={({
              field
            }) => <FormItem>
                    <FormLabel className="font-bold">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="border border-white/40 focus:border-[#0892D0] focus:shadow-[0_0_10px_rgba(8,146,208,0.5)]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)} className="border border-white/40 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)]">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#0892D0] text-white hover:bg-[#0892D0]/90 hover:shadow-[0_0_15px_rgba(8,146,208,0.7)] transition-all" disabled={updatingPassword}>
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