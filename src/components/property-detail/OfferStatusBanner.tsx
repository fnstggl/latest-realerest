
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
}

type OfferStatus = 'pending' | 'accepted' | 'declined' | 'countered' | null;

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
  sellerPhone 
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
          
          // Fetch counter offers if they exist
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
              
              // If there are counter offers, set the initial counter amount to the last counter offer
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
    
    // Set up realtime subscriptions for offer and counter offer updates
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
          // Only refresh if this counter offer is related to our offer
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
      // 1. Insert the counter offer record
      const { data: counterOffer, error: counterOfferError } = await supabase
        .from('counter_offers')
        .insert({
          offer_id: offerId,
          amount: counterOfferAmount,
          from_seller: false, // this is from buyer since we're in the property detail page
        })
        .select('*')
        .single();
        
      if (counterOfferError) {
        console.error("Error creating counter offer:", counterOfferError);
        toast.error("Failed to create counter offer");
        return;
      }
      
      // 2. Get the seller ID for the notification
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
      
      // 3. Get property title for the notification
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_listings')
        .select('title')
        .eq('id', propertyId)
        .single();
        
      if (propertyError) {
        console.error("Error getting property details:", propertyError);
      }
      
      const propertyTitle = propertyData?.title || "your property";
      
      // 4. Send notification to the seller
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
      
      // 5. Add the new counter offer to our local state
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
    
    // Sort counter offers by date and get the latest
    const sortedCounterOffers = [...counterOffers].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return sortedCounterOffers[0].amount;
  };

  if (loading || !offerStatus) return null;

  if (offerStatus === 'pending') {
    return (
      <div className="bg-gray-100 border-2 border-black p-4 mb-4">
        <div className="flex items-center">
          <Clock size={20} className="text-gray-700 mr-2" />
          <div className="font-bold">Offer Sent to Seller</div>
        </div>
        <p className="mt-2">
          Your offer of ${offerAmount?.toLocaleString()} is being reviewed by the seller. We'll notify you when there's an update.
        </p>
      </div>
    );
  }

  if (offerStatus === 'declined') {
    return (
      <div className="bg-[#FFE8E8] border-2 border-black p-4 mb-4">
        <div className="flex items-center">
          <XCircle size={20} className="text-[#d0161a] mr-2" />
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
      <div className="bg-[#E8F4FF] border-2 border-black p-4 mb-4">
        <div className="flex items-center">
          <ArrowRightLeft size={20} className="text-[#0d2f72] mr-2" />
          <div className="font-bold">Counter Offer Received</div>
        </div>
        <p className="mt-2">
          The seller has countered your offer. The latest amount is ${getLatestOfferAmount()?.toLocaleString()}.
        </p>
        
        {counterOffers.length > 0 && (
          <div className="mt-4 border-2 border-[#0d2f72] bg-white p-3 mb-4">
            <h3 className="font-bold text-lg mb-2">Negotiation History</h3>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              <div className="flex justify-between items-center p-2 bg-gray-100">
                <div>
                  <strong>Initial Offer:</strong> ${offerAmount?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  You
                </div>
              </div>
              {counterOffers.map((counterOffer, index) => (
                <div 
                  key={counterOffer.id} 
                  className={`flex justify-between items-center p-2 ${counterOffer.from_seller ? 'bg-blue-50' : 'bg-green-50'}`}
                >
                  <div>
                    <strong>${counterOffer.amount.toLocaleString()}</strong>
                  </div>
                  <div className="text-xs text-gray-500">
                    {counterOffer.from_seller ? 'Seller' : 'You'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="navy" 
            className="w-full"
            onClick={() => handleCounterOffer()}
          >
            <ArrowRightLeft size={16} className="mr-2" />
            Counter Offer
          </Button>
        </div>
        
        {/* Counter Offer Dialog */}
        <Dialog open={counterOfferDialogOpen} onOpenChange={setCounterOfferDialogOpen}>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Make Counter Offer</DialogTitle>
              <DialogDescription>
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
                  className="mt-2 border-2 border-black focus:ring-0"
                />
              </div>
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCounterOfferDialogOpen(false)}
                className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="navy"
                className="text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
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
      <div className="bg-[#E8F4FF] border-2 border-black p-4 mb-4">
        <div className="flex items-center">
          <CheckCircle size={20} className="text-[#0d2f72] mr-2" />
          <div className="font-bold">Offer Accepted!</div>
        </div>
        <p className="mt-2">
          Congratulations! Your offer of ${getLatestOfferAmount()?.toLocaleString()} has been accepted by the seller.
        </p>
        
        {!showSuccessDetails ? (
          <Button 
            variant="navy" 
            onClick={() => setShowSuccessDetails(true)}
            className="mt-2 w-full"
          >
            Next Steps <ArrowRight size={16} className="ml-1" />
          </Button>
        ) : (
          <div className="mt-4 p-4 border-2 border-[#0d2f72] bg-white">
            <h3 className="font-bold text-lg mb-2">Next Steps</h3>
            <p className="mb-4">Contact the seller directly to coordinate the next steps in your transaction:</p>
            
            <div className="mb-2"><span className="font-bold">Name:</span> {sellerName}</div>
            {sellerEmail && <div className="mb-2"><span className="font-bold">Email:</span> {sellerEmail}</div>}
            {sellerPhone && <div className="mb-2"><span className="font-bold">Phone:</span> {sellerPhone}</div>}
            
            <ul className="list-disc pl-5 mt-4 space-y-2">
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
