
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export interface WaitlistButtonProps {
  propertyId: string;
  status?: string; // Make status optional
  onSuccess?: () => Promise<void>;
}

export const WaitlistButton: React.FC<WaitlistButtonProps> = ({ 
  propertyId, 
  status = 'unknown', // Default value
  onSuccess 
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [requestStatus, setRequestStatus] = useState(status);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.id) {
      setName(user.name || '');
      setEmail(user.email || '');
      
      // Check if user has already requested to join the waitlist
      const checkWaitlistRequest = async () => {
        try {
          const { data, error } = await supabase
            .from('waitlist_requests')
            .select('status')
            .eq('user_id', user.id)
            .eq('property_id', propertyId)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            setHasRequested(true);
            setRequestStatus(data.status);
          }
        } catch (error) {
          console.error('Error checking waitlist status:', error);
        }
      };
      
      checkWaitlistRequest();
    }
  }, [user, propertyId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You need to be logged in to join the waitlist');
      navigate('/signin');
      return;
    }
    
    if (!name || !email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if user already requested to join the waitlist
      const { data: existing, error: checkError } = await supabase
        .from('waitlist_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .maybeSingle();
      
      if (existing) {
        toast.error('You have already requested to join this waitlist');
        setOpen(false);
        setIsSubmitting(false);
        return;
      }
      
      // Create new waitlist request
      const { error } = await supabase
        .from('waitlist_requests')
        .insert([
          {
            user_id: user.id,
            property_id: propertyId,
            name: name,
            email: email,
            phone: phone,
            status: 'pending'
          }
        ]);
      
      if (error) {
        console.error('Error submitting waitlist request:', error);
        toast.error('Failed to join the waitlist');
        return;
      }
      
      toast.success('Your waitlist request has been submitted!');
      setHasRequested(true);
      setRequestStatus('pending');
      setOpen(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error('Error submitting waitlist request:', error);
      toast.error('Failed to join the waitlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (hasRequested) {
      switch (requestStatus) {
        case 'accepted':
          return (
            <>
              <CheckCheck className="mr-2 h-4 w-4" />
              Accepted to Waitlist
            </>
          );
        case 'declined':
          return 'Waitlist Request Declined';
        default:
          return 'Waitlist Request Pending';
      }
    }
    return 'Join Waitlist';
  };
  
  return (
    <>
      <Button 
        variant={hasRequested ? (requestStatus === 'accepted' ? 'default' : 'outline') : 'outline'}
        size="lg"
        className={`w-full ${hasRequested && requestStatus === 'accepted' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        onClick={() => {
          if (hasRequested) {
            toast.info(`Your waitlist request is ${requestStatus}`);
            return;
          }
          
          if (!user) {
            toast.error('You need to be logged in to join the waitlist');
            navigate('/signin');
            return;
          }
          
          setOpen(true);
        }}
        disabled={hasRequested}
      >
        {getButtonText()}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Join Waitlist</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
