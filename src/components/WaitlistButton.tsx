
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

interface WaitlistButtonProps {
  propertyId: string;
  propertyTitle: string;
}

const WaitlistButton: React.FC<WaitlistButtonProps> = ({ propertyId, propertyTitle }) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to join waitlist
    try {
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success!
      toast({
        title: "Joined Waitlist!",
        description: `You've successfully joined the waitlist for ${propertyTitle}. The seller will contact you soon.`,
      });
      
      setDialogOpen(false);
      setPhone("");
    } catch (error) {
      toast({
        title: "Failed to join waitlist",
        description: "There was an error joining the waitlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4 neo-button-primary">Join Waitlist</Button>
      </DialogTrigger>
      <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join Property Waitlist</DialogTitle>
          <DialogDescription className="text-black font-medium">
            Enter your phone number to join the waitlist for this property.
            The seller will contact you when the property becomes available.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-bold">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="neo-input"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit"
              disabled={isLoading}
              className="neo-button-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistButton;
