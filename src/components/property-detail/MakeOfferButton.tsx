
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CreditCard, Upload, SquareCheck } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface MakeOfferButtonProps {
  propertyId: string;
  propertyTitle: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerId: string;
  currentPrice: number;
  onOfferSubmitted?: () => void;
}

const MakeOfferButton: React.FC<MakeOfferButtonProps> = ({
  propertyId,
  propertyTitle,
  sellerName,
  sellerEmail,
  sellerPhone,
  sellerId,
  currentPrice,
  onOfferSubmitted,
}) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState(currentPrice);
  const [isInterested, setIsInterested] = useState(true);
  const [proofOfFunds, setProofOfFunds] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  // For showing buyer's name/email in success screen:
  const [buyerProfile, setBuyerProfile] = useState<{ name?: string; email?: string } | null>(null);

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

    // Only validate that the offer amount is positive
    if (value <= 0) {
      setOfferError("Offer amount must be greater than 0");
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
      // Don't show toast, just return
      return;
    }
    if (offerAmount <= 0) {
      // Don't show toast, just set error
      setOfferError("Please enter a valid offer amount");
      return;
    }
    setSubmitting(true);
    try {
      let proofOfFundsUrl = null;

      // Upload proof of funds if provided
      if (proofOfFunds) {
        const fileName = `proof_of_funds/${propertyId}/${user.id}/${Date.now()}_${proofOfFunds.name}`;
        const {
          error: uploadError
        } = await supabase.storage.from('property_documents').upload(fileName, proofOfFunds);
        if (uploadError) {
          console.error("Error uploading proof of funds:", uploadError);
          throw new Error("Failed to upload proof of funds");
        }

        // Get public URL
        const {
          data: {
            publicUrl
          }
        } = supabase.storage.from('property_documents').getPublicUrl(fileName);
        proofOfFundsUrl = publicUrl;
      }

      // Submit offer to database
      const { error } = await supabase.from('property_offers').insert({
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
      await supabase.from('notifications').insert({
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
      // Removed toast notification here

      if (onOfferSubmitted) onOfferSubmitted();
    } catch (error) {
      console.error("Error in offer submission:", error);
      // Removed toast notification here
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Only fetch buyer profile for the success screen
    if (offerSubmitted && user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', user.id)
          .maybeSingle();
        if (data) setBuyerProfile({
          name: data.name || '',
          email: data.email || ''
        });
        else if (error) {
          setBuyerProfile({ name: '', email: user.email });
        }
      };
      fetchProfile();
    } else if (!offerSubmitted) {
      setBuyerProfile(null);
    }
  }, [offerSubmitted, user]);

  const renderOfferForm = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-black">Make an Offer</DialogTitle>
        <DialogDescription className="text-gray-500">
          Submit your offer for {propertyTitle}. The seller will be notified and can accept or decline.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-6">
        <div>
          <Label htmlFor="offerAmount" className="text-black font-bold">Offer Amount ($)</Label>
          <Input
            id="offerAmount"
            type="number"
            value={offerAmount}
            onChange={handleOfferAmountChange}
            className={`mt-2 glass-input ${offerError ? 'border-red-500' : ''}`}
          />
          {offerError && <div className="text-[#ea384c] text-sm mt-1 font-semibold">{offerError}</div>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isInterested"
            checked={isInterested}
            onCheckedChange={checked => setIsInterested(checked === true)}
            className="data-[state=checked]:bg-black data-[state=checked]:text-white border-black focus-visible:ring-black"
          />
          <Label htmlFor="isInterested" className="text-sm font-bold text-black">
            I'm interested in this property and would like to proceed with the transaction
          </Label>
        </div>

        <div>
          <Label htmlFor="proofOfFunds" className="text-black font-bold">Proof of Funds (Optional)</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 bg-white/50 p-4 rounded-xl transition-colors glass">
            <label htmlFor="proofOfFunds" className="flex flex-col items-center cursor-pointer">
              <Upload className="mb-2 text-glass-blue" />
              <span className="text-sm font-semibold mb-1 text-black">
                {proofOfFunds ? proofOfFunds.name : 'Upload Proof of Funds Document'}
              </span>
              <span className="text-xs text-gray-500">
                PDF, JPG, or PNG (Max 10MB)
              </span>
              <input id="proofOfFunds" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2 p-3 rounded-lg border border-gray-200 bg-white/70">
          <p className="font-bold">Disclaimer:</p>
          <p>
            Offers are non-binding and can be withdrawn at any time before a formal contract is signed. 
            This is simply an expression of interest and does not constitute a legally binding agreement.
          </p>
        </div>
      </div>

      <DialogFooter className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleDialogClose}
          className="font-bold border-2 border-black shadow-none rounded-xl hover:bg-gray-50 transition-all"
        >
          Cancel
        </Button>
        {/* Submit offer button: plain black background, white text, no gradient, no gradient border */}
        <button
          type="button"
          className="relative inline-flex items-center justify-center w-auto px-6 py-2 font-bold text-white bg-black rounded-xl focus:outline-none transition-all overflow-visible"
          onClick={handleSubmit}
          disabled={submitting || !!offerError}
          style={{ border: 'none', boxShadow: 'none' }}
        >
          <span className="relative flex items-center gap-2 z-10">
            <CreditCard size={18} className="mr-2" />
            {submitting ? "Submitting..." : "Submit Offer"}
          </span>
        </button>
      </DialogFooter>
    </>
  );

  const renderSuccessScreen = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-black text-center">Offer Submitted Successfully!</DialogTitle>
      </DialogHeader>
      <div className="py-6 text-center rounded-xl mb-6" style={{ background: "#fff" }}>
        <div className="mx-auto w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center mb-4 shadow">
          <SquareCheck size={28} className="text-black" />
        </div>
        <p className="mb-6 text-black font-semibold">
          Your offer has been sent to the seller. You can either wait for them to respond or contact them directly.
        </p>
        <div className="p-4 text-left mb-6 border rounded-lg" style={{ borderColor: "#222" , background: "#fff" }}>
          <h3 className="font-bold text-lg mb-2 text-black">Seller Contact Information</h3>
          <p className="mb-1 text-black">
            <span className="font-bold">Name:</span> {sellerName}
          </p>
          {sellerEmail && (
            <p className="mb-1 text-black">
              <span className="font-bold">Email:</span> {sellerEmail}
            </p>
          )}
          {sellerPhone && (
            <p className="text-black">
              <span className="font-bold">Phone:</span> {sellerPhone}
            </p>
          )}
        </div>
        <div className="p-4 border rounded-lg text-left mb-3" style={{ borderColor: "#222", background: "#fafafa" }}>
          <h3 className="font-bold text-base mb-1 text-black">Your Information Sent:</h3>
          <p className="text-black">
            <span className="font-bold">Name:</span>{" "}
            {(buyerProfile?.name && buyerProfile.name.trim() !== '' ? buyerProfile.name : buyerProfile?.email) || user?.name || user?.email}
          </p>
          <p className="text-black">
            <span className="font-bold">Email:</span>{" "}
            {buyerProfile?.email || user?.email}
          </p>
        </div>
        <p className="text-sm text-black opacity-80 mt-4">
          You can track the status of your offer in your dashboard.
        </p>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="navy"
          className="w-full text-white font-bold bg-black border-2 border-black shadow-none rounded-xl hover:bg-neutral-900 transition-all"
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
        onClick={handleMakeOffer}
        className="w-full font-bold py-2 rounded-xl text-white bg-black border-2 border-black shadow-none transition-all glass hover:bg-black"
        style={{ boxShadow: "none" }}
      >
        <CreditCard size={18} className="mr-2" />
        Make an Offer
      </Button>
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="glass-card border-2 border-black shadow-lg rounded-xl bg-white">
          {offerSubmitted ? renderSuccessScreen() : renderOfferForm()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MakeOfferButton;
