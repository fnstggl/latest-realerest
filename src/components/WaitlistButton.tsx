
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
  refreshProperty?: () => void;
  // New prop to allow customizing input width
  inputWidthClass?: string;
}

const WaitlistButton: React.FC<WaitlistButtonProps> = ({
  propertyId,
  propertyTitle,
  open,
  onOpenChange,
  refreshProperty,
  inputWidthClass, // <-- new prop
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill user info if available
  React.useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("name, email, phone")
          .eq("id", user.id)
          .maybeSingle();
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
        state: { from: `/property/${propertyId}` },
      });
      return;
    }
    if (!name.trim()) {
      toast.error("Please provide your name");
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("waitlist_requests")
        .insert({
          property_id: propertyId,
          user_id: user.id,
          name: name.trim(),
          email: email.trim() || user.email,
          phone: phone.trim(),
          status: "pending",
        })
        .select()
        .single();
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
      const { data: propertyData, error: propertyError } = await supabase
        .from("property_listings")
        .select("user_id")
        .eq("id", propertyId)
        .single();
      if (propertyError) {
        console.error("Error getting property owner:", propertyError);
      } else if (propertyData) {
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
            requesterPhone: phone || "",
          },
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
  }, [
    user,
    name,
    email,
    phone,
    propertyId,
    propertyTitle,
    navigate,
    onOpenChange,
    refreshProperty,
  ]);

  const handleButtonClick = () => {
    if (!user) {
      navigate("/signin", {
        state: { from: `/property/${propertyId}` },
      });
    } else {
      onOpenChange(true);
    }
  };

  // Set default width if not provided (10x longer than label field, nearly full width)
  const fieldInputWidth = inputWidthClass || "col-span-11";

  return (
    <>
      <Button
        variant="glass"
        onClick={handleButtonClick}
        className="w-full bg-white hover:bg-white group relative overflow-hidden"
      >
        {user ? (
          <>
            <UserCheck size={18} className="mr-2 text-black" />
            <span className="text-black font-bold relative z-10">
              Join Waitlist for Full Details
            </span>
          </>
        ) : (
          <>
            <LogIn size={18} className="mr-2 text-black" />
            <span className="text-black font-bold relative z-10">
              Sign in to Join Waitlist
            </span>
          </>
        )}
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
          style={{
            background: "transparent",
            border: "2px solid transparent",
            backgroundImage:
              "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
            backgroundOrigin: "border-box",
            backgroundClip: "border-box",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)",
          }}
        ></span>
      </Button>

      {user && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="bg-white rounded-lg border border-gray-200 shadow-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Join Property Waitlist
              </DialogTitle>
              <DialogDescription>
                Submit your details to join the waitlist for this property. The seller will share more information once approved.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Extra-wide input fields: Label col-span-1, Input col-span-11, for 12 total grid columns */}
              <div className="grid grid-cols-12 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold col-span-1">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`${fieldInputWidth}`}
                />
              </div>

              <div className="grid grid-cols-12 items-center gap-4">
                <Label htmlFor="email" className="text-right font-bold col-span-1">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  className={`${fieldInputWidth}`}
                />
              </div>

              <div className="grid grid-cols-12 items-center gap-4">
                <Label htmlFor="phone" className="text-right font-bold col-span-1">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Optional"
                  className={`${fieldInputWidth}`}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleJoinWaitlist}
                disabled={loading}
                className="bg-black hover:bg-black text-white"
              >
                {loading ? "Submitting..." : "Submit Request"}
                {!loading && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default WaitlistButton;
