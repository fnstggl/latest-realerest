import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardList, X, Check, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/context/NotificationContext';

interface WaitlistButtonProps {
  propertyId: string;
  propertyTitle: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const WaitlistButton: React.FC<WaitlistButtonProps> = ({ 
  propertyId, 
  propertyTitle, 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange 
}) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null);

  useEffect(() => {
    if (externalOpen !== undefined) {
      setDialogOpen(externalOpen);
    }
  }, [externalOpen]);

  const checkWaitlistStatus = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('waitlist_requests')
        .select('status')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking waitlist status:", error);
        return null;
      }
      
      return data ? data.status as 'pending' | 'accepted' | 'declined' : null;
    } catch (error) {
      console.error("Exception checking waitlist status:", error);
      return null;
    }
  }, [user?.id, propertyId]);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkWaitlistStatus();
      console.log("Current waitlist status:", status);
      setWaitlistStatus(status);
    };
    
    checkStatus();
    
    // Set up a subscription to listen for waitlist status changes
    const waitlistChannel = supabase
      .channel('waitlist_status_changes')
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'waitlist_requests',
          filter: user?.id ? `user_id=eq.${user.id} AND property_id=eq.${propertyId}` : undefined
        },
        (payload) => {
          console.log("Waitlist status changed:", payload);
          if (payload.new) {
            const newStatus = payload.new.status as 'pending' | 'accepted' | 'declined';
            setWaitlistStatus(newStatus);
            
            if (newStatus === 'accepted') {
              toast.success("Your waitlist request has been approved!");
              // Refresh the page to update UI with seller contact info
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else if (newStatus === 'declined') {
              toast.error("Your waitlist request has been declined.");
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(waitlistChannel);
    };
  }, [user?.id, propertyId, checkWaitlistStatus]);

  const handleJoinWaitlist = () => {
    setDialogOpen(true);
    if (externalOnOpenChange) {
      externalOnOpenChange(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSubmitting(false);
    if (externalOnOpenChange) {
      externalOnOpenChange(false);
    }
  };

  const createNotifications = async (propertyOwnerId: string, propertyTitle: string) => {
    try {
      // Create notification for property owner
      await supabase
        .from('notifications')
        .insert({
          user_id: propertyOwnerId,
          title: 'New Waitlist Request',
          message: `${user?.name || 'Someone'} is interested in your property: ${propertyTitle}`,
          type: 'new_listing',
          properties: {
            propertyId,
            propertyTitle,
            requesterId: user?.id,
            requesterName: user?.name
          },
          read: false
        });
      
      // Only create in-app notification, no toast needed here since we'll show one later
      addNotification(
        'Waitlist Request Submitted',
        `You've successfully joined the waitlist for: ${propertyTitle}`,
        'success'
      );
      
    } catch (error) {
      console.error('Error creating notifications:', error);
    }
  };

  const handleSubmit = async () => {
    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to join the waitlist");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_listings')
        .select('user_id')
        .eq('id', propertyId)
        .single();
      
      if (propertyError) {
        console.error("Error fetching property data:", propertyError);
        throw new Error("Failed to fetch property data");
      }
      
      const propertyOwnerId = propertyData.user_id;
      
      const { error: insertError } = await supabase
        .from('waitlist_requests')
        .insert({
          property_id: propertyId,
          user_id: user.id,
          name: user.name || 'Anonymous User',
          email: user.email || 'No Email',
          phone: phone,
          status: 'pending'
        });
      
      if (insertError) {
        if (insertError.code === '23505') {
          toast.error("You're already on the waitlist for this property");
        } else {
          console.error("Error joining waitlist:", insertError);
          throw new Error("Failed to join waitlist");
        }
      } else {
        // Create notifications only once
        await createNotifications(propertyOwnerId, propertyTitle);
        
        setWaitlistStatus('pending');
        
        // Use only one toast notification
        toast.success("Successfully joined the waitlist!");
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setDialogOpen(false);
      if (externalOnOpenChange) {
        externalOnOpenChange(false);
      }
      setSubmitting(false);
    }
  };

  const getWaitlistButtonContent = () => {
    switch (waitlistStatus) {
      case 'accepted':
        return (
          <Button 
            variant="glass"
            className="w-full text-black font-bold py-2 rounded-xl backdrop-blur-lg border-gradient-br-pink-purple-gold property-card-glow"
            onClick={() => window.location.reload()}
          >
            <Check size={18} className="mr-2" />
            Waitlist Approved - View Details
          </Button>
        );
      case 'declined':
        return (
          <Button 
            variant="glass"
            className="w-full text-black font-bold py-2 rounded-xl backdrop-blur-lg glass-card property-card-glow"
            disabled
          >
            <X size={18} className="mr-2" />
            Waitlist Declined
          </Button>
        );
      case 'pending':
        return (
          <Button 
            className="w-full bg-white/30 backdrop-blur-lg text-black font-bold py-2 rounded-xl glass-card property-card-glow"
            disabled
          >
            <Clock size={18} className="mr-2" />
            In Waitlist - Pending Review
          </Button>
        );
      default:
        return (
          <Button 
            variant="glass"
            className="w-full text-black font-bold py-2 rounded-xl backdrop-blur-lg bg-white hover:bg-white group"
            onClick={handleJoinWaitlist}
          >
            <ClipboardList size={18} className="mr-2" />
            <span className="text-gradient-static relative z-10">Join Waitlist</span>
            
            {/* Rainbow border hover effect - adds a gradient outline only on hover */}
            <span 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
              style={{
                background: "transparent",
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
              }}
            ></span>
          </Button>
        );
    }
  };

  return (
    <>
      {getWaitlistButtonContent()}
      
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="glass-card backdrop-blur-lg border border-white/30 shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Join Property Waitlist</DialogTitle>
            <DialogDescription>
              Please provide your phone number to join the waitlist for this property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="phone" className="text-black font-bold">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="Enter your phone number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 glass-input"
              />
            </div>
            
            <p className="text-sm text-gray-600 glass p-2 rounded-lg backdrop-blur-sm">
              Once you join the waitlist, the seller will review your request and may contact you with more information about the property.
            </p>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleDialogClose}
              className="font-bold glass-card property-card-glow"
            >
              <X size={18} className="mr-2" />
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="glass"
              className="text-black font-bold glass-card property-card-glow"
              onClick={handleSubmit}
              disabled={submitting}
            >
              <Check size={18} className="mr-2" />
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WaitlistButton;
