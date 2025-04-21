import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, ArrowRightLeft, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { Link } from "react-router-dom";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getOrCreateConversation, getUserDisplayName } = useMessages();
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
        // Only include offers not withdrawn
        const displayedOffers = propertyOffers.filter(offer => offer.status !== "withdrawn");
        // ... keep code for fetching property details and buyers, assign displayedOffers instead of propertyOffers
        const offersWithDetails = await Promise.all(displayedOffers.map(async offer => {
          const {
            data: property
          } = await supabase.from('property_listings').select('title, price').eq('id', offer.property_id).single();
          console.log(`Property for offer ${offer.id}:`, property);

          let buyerName = 'Unknown User';
          let buyerEmail = null;
          let buyerPhone = null;
          try {
            const {
              data: buyerProfile,
              error: profileError
            } = await supabase.from('profiles').select('name, email, phone').eq('id', offer.user_id).maybeSingle();
            if (profileError) {
              console.error(`Error fetching buyer profile for user ${offer.user_id}:`, profileError);
            }
            if (buyerProfile) {
              console.log(`Buyer profile for ${offer.user_id}:`, buyerProfile);
              buyerEmail = buyerProfile.email;
              buyerPhone = buyerProfile.phone;
              if (buyerProfile.name) {
                buyerName = buyerProfile.name;
              }
            }

            if (buyerName === 'Unknown User') {
              const displayName = await getUserDisplayName(offer.user_id);
              if (displayName && displayName !== 'Unknown User') {
                buyerName = displayName;
                if (!buyerEmail && displayName.includes('@')) {
                  buyerEmail = displayName;
                }
              }
            }
          } catch (error) {
            console.error(`Error processing buyer details for ${offer.user_id}:`, error);
          }

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
            buyerName: buyerName,
            buyerEmail: buyerEmail,
            buyerPhone: buyerPhone,
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
    const channel = supabase.channel('property_offers_changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'property_offers',
      filter: `seller_id=eq.${user?.id}`
    }, payload => {
      console.log("New offer received:", payload);
      fetchOffers();
      toast.success("New Offer Received", {
        description: "You have received a new offer on one of your properties."
      });
    }).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'property_offers',
      filter: `seller_id=eq.${user?.id}`
    }, () => {
      fetchOffers();
    }).subscribe();
    const counterOffersChannel = supabase.channel('counter_offers_changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'counter_offers'
    }, payload => {
      if (payload.new) {
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
  }, [user?.id, getUserDisplayName]);

  const handleOfferAction = async (offerId: string, action: "accepted" | "declined" | "countered") => {
    if (!user?.id) return;
    try {
      const offerToUpdate = offers.find(o => o.id === offerId);
      if (!offerToUpdate) {
        toast.error("Offer not found");
        return;
      }
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
      setOffers(prev => prev.map(offer => offer.id === offerId ? {
        ...offer,
        status: action
      } : offer));
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
    setCounterOfferAmount(offer.offerAmount);
    setCounterOfferDialogOpen(true);
  };

  const submitCounterOffer = async () => {
    if (!selectedOffer || !user?.id) return;
    setSubmitting(true);
    try {
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
    const sortedCounterOffers = [...offer.counterOffers].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sortedCounterOffers[0].amount;
  };

  const handleMessageBuyer = async (offer: Offer) => {
    if (!user?.id) return;
    try {
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
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 mx-6">
        <h2 className="text-xl font-bold mb-6">Loading Offers...</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 p-4 animate-pulse rounded-lg">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mx-6">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-bold">Property Offers</h2>
      </div>
      
      {offers.length > 0 ? (
        <div className="">
          {offers.map(offer => (
            <Card key={offer.id} className="rounded-none border-0 shadow-none hover:bg-gray-50 transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link to={`/property/${offer.propertyId}`} className="text-black hover:text-[#0892D0]">
                        {offer.property.title}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      From: {offer.buyerName} • {new Date(offer.createdAt).toLocaleString()}
                    </p>
                  </div>
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
                  
                  {offer.counterOffers.length > 0 && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50">
                      <h3 className="font-bold text-sm mb-2">Negotiation History</h3>
                      <div className="space-y-2 max-h-36 overflow-y-auto">
                        <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-md">
                          <div>
                            <strong>Initial Offer:</strong> ${offer.offerAmount.toLocaleString()}
                          </div>
                          <div className="text-xs bg-green-100 px-2 py-1 font-bold rounded-md">
                            Buyer
                          </div>
                        </div>
                        {offer.counterOffers.map(counterOffer => (
                          <div 
                            key={counterOffer.id} 
                            className={`flex justify-between items-center p-2 border rounded-md ${
                              counterOffer.from_seller ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <div>
                              <strong>${counterOffer.amount.toLocaleString()}</strong>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded-md ${
                              counterOffer.from_seller ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {counterOffer.from_seller ? 'You (Seller)' : 'Buyer'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {offer.buyerEmail && (
                      <div className="text-sm border border-gray-200 rounded-lg p-2 bg-white">
                        <span className="font-semibold">Email:</span> {offer.buyerEmail}
                      </div>
                    )}
                    
                    {offer.buyerPhone && (
                      <div className="text-sm border border-gray-200 rounded-lg p-2 bg-white">
                        <span className="font-semibold">Phone:</span> {offer.buyerPhone}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {offer.status === "pending" && (
                    <>
                      <Button 
                        onClick={() => handleOfferAction(offer.id, "accepted")} 
                        className="relative font-bold bg-white text-black border border-transparent hover:bg-white/90 transition-all"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Accept
                        <span 
                          className="absolute inset-0 opacity-100 rounded-lg pointer-events-none"
                          style={{
                            background: "transparent",
                            border: "2px solid transparent",
                            backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                            backgroundOrigin: "border-box",
                            backgroundClip: "border-box",
                            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude"
                          }}
                        />
                      </Button>
                      
                      <Button 
                        onClick={() => handleCounterOffer(offer)} 
                        className="font-bold border border-black bg-white hover:bg-black/5 text-black transition-all"
                      >
                        <ArrowRightLeft size={16} className="mr-2" />
                        Counter
                      </Button>
                    </>
                  )}
                  
                  {offer.status === "countered" && !offer.counterOffers[offer.counterOffers.length - 1]?.from_seller && (
                    <>
                      <Button 
                        onClick={() => handleOfferAction(offer.id, "accepted")} 
                        className="relative font-bold bg-white text-black border border-transparent hover:bg-white/90 transition-all"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Accept Counter Offer
                        <span 
                          className="absolute inset-0 opacity-100 rounded-lg pointer-events-none"
                          style={{
                            background: "transparent",
                            border: "2px solid transparent",
                            backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                            backgroundOrigin: "border-box",
                            backgroundClip: "border-box",
                            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude"
                          }}
                        />
                      </Button>
                      
                      <Button 
                        onClick={() => handleCounterOffer(offer)} 
                        className="font-bold border border-black bg-white hover:bg-black/5 text-black transition-all"
                      >
                        <ArrowRightLeft size={16} className="mr-2" />
                        Counter Again
                      </Button>
                    </>
                  )}
                  
                  <Button onClick={() => handleMessageBuyer(offer)} variant="outline" 
                    className="font-bold border border-gray-200 hover:border-[#0892D0] transition-all">
                    <MessageSquare size={16} className="mr-2" />
                    Message Buyer
                  </Button>
                </div>
                
                {offer.status === "accepted" && (
                  <div className="relative bg-white border-2 border-transparent p-3 rounded-lg mt-4">
                    <p className="text-black font-bold">
                      <CheckCircle size={16} className="inline mr-2" />
                      You've accepted this offer. Contact the buyer to proceed with the sale.
                    </p>
                    <span 
                      className="absolute inset-0 opacity-100 rounded-lg pointer-events-none"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "border-box",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude"
                      }}
                    />
                  </div>
                )}
                
                {offer.status === "declined" && (
                  <div className="bg-red-100 border border-red-300 p-3 rounded-lg mt-4">
                    <p className="text-red-800 font-bold">
                      <XCircle size={16} className="inline mr-2" />
                      You've declined this offer.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <Clock size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">No Offers Yet</h3>
          <p className="text-gray-500">You haven't received any offers on your properties yet.</p>
        </div>
      )}
      
      <Dialog open={counterOfferDialogOpen} onOpenChange={setCounterOfferDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Make Counter Offer</DialogTitle>
            <DialogDescription>
              {selectedOffer && <span>Enter your counter offer amount for {selectedOffer.property.title}</span>}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="counterOfferAmount" className="text-black font-bold">Counter Offer Amount ($)</Label>
              <Input 
                id="counterOfferAmount" 
                type="number" 
                value={counterOfferAmount} 
                onChange={e => setCounterOfferAmount(Number(e.target.value))} 
                className="mt-2 border border-gray-200 focus:border-[#0892D0]" 
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCounterOfferDialogOpen(false)} 
              className="font-bold border border-gray-200 hover:border-gray-300 transition-all" 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-black text-white font-bold border border-black hover:bg-gray-900 transition-all" 
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
};

export default OffersTab;
