
import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, UserCheck, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNotifications } from "@/context/NotificationContext";

interface WaitlistButtonProps {
  propertyId: string;
  propertyTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshProperty?: () => void;
}

const WaitlistButton: React.FC<WaitlistButtonProps> = ({
  propertyId,
  propertyTitle,
  open,
  onOpenChange,
  refreshProperty
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();
  // Add a ref to track if we've already shown a toast for this session
  const toastShownRef = useRef(false);

  React.useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const { data, error } = await supabase.from("profiles").select("name, email, phone").eq("id", user.id).maybeSingle();
        if (data && !error) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
        } else if (user.email) {
          setEmail(user.email);
        }
      };
      fetchUserProfile();
    }
  }, [user]);

  const handleJoinWaitlist = useCallback(async () => {
    // Reset toast shown ref when actually attempting to join waitlist
    toastShownRef.current = false;
    
    if (!user) {
      navigate("/signin", {
        state: {
          from: `/property/${propertyId}`
        }
      });
      return;
    }
    if (!name.trim()) {
      toast.error("Error Joining Waitlist.", {
        description: "Please provide your name"
      });
      return;
    }
    try {
      setLoading(true);

      const { data, error } = await supabase.from("waitlist_requests").insert({
        property_id: propertyId,
        user_id: user.id,
        name: name.trim(),
        email: email.trim() || user.email,
        phone: phone.trim(),
        status: "pending"
      }).select().single();
      
      if (error) {
        if (error.code === "23505") {
          onOpenChange(false);
          if (refreshProperty) {
            refreshProperty();
          }
          return;
        } else {
          throw error;
        }
      }

      // Create notification for the buyer/user who joined the waitlist
      await addNotification({
        title: "Waitlist Request Submitted",
        message: `You have successfully joined the waitlist for ${propertyTitle}`,
        type: "info",
        properties: {
          propertyId: propertyId
        }
      });

      // Get property owner details and create a notification for them
      const { data: propertyData, error: propertyError } = await supabase
        .from("property_listings")
        .select("user_id, title")
        .eq("id", propertyId)
        .single();
        
      if (propertyError) {
        console.error("Error getting property owner:", propertyError);
      } else if (propertyData) {
        // Create notification for the seller/property owner
        // Note: This is done directly with supabase since addNotification is tied to current user
        await supabase.from("notifications").insert({
          user_id: propertyData.user_id,
          title: "New Waitlist Request",
          message: `${name} has joined the waitlist for your property: ${propertyTitle}`,
          type: "new_listing",
          properties: {
            propertyId: propertyId,
            buyerId: user.id
          }
        });
      }
      
      onOpenChange(false);
      if (refreshProperty) {
        refreshProperty();
      }
      
      // Only show toast if we haven't shown one yet
      if (!toastShownRef.current) {
        toast.success("Waitlist Request Submitted", {
          description: `You've successfully joined the waitlist for ${propertyTitle}`
        });
        toastShownRef.current = true;
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Error Joining Waitlist.", {
        description: "Failed to join waitlist. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }, [user, name, email, phone, propertyId, propertyTitle, navigate, onOpenChange, refreshProperty, addNotification]);

  const handleButtonClick = () => {
    if (!user) {
      navigate("/signin", {
        state: {
          from: `/property/${propertyId}`
        }
      });
    } else {
      onOpenChange(true);
    }
  };

  return <>
      {user ? (
        <Button variant="glass" onClick={handleButtonClick} className="w-full bg-white hover:bg-white group relative overflow-hidden">
          <UserCheck size={18} className="mr-2 text-black" />
          <span className="text-black font-bold relative z-10">
            Join Waitlist for Full Details
          </span>
        
          <span className="absolute inset-0 opacity-100 rounded-lg pointer-events-none" style={{
            background: "transparent",
            border: "2px solid transparent",
            backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
            backgroundOrigin: "border-box",
            backgroundClip: "border-box",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
          }}></span>
        </Button>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="glass" onClick={handleButtonClick} className="w-full bg-white hover:bg-white group relative overflow-hidden">
                <LogIn size={18} className="mr-2 text-black" />
                <span className="text-black font-bold relative z-10">
                  Sign in to Join Waitlist
                </span>
                
                <span className="absolute inset-0 opacity-100 rounded-lg pointer-events-none" style={{
                  background: "transparent",
                  border: "2px solid transparent",
                  backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
                }}></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="p-3 max-w-[300px] text-sm"
            >
              Joining the waitlist shows the seller that you're interested in the property, and it will give you access to see the full property details and will allow you to contact the seller directly so you can move forward with the buying process.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {user && <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="bg-white rounded-lg border border-gray-200 shadow-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Join Property Waitlist
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Let the seller know you're interested. Once accepted from the waitlist, you'll have access to the full property details and can make an offer from there.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold">
                  Name
                </Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="col-span-3 w-full min-w-[calc(1*theme(spacing.64))]" />
              </div>

              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="email" className="text-right font-bold">
                  Email
                </Label>
                <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" type="email" className="col-span-3 w-full min-w-[calc(1*theme(spacing.64))]" />
              </div>

              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="phone" className="text-right font-bold">
                  Phone
                </Label>
                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" className="col-span-3 w-full min-w-[calc(1*theme(spacing.64))]" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleJoinWaitlist} 
                disabled={loading} 
                className="bg-black hover:bg-black text-white font-bold"
              >
                {loading ? "Submitting..." : "Submit Request"}
                {!loading && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>}
    </>;
};

export default WaitlistButton;
