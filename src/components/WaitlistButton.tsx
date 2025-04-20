
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, UserCheck, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
interface WaitlistButtonProps {
  propertyId: string;
  propertyTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshProperty?: () => void; // <-- added
}
const WaitlistButton: React.FC<WaitlistButtonProps> = ({
  propertyId,
  propertyTitle,
  open,
  onOpenChange,
  refreshProperty
}) => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill user info if available
  React.useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const {
          data,
          error
        } = await supabase.from("profiles").select("name, email, phone").eq("id", user.id).maybeSingle();
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
    if (!user) {
      navigate("/signin", {
        state: {
          from: `/property/${propertyId}`
        }
      });
      return;
    }
    if (!name.trim()) {
      toast.error("Please provide your name");
      return;
    }
    try {
      setLoading(true);

      // 1. Add to waitlist_requests table
      const {
        data,
        error
      } = await supabase.from("waitlist_requests").insert({
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

      // 2. Get the property owner's ID
      const {
        data: propertyData,
        error: propertyError
      } = await supabase.from("property_listings").select("user_id").eq("id", propertyId).single();
      if (propertyError) {
        console.error("Error getting property owner:", propertyError);
      } else if (propertyData) {
        // 3. Add notification for property owner
        await supabase.from("notifications").insert({
          user_id: propertyData.user_id,
          title: "New Waitlist Request",
          message: `${name} has joined the waitlist for ${propertyTitle}`,
          type: "new_listing",
          properties: {
            waitlistRequestId: data?.id,
            propertyId,
            propertyTitle,
            requesterName: name,
            requesterEmail: email || user.email,
            requesterPhone: phone || ""
          }
        });
      }
      onOpenChange(false);
      if (refreshProperty) {
        refreshProperty();
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, name, email, phone, propertyId, propertyTitle, navigate, onOpenChange, refreshProperty]);
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
      <Button variant="glass" onClick={handleButtonClick} className="w-full bg-white hover:bg-white group relative overflow-hidden">
        {user ? <>
            <UserCheck size={18} className="mr-2 text-black" />
            <span className="text-black font-bold relative z-10">
              Join Waitlist for Full Details
            </span>
          </> : <>
            <LogIn size={18} className="mr-2 text-black" />
            <span className="text-black font-bold relative z-10">
              Sign in to Join Waitlist
            </span>
          </>}

        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" style={{
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

      {user && <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="bg-white rounded-lg border border-gray-200 shadow-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Join Property Waitlist
              </DialogTitle>
              <DialogDescription>
                Submit your details to join the waitlist for this property. The
                seller will share more information once approved.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Updated input length by making inputs approximately 2.5x longer than before */}
              <div className="grid grid-cols-10 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold">
                  Name
                </Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="col-span-9" />
              </div>

              <div className="grid grid-cols-10 items-center gap-4">
                <Label htmlFor="email" className="text-right font-bold">
                  Email
                </Label>
                <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" type="email" className="col-span-9" />
              </div>

              <div className="grid grid-cols-10 items-center gap-4">
                <Label htmlFor="phone" className="text-right font-bold">
                  Phone
                </Label>
                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" className="col-span-9" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoinWaitlist} disabled={loading} className="bg-black hover:bg-black text-white">
                {loading ? "Submitting..." : "Submit Request"}
                {!loading && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>}
    </>;
};
export default WaitlistButton;
