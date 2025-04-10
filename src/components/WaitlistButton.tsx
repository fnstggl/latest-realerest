
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardList, X, Check } from 'lucide-react';
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

  // Sync external and internal dialog state
  useEffect(() => {
    if (externalOpen !== undefined) {
      setDialogOpen(externalOpen);
    }
  }, [externalOpen]);

  // Check if user is already in waitlist for this property from database
  const checkWaitlistStatus = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('waitlist_requests')
        .select('status')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
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
      setWaitlistStatus(status);
    };
    
    checkStatus();
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

  // Create notifications for both the property owner and the user joining the waitlist
  const createNotifications = async (propertyOwnerId: string, propertyTitle: string) => {
    try {
      // Notification for property owner
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
      
      // Notification for the user joining the waitlist
      await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          title: 'Waitlist Request Submitted',
          message: `You've successfully joined the waitlist for: ${propertyTitle}`,
          type: 'success',
          properties: {
            propertyId,
            propertyTitle
          },
          read: false
        });
      
      // Add local notification for immediate feedback
      addNotification(
        'Waitlist Request Submitted',
        `You've successfully joined the waitlist for: ${propertyTitle}`,
        'success'
      );
      
      console.log('Notifications created for both parties');
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
      // First, get the property owner's user_id
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
      
      // Add request to waitlist_requests table
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
        // Check if it's a unique constraint violation (user already in waitlist)
        if (insertError.code === '23505') {
          toast.error("You're already on the waitlist for this property");
        } else {
          console.error("Error joining waitlist:", insertError);
          throw new Error("Failed to join waitlist");
        }
      } else {
        // Create notifications for property owner and user
        await createNotifications(propertyOwnerId, propertyTitle);
        
        setWaitlistStatus('pending');
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
            className="w-full bg-[#0d2f72] text-white font-bold py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
            onClick={() => window.location.reload()}
          >
            <Check size={18} className="mr-2" />
            Waitlist Approved - View Details
          </Button>
        );
      case 'declined':
        return (
          <Button 
            className="w-full bg-red-500 text-white font-bold py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center cursor-not-allowed"
            disabled
          >
            <X size={18} className="mr-2" />
            Waitlist Declined
          </Button>
        );
      case 'pending':
        return (
          <Button 
            className="w-full bg-gray-200 text-black font-bold py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center cursor-not-allowed"
            disabled
          >
            <Check size={18} className="mr-2" />
            In Waitlist - Pending Review
          </Button>
        );
      default:
        return (
          <Button 
            className="w-full bg-[#C42924] text-white font-bold py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
            onClick={handleJoinWaitlist}
          >
            <ClipboardList size={18} className="mr-2" />
            Join Waitlist
          </Button>
        );
    }
  };

  return (
    <>
      {getWaitlistButtonContent()}
      
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
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
                className="mt-2 border-2 border-black focus:ring-0"
              />
            </div>
            
            <p className="text-sm text-gray-600">
              Once you join the waitlist, the seller will review your request and may contact you with more information about the property.
            </p>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleDialogClose}
              className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <X size={18} className="mr-2" />
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-[#d60013] hover:bg-[#d60013]/90 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
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
