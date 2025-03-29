
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardList, X, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface WaitlistButtonProps {
  propertyId: string;
  propertyTitle: string;
}

const WaitlistButton: React.FC<WaitlistButtonProps> = ({ propertyId, propertyTitle }) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isInWaitlist, setIsInWaitlist] = useState(false);

  // Check if user is already in waitlist for this property
  const checkWaitlistStatus = useCallback(() => {
    if (!user?.id) return false;
    
    try {
      const waitlistDataJSON = localStorage.getItem('waitlistData');
      if (!waitlistDataJSON) return false;
      
      const waitlistData = JSON.parse(waitlistDataJSON);
      return waitlistData.some(
        (entry: any) => entry.id === user.id && entry.propertyId === propertyId
      );
    } catch (error) {
      console.error("Error checking waitlist status:", error);
      return false;
    }
  }, [user?.id, propertyId]);

  useEffect(() => {
    setIsInWaitlist(checkWaitlistStatus());
  }, [user?.id, propertyId, checkWaitlistStatus]);

  const handleJoinWaitlist = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSubmitting(false);
  };

  const handleSubmit = () => {
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
      // Get existing waitlist data
      let waitlistData: any[] = [];
      const waitlistDataJSON = localStorage.getItem('waitlistData');
      
      if (waitlistDataJSON) {
        waitlistData = JSON.parse(waitlistDataJSON);
      }
      
      // Add new entry
      const newEntry = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: phone,
        propertyId: propertyId,
        propertyTitle: propertyTitle,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      // Save back to localStorage
      localStorage.setItem('waitlistData', JSON.stringify([...waitlistData, newEntry]));
      
      setIsInWaitlist(true);
      setDialogOpen(false);
      toast.success("Successfully joined the waitlist!");
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isInWaitlist ? (
        <Button 
          className="w-full bg-gray-200 text-black font-bold py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center cursor-not-allowed"
          disabled
        >
          <Check size={18} className="mr-2" />
          In Waitlist
        </Button>
      ) : (
        <Button 
          className="w-full bg-[#d60013] text-white font-bold py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
          onClick={handleJoinWaitlist}
        >
          <ClipboardList size={18} className="mr-2" />
          Join Waitlist
        </Button>
      )}
      
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
