
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, ArrowRight, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OfferStatusBannerProps {
  propertyId: string;
  sellerName: string;
  sellerEmail: string | null;
  sellerPhone: string | null;
  onOfferWithdrawn?: () => void; // allows parent to refresh when withdrawn
}

type OfferStatus = 'pending' | 'accepted' | 'declined' | 'countered' | null | 'withdrawn';

interface CounterOffer {
  id: string;
  offer_id: string;
  amount: number;
  from_seller: boolean;
  created_at: string;
}

const OfferStatusBanner: React.FC<OfferStatusBannerProps> = ({
  propertyId,
  sellerName,
  sellerEmail,
  sellerPhone,
  onOfferWithdrawn
}) => {
  const { user } = useAuth();
  const [offerStatus, setOfferStatus] = useState<OfferStatus>(null);
  const [offerAmount, setOfferAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessDetails, setShowSuccessDetails] = useState(false);
  const [counterOffers, setCounterOffers] = useState<CounterOffer[]>([]);
  const [offerId, setOfferId] = useState<string | null>(null);
  const [counterOfferDialogOpen, setCounterOfferDialogOpen] = useState(false);
  const [counterOfferAmount, setCounterOfferAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const checkOfferStatus = async () => {
      if (!user?.id || !propertyId) return;

      try {
        const { data, error } = await supabase
          .from('property_offers')
          .select('id, status, offer_amount')
          .eq('property_id', propertyId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error checking offer status:", error);
          return;
        }

        if (data) {
          setOfferStatus(data.status as OfferStatus);
          setOfferAmount(data.offer_amount);
          setOfferId(data.id);

          if (data.id) {
            const { data: counterOfferData, error: counterOfferError } = await supabase
              .from('counter_offers')
              .select('*')
              .eq('offer_id', data.id)
              .order('created_at', { ascending: true });

            if (counterOfferError) {
              console.error("Error fetching counter offers:", counterOfferError);
            } else if (counterOfferData) {
              setCounterOffers(counterOfferData);
              if (counterOfferData.length > 0) {
                const latestOffer = [...counterOfferData].sort(
                  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )[0];
                setCounterOfferAmount(latestOffer.amount);
              } else {
                setCounterOfferAmount(data.offer_amount);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking offer status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOfferStatus();

    const offerChannel = supabase
      .channel('property_offers_changes')
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'property_offers',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          checkOfferStatus();
        }
      )
      .subscribe();

    const counterOfferChannel = supabase
      .channel('counter_offers_changes')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'counter_offers'
        },
        (payload) => {
          if (offerId && payload.new && payload.new.offer_id === offerId) {
            checkOfferStatus();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(offerChannel);
      supabase.removeChannel(counterOfferChannel);
    };
  }, [user?.id, propertyId, offerId]);

  const handleCounterOffer = () => {
    setCounterOfferDialogOpen(true);
  };

  const submitCounterOffer = async () => {
    if (!offerId || !user?.id) return;

    setSubmitting(true);
    try {
      const { data: counterOffer, error: counterOfferError } = await supabase
        .from('counter_offers')
        .insert({
          offer_id: offerId,
          amount: counterOfferAmount,
          from_seller: false
        })
        .select('*')
        .single();

      if (counterOfferError) {
        console.error("Error creating counter offer:", counterOfferError);
        toast.error("Failed to create counter offer");
        return;
      }

      const { data: offerData, error: offerError } = await supabase
        .from('property_offers')
        .select('seller_id, property_id')
        .eq('id', offerId)
        .single();

      if (offerError) {
        console.error("Error getting offer details:", offerError);
        toast.error("Failed to send notification to seller");
        return;
      }

      const { data: propertyData, error: propertyError } = await supabase
        .from('property_listings')
        .select('title')
        .eq('id', propertyId)
        .single();

      if (propertyError) {
        console.error("Error getting property details:", propertyError);
      }

      const propertyTitle = propertyData?.title || "your property";
      await supabase
        .from('notifications')
        .insert({
          user_id: offerData.seller_id,
          title: "Counter Offer Received",
          message: `A buyer has countered with $${counterOfferAmount.toLocaleString()} for ${propertyTitle}.`,
          type: "info",
          properties: {
            propertyId: offerData.property_id,
            propertyTitle: propertyTitle,
            offerId: offerId,
            counterOfferId: counterOffer.id,
            counterOfferAmount: counterOfferAmount
          },
          read: false
        });

      setCounterOffers([...counterOffers, {
        id: counterOffer.id,
        offer_id: offerId,
        amount: counterOfferAmount,
        from_seller: false,
        created_at: new Date().toISOString()
      }]);

      toast.success("Counter offer sent successfully");
      setCounterOfferDialogOpen(false);
    } catch (error) {
      console.error("Error submitting counter offer:", error);
      toast.error("Failed to submit counter offer");
    } finally {
      setSubmitting(false);
    }
  };

  const getLatestOfferAmount = () => {
    if (counterOffers.length === 0) {
      return offerAmount;
    }
    const sortedCounterOffers = [...counterOffers].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sortedCounterOffers[0].amount;
  };

  // Withdraw Offer handler
  const handleWithdrawOffer = async () => {
    if (!offerId || !user?.id || offerStatus !== "pending") return;
    setWithdrawing(true);
    try {
      const { error } = await supabase
        .from('property_offers')
        .update({ status: 'withdrawn' })
        .eq('id', offerId)
        .eq('user_id', user.id);
      if (error) {
        toast.error("Failed to withdraw offer");
        setWithdrawing(false);
        return;
      }
      toast.success("Offer withdrawn successfully");
      setOfferStatus('withdrawn');
      setWithdrawing(false);
      if (onOfferWithdrawn) {
        onOfferWithdrawn();
      }
    } catch (error) {
      toast.error("Error withdrawing offer");
      setWithdrawing(false);
    }
  };

  if (loading || !offerStatus) return null;

  if (offerStatus === 'pending') {
    return (
      <div className="bg-white border border-black p-4 mb-4 rounded-lg relative shadow">
        {/* Withdraw button: small, top right */}
        <button
          onClick={handleWithdrawOffer}
          disabled={withdrawing}
          className="absolute top-2 right-3 text-xs border border-black rounded px-2 py-1 bg-black text-white font-semibold shadow-sm hover:bg-neutral-900 transition-all"
          style={{ opacity: withdrawing ? 0.5 : 1 }}
        >
          {withdrawing ? "Withdrawing..." : "Withdraw Offer"}
        </button>
        <div className="flex items-center">
          <Clock size={20} className="text-black mr-2" />
          <div className="font-bold text-black">Offer Sent to Seller</div>
        </div>
        <p className="mt-2 text-black">
          Your offer of ${offerAmount?.toLocaleString()} is being reviewed by the seller. We'll notify you when there's an update.
        </p>
      </div>
    );
  }

  if (offerStatus === 'declined') {
    return (
      <div className="bg-white border border-black p-4 mb-4 rounded-lg">
        <div className="flex items-center">
          <XCircle size={20} className="text-black mr-2" />
          <div className="font-bold">Offer Declined</div>
        </div>
        <p className="mt-2">
          Unfortunately, your offer of ${offerAmount?.toLocaleString()} was declined by the seller. You may make a new offer if you're still interested.
        </p>
      </div>
    );
  }

  if (offerStatus === 'countered') {
    return (
      <div className="bg-white border border-black p-4 mb-4 rounded-lg">
        <div className="flex items-center">
          <ArrowRightLeft size={20} className="text-black mr-2" />
          <div className="font-bold text-black">Counter Offer Received</div>
        </div>
        <p className="mt-2 text-black">
          The seller has countered your offer. The latest amount is ${getLatestOfferAmount()?.toLocaleString()}.
        </p>

        {counterOffers.length > 0 && (
          <div className="mt-4 border border-black bg-white p-3 mb-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-black">Negotiation History</h3>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              <div className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                <div>
                  <strong>Initial Offer:</strong> ${offerAmount?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  You
                </div>
              </div>
              {counterOffers.map((counterOffer) => (
                <div
                  key={counterOffer.id}
                  className={`flex justify-between items-center p-2 rounded-md ${counterOffer.from_seller ? 'bg-gray-100' : 'bg-gray-200'}`}
                >
                  <div>
                    <strong>${counterOffer.amount.toLocaleString()}</strong>
                  </div>
                  <div className="text-xs text-gray-700">
                    {counterOffer.from_seller ? 'Seller' : 'You'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="bg-white text-black border border-black rounded-lg"
            onClick={() => handleCounterOffer()}
          >
            <ArrowRightLeft size={16} className="mr-2" />
            Counter Offer
          </Button>
        </div>

        <Dialog open={counterOfferDialogOpen} onOpenChange={setCounterOfferDialogOpen}>
          <DialogContent className="bg-white border border-black shadow-sm rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-black">Make Counter Offer</DialogTitle>
              <DialogDescription className="text-black/70">
                Enter your counter offer amount. The seller will be notified.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="counterOfferAmount" className="text-black font-bold">Counter Offer Amount ($)</Label>
                <Input
                  id="counterOfferAmount"
                  type="number"
                  value={counterOfferAmount}
                  onChange={(e) => setCounterOfferAmount(Number(e.target.value))}
                  className="mt-2 border border-black"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCounterOfferDialogOpen(false)}
                className="font-bold border border-black"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-white text-black border border-black rounded-lg"
                onClick={submitCounterOffer}
                disabled={submitting}
              >
                <ArrowRightLeft size={18} className="mr-2" />
                {submitting ? "Sending..." : "Send Counter Offer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (offerStatus === 'accepted') {
    return (
      <div className="bg-white border border-black p-4 mb-4 rounded-lg">
        <div className="flex items-center">
          <CheckCircle size={20} className="text-black mr-2" />
          <div className="font-bold text-black">Offer Accepted!</div>
        </div>
        <p className="mt-2 text-black">
          Congratulations! Your offer of ${getLatestOfferAmount()?.toLocaleString()} has been accepted by the seller.
        </p>

        {!showSuccessDetails ? (
          <Button
            variant="outline"
            onClick={() => setShowSuccessDetails(true)}
            className="mt-2 w-full bg-black text-white border border-black rounded-lg"
          >
            Next Steps <ArrowRight size={16} className="ml-1" />
          </Button>
        ) : (
          <div className="mt-4 p-4 border border-black bg-white rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-black">Next Steps</h3>
            <p className="mb-4 text-black">Contact the seller directly to coordinate the next steps in your transaction:</p>
            <div className="mb-2 text-black"><span className="font-bold">Name:</span> {sellerName}</div>
            {sellerEmail && <div className="mb-2 text-black"><span className="font-bold">Email:</span> {sellerEmail}</div>}
            {sellerPhone && <div className="mb-2 text-black"><span className="font-bold">Phone:</span> {sellerPhone}</div>}
            <ul className="list-disc pl-5 mt-4 space-y-2 text-black">
              <li>Schedule a property inspection</li>
              <li>Discuss payment details and timeline</li>
              <li>Contact your real estate attorney to review documents</li>
              <li>Arrange for closing and property transfer</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default OfferStatusBanner;
