
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, FileText, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

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
  onOfferSubmitted
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [comments, setComments] = useState('');
  const [proofOfFundsFile, setProofOfFundsFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingOffer, setExistingOffer] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id && propertyId) {
      checkExistingOffer();
    }
  }, [user?.id, propertyId]);

  const checkExistingOffer = async () => {
    try {
      const { data, error } = await supabase
        .from('property_offers')
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user?.id)
        .eq('is_interested', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking existing offer:', error);
        return;
      }

      if (data && data.length > 0) {
        setExistingOffer(data[0]);
        setOfferAmount(data[0].offer_amount.toString());
        // Don't populate comments and proof of funds for editing
      }
    } catch (error) {
      console.error('Error in checkExistingOffer:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofOfFundsFile(file);
    }
  };

  const uploadProofOfFunds = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `proof-of-funds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property_documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('property_documents')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadProofOfFunds:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Please log in to make an offer');
      return;
    }

    if (!offerAmount || isNaN(Number(offerAmount))) {
      toast.error('Please enter a valid offer amount');
      return;
    }

    const amount = Number(offerAmount);
    if (amount <= 0) {
      toast.error('Offer amount must be greater than $0');
      return;
    }

    setIsSubmitting(true);

    try {
      let proofOfFundsUrl = null;
      
      if (proofOfFundsFile) {
        proofOfFundsUrl = await uploadProofOfFunds(proofOfFundsFile);
        if (!proofOfFundsUrl) {
          toast.error('Failed to upload proof of funds document');
          setIsSubmitting(false);
          return;
        }
      }

      if (existingOffer) {
        const { error: updateError } = await supabase
          .from('property_offers')
          .update({
            offer_amount: amount,
            proof_of_funds_url: proofOfFundsUrl || existingOffer.proof_of_funds_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingOffer.id);

        if (updateError) {
          console.error('Error updating offer:', updateError);
          throw updateError;
        }

        toast.success('Offer updated successfully!');
      } else {
        const { error: insertError } = await supabase
          .from('property_offers')
          .insert([{
            property_id: propertyId,
            user_id: user.id,
            seller_id: sellerId,
            offer_amount: amount,
            proof_of_funds_url: proofOfFundsUrl,
            is_interested: true,
            status: 'pending'
          }]);

        if (insertError) {
          console.error('Error creating offer:', insertError);
          throw insertError;
        }

        toast.success('Offer submitted successfully!');
      }

      const { data: userData } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', user.id)
        .single();

      await supabase.from('notifications').insert([
        {
          user_id: sellerId,
          title: existingOffer ? 'Offer Updated' : 'New Offer Received',
          message: `${userData?.name || 'A user'} has ${existingOffer ? 'updated their' : 'made an'} offer of ${formatCurrency(amount)} on your property "${propertyTitle}"`,
          type: 'offer',
          properties: {
            propertyId,
            offerAmount: amount,
            buyerName: userData?.name || 'Anonymous'
          }
        }
      ]);

      setIsOpen(false);
      setOfferAmount('');
      setComments('');
      setProofOfFundsFile(null);
      
      if (onOfferSubmitted) {
        onOfferSubmitted();
      }
      
      setTimeout(() => {
        checkExistingOffer();
      }, 1000);

    } catch (error: any) {
      console.error('Error submitting offer:', error);
      toast.error(`Failed to ${existingOffer ? 'update' : 'submit'} offer: ${error.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user?.id) {
    return (
      <Button 
        variant="default" 
        className="w-full bg-[#01204b] hover:bg-[#01204b]/90 text-white font-polysans font-bold rounded-lg"
        onClick={() => toast.error('Please log in to make an offer')}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2"/>
          <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2"/>
        </svg>
        Make an Offer
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="w-full bg-[#01204b] hover:bg-[#01204b]/90 text-white font-polysans font-bold rounded-lg"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2"/>
            <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2"/>
          </svg>
          {existingOffer ? `Update Offer (${formatCurrency(Number(existingOffer.offer_amount))})` : 'Make an Offer'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-polysans font-bold">
            {existingOffer ? 'Update Your Offer' : 'Make an Offer'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offer-amount" className="font-polysans-semibold">Offer Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <Input
                id="offer-amount"
                type="number"
                placeholder="Enter your offer amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="pl-10 font-polysans"
              />
            </div>
            <p className="text-sm text-gray-600 font-polysans">
              Current asking price: {formatCurrency(currentPrice)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="font-polysans-semibold">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any comments about your offer..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="font-polysans"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof-of-funds" className="font-polysans-semibold">
              Proof of Funds (Optional)
              {existingOffer?.proof_of_funds_url && (
                <span className="text-green-600 text-sm ml-2">✓ Previously uploaded</span>
              )}
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="proof-of-funds"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('proof-of-funds')?.click()}
                className="w-full font-polysans"
              >
                <Upload size={16} className="mr-2" />
                {proofOfFundsFile ? proofOfFundsFile.name : 'Choose File'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 font-polysans">
              Upload bank statements, pre-approval letters, or other financial documents
            </p>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full bg-[#01204b] hover:bg-[#01204b]/90 text-white font-polysans font-bold rounded-lg"
          >
            {isSubmitting ? 
              `${existingOffer ? 'Updating' : 'Submitting'} Offer...` : 
              `${existingOffer ? 'Update' : 'Submit'} Offer`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferButton;
