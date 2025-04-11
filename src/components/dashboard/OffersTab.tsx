import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ArrowRightLeft, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
interface CounterOffer {
  id: string;
  offer_id: string;
  amount: number;
  from_seller: boolean;
  created_at: string;
}
interface Offer {
  id: string;
  propertyId: string;
  property: {
    title: string;
    price: number;
  };
  userId: string;
  buyerName: string;
  buyerEmail: any;
  buyerPhone: any;
  offerAmount: number;
  isInterested: boolean;
  proofOfFundsUrl: string;
  status: "pending" | "accepted" | "declined" | "countered";
  createdAt: string;
  counterOffers: CounterOffer[];
}
const OffersTab: React.FC = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    getOrCreateConversation
  } = useMessages();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterOfferDialogOpen, setCounterOfferDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const fetchOffers = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const {
          data: propertyOffers,
          error
        } = await supabase.from('property_offers').select(`
            id,
            property_id,
            user_id,
            offer_amount,
            is_interested,
            proof_of_funds_url,
            status,
            created_at,
            seller_id
          `).eq('seller_id', user.id).order('created_at', {
          ascending: false
        });
        if (error) {
          console.error("Error fetching offers:", error);
          return;
        }

        // For each offer, fetch property details and user profile
        const offersWithDetails = await Promise.all(propertyOffers.map(async offer => {
          // Fetch property details
          const {
            data: property
          } = await supabase.from('property_listings').select('title, price').eq('id', offer.property_id).single();

          // Fetch buyer profile
          const {
            data: buyerProfile
          } = await supabase.from('profiles').select('name, email, phone').eq('id', offer.user_id).single();

          // Fetch counter offers if any
          const {
            data: counterOffers
          } = await supabase.from('counter_offers').select('*').eq('offer_id', offer.id).order('created_at', {
            ascending: true
          });
          return {
            id: offer.id,
            propertyId: offer.property_id,
            property: {
              title: property?.title || 'Unknown Property',
              price: property?.price || 0
            },
            userId: offer.user_id,
            buyerName: buyerProfile?.name || 'Anonymous Buyer',
            buyerEmail: buyerProfile?.email,
            buyerPhone: buyerProfile?.phone,
            offerAmount: offer.offer_amount,
            isInterested: offer.is_interested,
            proofOfFundsUrl: offer.proof_of_funds_url || '',
            status: offer.status as "pending" | "accepted" | "declined" | "countered",
            createdAt: offer.created_at,
            counterOffers: counterOffers || []
          };
        }));
        setOffers(offersWithDetails);
      } catch (error) {
        console.error("Error processing offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();

    // Set up real-time subscription for new offers
    const channel = supabase.channel('property_offers_changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'property_offers',
      filter: `seller_id=eq.${user?.id}`
    }, payload => {
      console.log("New offer received:", payload);
      // Refresh offers when a new one is received
      fetchOffers();

      // Show a notification toast
      toast.success("New Offer Received", {
        description: "You have received a new offer on one of your properties."
      });
    }).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'property_offers',
      filter: `seller_id=eq.${user?.id}`
    }, () => {
      // Refresh offers when one is updated
      fetchOffers();
    }).subscribe();

    // Set up subscription for counter offers
    const counterOffersChannel = supabase.channel('counter_offers_changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'counter_offers'
    }, payload => {
      if (payload.new) {
        // Only refresh if this counter offer is related to one of our offers
        const offerIds = offers.map(o => o.id);
        if (offerIds.includes(payload.new.offer_id)) {
          fetchOffers();
        }
      }
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(counterOffersChannel);
    };
  }, [user?.id]);
  const handleOfferAction = async (offerId: string, action: "accepted" | "declined" | "countered") => {
    if (!user?.id) return;
    try {
      // First, get the offer to access its details
      const offerToUpdate = offers.find(o => o.id === offerId);
      if (!offerToUpdate) {
        toast.error("Offer not found");
        return;
      }

      // Update the offer status
      const {
        error
      } = await supabase.from('property_offers').update({
        status: action
      }).eq('id', offerId);
      if (error) {
        console.error("Error updating offer:", error);
        toast.error("Failed to update offer");
        return;
      }

      // Update local state
      setOffers(prev => prev.map(offer => offer.id === offerId ? {
        ...offer,
        status: action
      } : offer));

      // Create a notification for the buyer
      const notificationTitle = action === "accepted" ? "Offer Accepted!" : action === "declined" ? "Offer Declined" : "Counter Offer Received";
      const notificationMessage = action === "accepted" ? `Your offer of $${offerToUpdate.offerAmount.toLocaleString()} for ${offerToUpdate.property.title} has been accepted.` : action === "declined" ? `Your offer of $${offerToUpdate.offerAmount.toLocaleString()} for ${offerToUpdate.property.title} has been declined.` : `The seller has made a counter offer for ${offerToUpdate.property.title}.`;
      await supabase.from('notifications').insert({
        user_id: offerToUpdate.userId,
        title: notificationTitle,
        message: notificationMessage,
        type: action === "accepted" ? "success" : action === "declined" ? "error" : "info",
        properties: {
          propertyId: offerToUpdate.propertyId,
          offerId: offerId
        }
      });

      // Show success message
      toast.success(`Offer ${action}`, {
        description: `The offer has been marked as ${action}.`
      });
    } catch (error) {
      console.error("Error processing offer action:", error);
      toast.error("An error occurred while processing the offer");
    }
  };
  const handleCounterOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setCounterOfferAmount(offer.offerAmount); // Start with the current offer amount
    setCounterOfferDialogOpen(true);
  };
  const submitCounterOffer = async () => {
    if (!selectedOffer || !user?.id) return;
    setSubmitting(true);
    try {
      // 1. Insert the counter offer
      const {
        data: counterOffer,
        error: counterOfferError
      } = await supabase.from('counter_offers').insert({
        offer_id: selectedOffer.id,
        amount: counterOfferAmount,
        from_seller: true
      }).select('*').single();
      if (counterOfferError) {
        console.error("Error creating counter offer:", counterOfferError);
        toast.error("Failed to create counter offer");
        return;
      }

      // 2. Update the offer status to "countered"
      const {
        error: offerUpdateError
      } = await supabase.from('property_offers').update({
        status: 'countered'
      }).eq('id', selectedOffer.id);
      if (offerUpdateError) {
        console.error("Error updating offer status:", offerUpdateError);
        toast.error("Failed to update offer status");
        return;
      }

      // 3. Create a notification for the buyer
      await supabase.from('notifications').insert({
        user_id: selectedOffer.userId,
        title: "Counter Offer Received",
        message: `The seller has countered with $${counterOfferAmount.toLocaleString()} for ${selectedOffer.property.title}.`,
        type: "info",
        properties: {
          propertyId: selectedOffer.propertyId,
          offerId: selectedOffer.id,
          counterOfferId: counterOffer.id,
          counterOfferAmount: counterOfferAmount
        }
      });

      // 4. Update local state
      setOffers(prev => prev.map(offer => offer.id === selectedOffer.id ? {
        ...offer,
        status: 'countered',
        counterOffers: [...offer.counterOffers, counterOffer]
      } : offer));
      toast.success("Counter offer sent successfully");
      setCounterOfferDialogOpen(false);
    } catch (error) {
      console.error("Error submitting counter offer:", error);
      toast.error("Failed to submit counter offer");
    } finally {
      setSubmitting(false);
    }
  };
  const getLatestOfferAmount = (offer: Offer) => {
    if (offer.counterOffers.length === 0) {
      return offer.offerAmount;
    }

    // Sort counter offers by date and get the latest
    const sortedCounterOffers = [...offer.counterOffers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return sortedCounterOffers[0].amount;
  };
  const handleMessageBuyer = async (offer: Offer) => {
    if (!user?.id) return;
    try {
      // Get or create a conversation with this buyer
      const conversationId = await getOrCreateConversation(offer.userId);
      if (conversationId) {
        navigate(`/messages/${conversationId}`);
      } else {
        toast.error("Could not create conversation");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation");
    }
  };
  if (loading) {
    return <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-8">
        <h2 className="text-xl font-bold mb-6">Loading Offers...</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="border-2 border-gray-200 p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>)}
        </div>
      </div>;
  }
  return <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
      <div className="border-b-4 border-black p-4 bg-gray-50">
        <h2 className="text-xl font-bold">Property Offers</h2>
      </div>
      
      {offers.length > 0 ? <div className="divide-y-2 divide-gray-200">
          {offers.map(offer => <Card key={offer.id} className="rounded-none border-0 shadow-none">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{offer.property.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      From: {offer.buyerName} • {new Date(offer.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <Badge className={offer.status === "pending" ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300 font-bold" : offer.status === "accepted" ? "bg-green-100 text-green-800 border-2 border-green-300 font-bold" : offer.status === "declined" ? "bg-red-100 text-red-800 border-2 border-red-300 font-bold" : "bg-blue-100 text-blue-800 border-2 border-blue-300 font-bold"}>
                    {offer.status === "pending" ? "Pending" : offer.status === "accepted" ? "Accepted" : offer.status === "declined" ? "Declined" : "Countered"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Property Asking Price:</span>
                    <span className="font-bold">${offer.property.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span>{offer.counterOffers.length > 0 ? "Latest Offer Amount:" : "Offer Amount:"}</span>
                    <span className="font-bold">${getLatestOfferAmount(offer).toLocaleString()}</span>
                  </div>
                  
                  {offer.counterOffers.length > 0 && <div className="mt-4 border-2 border-black p-3 mb-4 bg-gray-50">
                      <h3 className="font-bold text-sm mb-2">Negotiation History</h3>
                      <div className="space-y-2 max-h-36 overflow-y-auto">
                        <div className="flex justify-between items-center p-2 bg-gray-100 border border-gray-300">
                          <div>
                            <strong>Initial Offer:</strong> ${offer.offerAmount.toLocaleString()}
                          </div>
                          <div className="text-xs bg-green-100 px-2 py-1 font-bold">
                            Buyer
                          </div>
                        </div>
                        {offer.counterOffers.map(counterOffer => <div key={counterOffer.id} className={`flex justify-between items-center p-2 border ${counterOffer.from_seller ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                            <div>
                              <strong>${counterOffer.amount.toLocaleString()}</strong>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 ${counterOffer.from_seller ? 'bg-blue-100' : 'bg-green-100'}`}>
                              {counterOffer.from_seller ? 'You (Seller)' : 'Buyer'}
                            </div>
                          </div>)}
                      </div>
                    </div>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {offer.buyerEmail && <div className="text-sm border-2 border-black p-2 bg-gray-50">
                        <span className="font-semibold">Email:</span> {offer.buyerEmail}
                      </div>}
                    
                    {offer.buyerPhone && <div className="text-sm border-2 border-black p-2 bg-gray-50">
                        <span className="font-semibold">Phone:</span> {offer.buyerPhone}
                      </div>}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {offer.status === "pending" && <>
                      <Button onClick={() => handleOfferAction(offer.id, "accepted")} className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-donedeal-red">
                        <CheckCircle size={16} className="mr-2" />
                        Accept
                      </Button>
                      
                      <Button onClick={() => handleCounterOffer(offer)} className="bg-blue-600 hover:bg-blue-700 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-white">
                        <ArrowRightLeft size={16} className="mr-2" />
                        Counter
                      </Button>
                      
                      <Button onClick={() => handleOfferAction(offer.id, "declined")} variant="destructive" className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <XCircle size={16} className="mr-2" />
                        Decline
                      </Button>
                    </>}
                  
                  {offer.status === "countered" && !offer.counterOffers[offer.counterOffers.length - 1]?.from_seller && <>
                      <Button onClick={() => handleOfferAction(offer.id, "accepted")} className="bg-green-600 hover:bg-green-700 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <CheckCircle size={16} className="mr-2" />
                        Accept Counter Offer
                      </Button>
                      
                      <Button onClick={() => handleCounterOffer(offer)} className="bg-blue-600 hover:bg-blue-700 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-white">
                        <ArrowRightLeft size={16} className="mr-2" />
                        Counter Again
                      </Button>
                      
                      <Button onClick={() => handleOfferAction(offer.id, "declined")} variant="destructive" className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <XCircle size={16} className="mr-2" />
                        Decline
                      </Button>
                    </>}
                  
                  <Button onClick={() => handleMessageBuyer(offer)} variant="outline" className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <MessageSquare size={16} className="mr-2" />
                    Message Buyer
                  </Button>
                </div>
                
                {offer.status === "accepted" && <div className="bg-green-100 border-2 border-green-300 p-3 rounded mt-4">
                    <p className="text-green-800 font-bold">
                      <CheckCircle size={16} className="inline mr-2" />
                      You've accepted this offer. Contact the buyer to proceed with the sale.
                    </p>
                  </div>}
                
                {offer.status === "declined" && <div className="bg-red-100 border-2 border-red-300 p-3 rounded mt-4">
                    <p className="text-red-800 font-bold">
                      <XCircle size={16} className="inline mr-2" />
                      You've declined this offer.
                    </p>
                  </div>}
              </CardContent>
            </Card>)}
        </div> : <div className="p-12 text-center">
          <Clock size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">No Offers Yet</h3>
          <p className="text-gray-500">You haven't received any offers on your properties yet.</p>
        </div>}
      
      {/* Counter Offer Dialog */}
      <Dialog open={counterOfferDialogOpen} onOpenChange={setCounterOfferDialogOpen}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Make Counter Offer</DialogTitle>
            <DialogDescription>
              {selectedOffer && <span>Enter your counter offer amount for {selectedOffer.property.title}</span>}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="counterOfferAmount" className="text-black font-bold">Counter Offer Amount ($)</Label>
              <Input id="counterOfferAmount" type="number" value={counterOfferAmount} onChange={e => setCounterOfferAmount(Number(e.target.value))} className="mt-2 border-2 border-black focus:ring-0" />
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setCounterOfferDialogOpen(false)} className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" className="bg-[#0d2f72] text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" onClick={submitCounterOffer} disabled={submitting}>
              <ArrowRightLeft size={18} className="mr-2" />
              {submitting ? "Sending..." : "Send Counter Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default OffersTab;