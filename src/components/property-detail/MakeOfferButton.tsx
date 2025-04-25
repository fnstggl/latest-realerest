
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export interface MakeOfferButtonProps {
  propertyId: string;
  propertyTitle?: string;
  propertyPrice?: number;
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
}

export const MakeOfferButton: React.FC<MakeOfferButtonProps> = ({ 
  propertyId,
  propertyTitle = '',
  propertyPrice = 0,
  sellerId = '',
  sellerName = '',
  sellerEmail = '',
  sellerPhone = ''
}) => {
  const [open, setOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to make an offer');
      navigate('/signin');
      return;
    }

    if (!offerAmount) {
      toast.error('Please enter an offer amount');
      return;
    }

    const numAmount = Number(offerAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user already has an active offer on this property
      const { data: existingOffer, error: checkError } = await supabase
        .from('property_offers')
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .single();

      if (existingOffer) {
        toast.error('You already have an active offer on this property');
        setIsSubmitting(false);
        setOpen(false);
        return;
      }

      // Create new offer
      const { data, error } = await supabase
        .from('property_offers')
        .insert([
          {
            property_id: propertyId,
            user_id: user.id,
            seller_id: sellerId,
            offer_amount: numAmount,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error submitting offer:', error);
        toast.error('Failed to submit your offer');
        return;
      }

      toast.success('Your offer has been submitted!');
      setOfferAmount('');
      setOpen(false);

      // Redirect to dashboard offers tab
      navigate('/dashboard', { state: { activeTab: 'offers' } });
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast.error('Failed to submit your offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        className="w-full" 
        size="lg" 
        onClick={() => {
          if (!user) {
            toast.error('You must be logged in to make an offer');
            navigate('/signin');
            return;
          }
          setOpen(true);
        }}
      >
        <CreditCard className="mr-2 w-5 h-5" /> Make an Offer
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Make an Offer</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {propertyTitle && (
                <div>
                  <Label>Property</Label>
                  <div className="mt-1 font-medium">{propertyTitle}</div>
                </div>
              )}
              
              {propertyPrice > 0 && (
                <div>
                  <Label>Listed Price</Label>
                  <div className="mt-1 font-medium">${propertyPrice.toLocaleString()}</div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="offerAmount">Your Offer Amount ($)</Label>
                <Input
                  id="offerAmount"
                  type="number"
                  placeholder="Enter your offer amount"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  required
                  min="1"
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
                {isSubmitting ? 'Submitting...' : 'Submit Offer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MakeOfferButton;
