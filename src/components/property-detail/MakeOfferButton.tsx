
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Check, CreditCard, Upload, AlertCircle } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface MakeOfferButtonProps {
  propertyId: string;
  propertyTitle: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerId: string;
  currentPrice: number;
}

const MakeOfferButton: React.FC<MakeOfferButtonProps> = ({ 
  propertyId, 
  propertyTitle, 
  sellerName,
  sellerEmail,
  sellerPhone,
  sellerId,
  currentPrice 
}) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState(currentPrice);
  const [isInterested, setIsInterested] = useState(true);
  const [proofOfFunds, setProofOfFunds] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  const minimumOfferAmount = Math.max(currentPrice - 5000, 0);

  const handleMakeOffer = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    if (!submitting) {
      setDialogOpen(false);
      
      // Reset form if not in success state
      if (!offerSubmitted) {
        setOfferAmount(currentPrice);
        setIsInterested(true);
        setProofOfFunds(null);
        setOfferError(null);
      }
    }
  };

  const handleOfferAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setOfferAmount(value);
    
    // Validate the offer amount
    if (value < minimumOfferAmount) {
      setOfferError(`Offer cannot be less than $${minimumOfferAmount.toLocaleString()} (listing price minus $5,000)`);
    } else {
      setOfferError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofOfFunds(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to make an offer");
      return;
    }
    
    if (offerAmount <= 0) {
      toast.error("Please enter a valid offer amount");
      return;
    }
    
    // Validate offer amount isn't less than $5,000 below listing price
    if (offerAmount < minimumOfferAmount) {
      setOfferError(`Offer cannot be less than $${minimumOfferAmount.toLocaleString()} (listing price minus $5,000)`);
      toast.error(`Offer must be at least $${minimumOfferAmount.toLocaleString()}`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      let proofOfFundsUrl = null;
      
      // Upload proof of funds if provided
      if (proofOfFunds) {
        const fileName = `proof_of_funds/${propertyId}/${user.id}/${Date.now()}_${proofOfFunds.name}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('property_documents')
          .upload(fileName, proofOfFunds);
          
        if (uploadError) {
          console.error("Error uploading proof of funds:", uploadError);
          throw new Error("Failed to upload proof of funds");
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('property_documents')
          .getPublicUrl(fileName);
          
        proofOfFundsUrl = publicUrl;
      }
      
      // Submit offer to database
      const { error } = await supabase
        .from('property_offers')
        .insert({
          property_id: propertyId,
          user_id: user.id,
          seller_id: sellerId,
          offer_amount: offerAmount,
          is_interested: isInterested,
          proof_of_funds_url: proofOfFundsUrl,
          status: 'pending'
        });
        
      if (error) {
        console.error("Error submitting offer:", error);
        throw new Error("Failed to submit offer");
      }
      
      // Create notification for the seller
      await supabase
        .from('notifications')
        .insert({
          user_id: sellerId,
          title: 'New Offer Received',
          message: `You've received a new offer of $${offerAmount.toLocaleString()} for ${propertyTitle}`,
          type: 'new_offer',
          properties: {
            propertyId,
            propertyTitle,
            offerAmount,
            buyerId: user.id,
            buyerName: user.name || 'Potential Buyer'
          },
          read: false
        });
      
      setOfferSubmitted(true);
      toast.success("Your offer has been submitted successfully!");
    } catch (error) {
      console.error("Error in offer submission:", error);
      toast.error("Failed to submit offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderOfferForm = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Make an Offer</DialogTitle>
        <DialogDescription>
          Submit your offer for {propertyTitle}. The seller will be notified and can accept or decline.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="offerAmount" className="text-black font-bold">Offer Amount ($)</Label>
          <Input 
            id="offerAmount" 
            type="number" 
            value={offerAmount} 
            onChange={handleOfferAmountChange}
            className={`mt-2 border-2 ${offerError ? 'border-red-500' : 'border-black'} focus:ring-0`}
          />
          {offerError && (
            <div className="flex items-center gap-1 text-[#C42924] text-sm mt-1">
              <AlertCircle size={14} />
              <span>{offerError}</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Minimum offer: ${minimumOfferAmount.toLocaleString()} (listing price minus $5,000)
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isInterested" 
            checked={isInterested} 
            onCheckedChange={(checked) => setIsInterested(checked === true)}
          />
          <Label htmlFor="isInterested" className="text-sm font-bold">
            I'm interested in this property and would like to proceed with the transaction
          </Label>
        </div>
        
        <div>
          <Label htmlFor="proofOfFunds" className="text-black font-bold">Proof of Funds (Optional)</Label>
          <div className="mt-2 border-2 border-dashed border-black p-4 rounded-none cursor-pointer hover:bg-gray-50 transition-colors">
            <label htmlFor="proofOfFunds" className="flex flex-col items-center cursor-pointer">
              <Upload className="mb-2" />
              <span className="text-sm font-bold mb-1">
                {proofOfFunds ? proofOfFunds.name : 'Upload Proof of Funds Document'}
              </span>
              <span className="text-xs text-gray-500">
                PDF, JPG, or PNG (Max 10MB)
              </span>
              <input 
                id="proofOfFunds" 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png" 
                onChange={handleFileChange} 
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          <p className="font-bold">Disclaimer:</p>
          <p>Offers are non-binding and can be withdrawn at any time before a formal contract is signed. 
          This is simply an expression of interest and does not constitute a legally binding agreement.</p>
        </div>
      </div>
      
      <DialogFooter className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleDialogClose}
          className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          variant="red"
          className="text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          onClick={handleSubmit}
          disabled={submitting || !!offerError}
        >
          <CreditCard size={18} className="mr-2" />
          {submitting ? "Submitting..." : "Submit Offer"}
        </Button>
      </DialogFooter>
    </>
  );

  const renderSuccessScreen = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-center">Offer Submitted Successfully!</DialogTitle>
      </DialogHeader>
      
      <div className="py-8 text-center">
        <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Check size={24} className="text-[#0d2f72]" />
        </div>
        
        <p className="mb-6">
          Your offer has been sent to the seller. You can either wait for them to respond or contact them directly.
        </p>
        
        <div className="border-2 border-black p-4 text-left mb-6">
          <h3 className="font-bold text-lg mb-2">Seller Contact Information</h3>
          <p className="mb-1"><span className="font-bold">Name:</span> {sellerName}</p>
          {sellerEmail && <p className="mb-1"><span className="font-bold">Email:</span> {sellerEmail}</p>}
          {sellerPhone && <p><span className="font-bold">Phone:</span> {sellerPhone}</p>}
        </div>
        
        <p className="text-sm text-gray-600">
          You can track the status of your offer in your dashboard.
        </p>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="navy"
          className="w-full text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          onClick={handleDialogClose}
        >
          Close
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <>
      <Button 
        variant="navy"
        className="w-full text-white font-bold py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
        onClick={handleMakeOffer}
      >
        <CreditCard size={18} className="mr-2" />
        Make an Offer
      </Button>
      
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          {offerSubmitted ? renderSuccessScreen() : renderOfferForm()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MakeOfferButton;
