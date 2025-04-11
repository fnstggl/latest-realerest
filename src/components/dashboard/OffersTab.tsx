
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, FileText, Check, X, CreditCard, ArrowRightLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Offer {
  id: string;
  propertyId: string;
  property?: {
    title: string;
    price: number;
  };
  userId: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  offerAmount: number;
  isInterested: boolean;
  proofOfFundsUrl: string | null;
  status: "pending" | "accepted" | "declined" | "countered";
  createdAt: string;
  counterOffers?: CounterOffer[];
}

interface CounterOffer {
  id: string;
  offerId: string;
  amount: number;
  fromSeller: boolean;
  created_at: string;
}

const OffersTab: React.FC = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [counterOfferDialogOpen, setCounterOfferDialogOpen] = useState(false);
  const [counterOfferAmount, setCounterOfferAmount] = useState<number>(0);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchOffers = async () => {
      setLoading(true);
      try {
        // Get all offers for properties owned by this seller
        const { data, error } = await supabase
          .from('property_offers')
          .select(`
            id,
            property_id,
            user_id,
            offer_amount,
            is_interested,
            proof_of_funds_url,
            status,
            created_at,
            property_listings(title, price)
          `)
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching offers:", error);
          toast.error("Failed to load offers");
          return;
        }
        
        // Transform the data
        const transformedOffers: Offer[] = await Promise.all((data || []).map(async (offer) => {
          // Get buyer information
          let buyerName = "Anonymous Buyer";
          let buyerEmail = null;
          let buyerPhone = null;
          
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, email, phone')
              .eq('id', offer.user_id)
              .maybeSingle();
              
            if (profileData) {
              buyerName = profileData.name || "Anonymous Buyer";
              buyerEmail = profileData.email;
              buyerPhone = profileData.phone;
            } else {
              // Fallback to get email directly if no profile
              const { data: emailData } = await supabase
                .rpc('get_user_email', { user_id_param: offer.user_id }) as { data: string | null, error: any };
                
              if (emailData) {
                buyerEmail = emailData;
              }
            }
          } catch (error) {
            console.error("Error fetching buyer information:", error);
          }
          
          // Fetch counter offers for this offer
          const { data: counterOffers } = await supabase
            .from('counter_offers')
            .select('*')
            .eq('offer_id', offer.id)
            .order('created_at', { ascending: true });
          
          return {
            id: offer.id,
            propertyId: offer.property_id,
            property: offer.property_listings ? {
              title: offer.property_listings.title,
              price: Number(offer.property_listings.price)
            } : undefined,
            userId: offer.user_id,
            buyerName,
            buyerEmail,
            buyerPhone,
            offerAmount: Number(offer.offer_amount),
            isInterested: offer.is_interested,
            proofOfFundsUrl: offer.proof_of_funds_url,
            status: offer.status as "pending" | "accepted" | "declined" | "countered",
            createdAt: offer.created_at,
            counterOffers: counterOffers || []
          };
        }));
        
        setOffers(transformedOffers);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOffers();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('public:property_offers')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'property_offers',
          filter: `seller_id=eq.${user.id}`
        },
        () => {
          fetchOffers();
        }
      )
      .subscribe();
      
    // Set up a subscription for counter offers
    const counterOffersChannel = supabase
      .channel('public:counter_offers')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'counter_offers'
        },
        () => {
          fetchOffers();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(counterOffersChannel);
    };
  }, [user?.id]);

  const handleViewOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferDialogOpen(true);
  };

  const handleUpdateOfferStatus = async (offerId: string, newStatus: "accepted" | "declined") => {
    if (updatingStatus) return;
    
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('property_offers')
        .update({ status: newStatus })
        .eq('id', offerId);
        
      if (error) {
        console.error("Error updating offer status:", error);
        toast.error("Failed to update offer status");
        return;
      }
      
      // Update the local state
      setOffers(offers.map(offer => 
        offer.id === offerId ? { ...offer, status: newStatus } : offer
      ));
      
      // If there's a selected offer open in the dialog, update it too
      if (selectedOffer && selectedOffer.id === offerId) {
        setSelectedOffer({ ...selectedOffer, status: newStatus });
      }
      
      // Send notification to the buyer
      if (selectedOffer) {
        await supabase
          .from('notifications')
          .insert({
            user_id: selectedOffer.userId,
            title: newStatus === "accepted" ? "Offer Accepted!" : "Offer Declined",
            message: newStatus === "accepted" 
              ? `Great news! Your offer for ${selectedOffer.property?.title} has been accepted.` 
              : `Your offer for ${selectedOffer.property?.title} has been declined.`,
            type: newStatus === "accepted" ? "success" : "error",
            properties: {
              propertyId: selectedOffer.propertyId,
              propertyTitle: selectedOffer.property?.title,
              status: newStatus
            },
            read: false
          });
      }
      
      toast.success(`Offer ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating offer status:", error);
      toast.error("Failed to update offer status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCounterOffer = (offer: Offer) => {
    setActiveOfferId(offer.id);
    setCounterOfferAmount(offer.offerAmount); // Start with the current offer amount
    setCounterOfferDialogOpen(true);
  };

  const submitCounterOffer = async () => {
    if (!activeOfferId) return;
    
    setUpdatingStatus(true);
    try {
      // Get the offer we're countering
      const offer = offers.find(o => o.id === activeOfferId);
      if (!offer) {
        toast.error("Offer not found");
        return;
      }

      // 1. Insert the counter offer record
      const { data: counterOffer, error: counterOfferError } = await supabase
        .from('counter_offers')
        .insert({
          offer_id: activeOfferId,
          amount: counterOfferAmount,
          from_seller: true, // this is from seller since we're in the seller dashboard
        })
        .select('*')
        .single();
        
      if (counterOfferError) {
        console.error("Error creating counter offer:", counterOfferError);
        toast.error("Failed to create counter offer");
        return;
      }
      
      // 2. Update the offer status to countered
      const { error: updateError } = await supabase
        .from('property_offers')
        .update({ status: 'countered' })
        .eq('id', activeOfferId);
        
      if (updateError) {
        console.error("Error updating offer status:", updateError);
        toast.error("Failed to update offer status");
        return;
      }
      
      // 3. Send notification to the buyer
      await supabase
        .from('notifications')
        .insert({
          user_id: offer.userId,
          title: "Counter Offer Received",
          message: `The seller has countered your offer for ${offer.property?.title} with $${counterOfferAmount.toLocaleString()}.`,
          type: "info",
          properties: {
            propertyId: offer.propertyId,
            propertyTitle: offer.property?.title,
            offerId: offer.id,
            counterOfferId: counterOffer.id,
            counterOfferAmount: counterOfferAmount
          },
          read: false
        });
      
      // Update the local state
      setOffers(offers.map(o => {
        if (o.id === activeOfferId) {
          const newCounterOffers = [...(o.counterOffers || []), {
            id: counterOffer.id,
            offerId: activeOfferId,
            amount: counterOfferAmount,
            fromSeller: true,
            created_at: new Date().toISOString()
          }];
          
          return { 
            ...o, 
            status: 'countered',
            counterOffers: newCounterOffers
          };
        }
        return o;
      }));
      
      // Update selected offer if it's open
      if (selectedOffer && selectedOffer.id === activeOfferId) {
        const newCounterOffers = [...(selectedOffer.counterOffers || []), {
          id: counterOffer.id,
          offerId: activeOfferId,
          amount: counterOfferAmount,
          fromSeller: true,
          created_at: new Date().toISOString()
        }];
        
        setSelectedOffer({
          ...selectedOffer,
          status: 'countered',
          counterOffers: newCounterOffers
        });
      }
      
      toast.success("Counter offer sent successfully");
      setCounterOfferDialogOpen(false);
    } catch (error) {
      console.error("Error submitting counter offer:", error);
      toast.error("Failed to submit counter offer");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="px-2 py-1 bg-green-100 text-green-800 font-bold">ACCEPTED</span>;
      case 'declined':
        return <span className="px-2 py-1 bg-red-100 text-red-800 font-bold">DECLINED</span>;
      case 'countered':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 font-bold">COUNTERED</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 font-bold">PENDING</span>;
    }
  };

  const getOfferPercentage = (offerAmount: number, listingPrice: number) => {
    if (!listingPrice) return 0;
    const percentage = ((offerAmount - listingPrice) / listingPrice) * 100;
    return Math.round(percentage);
  };

  const getLatestOfferAmount = (offer: Offer) => {
    if (!offer.counterOffers || offer.counterOffers.length === 0) {
      return offer.offerAmount;
    }
    
    // Sort counter offers by date and get the latest
    const sortedCounterOffers = [...offer.counterOffers].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return sortedCounterOffers[0].amount;
  };

  return (
    <>
      {loading ? (
        <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-6">Loading offers...</p>
        </div>
      ) : offers.length > 0 ? (
        <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
          <div className="border-b-4 border-black p-4 bg-gray-50">
            <h2 className="text-xl font-bold">Property Offers</h2>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b-4 border-black">
                <th className="text-left p-4 font-bold">Property</th>
                <th className="text-left p-4 font-bold">Buyer</th>
                <th className="text-left p-4 font-bold">Offer</th>
                <th className="text-left p-4 font-bold">Status</th>
                <th className="text-left p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b-2 border-gray-200">
                  <td className="p-4 font-bold">
                    {offer.property?.title || "Unknown Property"}
                  </td>
                  <td className="p-4">
                    <div>{offer.buyerName}</div>
                    <div className="text-sm text-gray-500">{new Date(offer.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">${getLatestOfferAmount(offer).toLocaleString()}</div>
                    {offer.property?.price && (
                      <div className={`text-sm ${getOfferPercentage(getLatestOfferAmount(offer), offer.property.price) >= 0 ? 'text-[#d0161a]' : 'text-[#0d2f72]'}`}>
                        {getOfferPercentage(getLatestOfferAmount(offer), offer.property.price) >= 0 ? '+' : ''}
                        {getOfferPercentage(getLatestOfferAmount(offer), offer.property.price)}% from listing
                      </div>
                    )}
                    {offer.counterOffers && offer.counterOffers.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {offer.counterOffers.length} counter offer(s)
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(offer.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="navy"
                        className="border-2 border-black"
                        onClick={() => handleViewOffer(offer)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      
                      {(offer.status === 'pending' || offer.status === 'countered') && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-[#0d2f72] hover:bg-[#0d2f72]/90 text-white border-2 border-black"
                            onClick={() => handleUpdateOfferStatus(offer.id, 'accepted')}
                            disabled={updatingStatus}
                          >
                            <Check size={16} className="mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-black"
                            onClick={() => handleCounterOffer(offer)}
                            disabled={updatingStatus}
                          >
                            <ArrowRightLeft size={16} className="mr-1" />
                            Counter
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-[#d0161a] hover:bg-[#d0161a]/90 text-white border-2 border-black"
                            onClick={() => handleUpdateOfferStatus(offer.id, 'declined')}
                            disabled={updatingStatus}
                          >
                            <X size={16} className="mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CreditCard size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">No Offers Yet</h3>
          <p className="mb-6">You haven't received any offers on your properties yet.</p>
        </div>
      )}
      
      {/* Offer Detail Dialog */}
      {selectedOffer && (
        <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Offer Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b-2 border-black pb-2">Property Information</h3>
                  
                  <div className="space-y-2">
                    <p><span className="font-bold">Property:</span> {selectedOffer.property?.title || "Unknown Property"}</p>
                    <p><span className="font-bold">Listing Price:</span> ${selectedOffer.property?.price.toLocaleString() || 'N/A'}</p>
                    
                    <div className="mt-4">
                      <Button asChild size="sm" variant="navy" className="border-2 border-black">
                        <Link to={`/property/${selectedOffer.propertyId}`}>
                          View Property
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b-2 border-black pb-2">Buyer Information</h3>
                  
                  <div className="space-y-2">
                    <p><span className="font-bold">Name:</span> {selectedOffer.buyerName}</p>
                    {selectedOffer.buyerEmail && <p><span className="font-bold">Email:</span> {selectedOffer.buyerEmail}</p>}
                    {selectedOffer.buyerPhone && <p><span className="font-bold">Phone:</span> {selectedOffer.buyerPhone}</p>}
                    <p><span className="font-bold">Date Offered:</span> {new Date(selectedOffer.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t-2 border-black pt-4">
                <h3 className="font-bold text-lg mb-4">Offer Details</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="border-2 border-black p-4 mb-4">
                      <p className="text-xl font-bold">${getLatestOfferAmount(selectedOffer).toLocaleString()}</p>
                      <p className="text-sm">Latest Offer Amount</p>
                      
                      {selectedOffer.property?.price && (
                        <p className={`mt-2 ${getOfferPercentage(getLatestOfferAmount(selectedOffer), selectedOffer.property.price) >= 0 ? 'text-[#d0161a]' : 'text-[#0d2f72]'} font-bold`}>
                          {getOfferPercentage(getLatestOfferAmount(selectedOffer), selectedOffer.property.price) >= 0 ? '+' : ''}
                          {getOfferPercentage(getLatestOfferAmount(selectedOffer), selectedOffer.property.price)}% from listing price
                        </p>
                      )}
                    </div>
                    
                    {selectedOffer.counterOffers && selectedOffer.counterOffers.length > 0 && (
                      <div className="border-2 border-black p-4 mb-4">
                        <h4 className="font-bold mb-2">Negotiation History</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          <div className="flex justify-between items-center p-2 bg-gray-100">
                            <div>
                              <strong>Initial Offer:</strong> ${selectedOffer.offerAmount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(selectedOffer.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {[...selectedOffer.counterOffers]
                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                            .map((counterOffer, index) => (
                              <div 
                                key={counterOffer.id} 
                                className={`flex justify-between items-center p-2 ${counterOffer.fromSeller ? 'bg-blue-50' : 'bg-green-50'}`}
                              >
                                <div>
                                  <strong>{counterOffer.fromSeller ? 'You' : 'Buyer'}:</strong> ${counterOffer.amount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(counterOffer.created_at).toLocaleString()}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="font-bold mb-2">Buyer's Interest:</p>
                      <p>{selectedOffer.isInterested 
                        ? "Buyer has indicated they are interested in this property and would like to proceed with the transaction." 
                        : "Buyer has not indicated specific interest in proceeding with this transaction."}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-bold mb-2">Proof of Funds:</p>
                    {selectedOffer.proofOfFundsUrl ? (
                      <div>
                        <p className="mb-2">Buyer has provided proof of funds documentation.</p>
                        <Button 
                          asChild
                          size="sm" 
                          variant="navy"
                          className="border-2 border-black"
                        >
                          <a href={selectedOffer.proofOfFundsUrl} target="_blank" rel="noopener noreferrer">
                            <FileText size={16} className="mr-1" />
                            View Document
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <p>Buyer has not provided any proof of funds documentation.</p>
                    )}
                    
                    <div className="mt-6">
                      <p className="font-bold mb-2">Current Status:</p>
                      <div className="mb-4">{getStatusBadge(selectedOffer.status)}</div>
                      
                      {(selectedOffer.status === 'pending' || selectedOffer.status === 'countered') && (
                        <div className="flex gap-2">
                          <Button 
                            variant="navy"
                            className="border-2 border-black"
                            onClick={() => handleUpdateOfferStatus(selectedOffer.id, 'accepted')}
                            disabled={updatingStatus}
                          >
                            <Check size={16} className="mr-1" />
                            Accept Offer
                          </Button>
                          <Button 
                            className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-black"
                            onClick={() => handleCounterOffer(selectedOffer)}
                            disabled={updatingStatus}
                          >
                            <ArrowRightLeft size={16} className="mr-1" />
                            Counter Offer
                          </Button>
                          <Button 
                            className="bg-[#d0161a] hover:bg-[#d0161a]/90 text-white border-2 border-black"
                            onClick={() => handleUpdateOfferStatus(selectedOffer.id, 'declined')}
                            disabled={updatingStatus}
                          >
                            <X size={16} className="mr-1" />
                            Decline Offer
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-4 border-t-2 border-black pt-4">
                <p className="font-bold">Disclaimer:</p>
                <p>Offers are non-binding and can be withdrawn at any time before a formal contract is signed. 
                This is simply an expression of interest and does not constitute a legally binding agreement.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setOfferDialogOpen(false)}
                className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Counter Offer Dialog */}
      <Dialog open={counterOfferDialogOpen} onOpenChange={setCounterOfferDialogOpen}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Make Counter Offer</DialogTitle>
            <DialogDescription>
              Enter the amount you'd like to counter with. The buyer will be notified.
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
              disabled={updatingStatus}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="navy"
              className="text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              onClick={submitCounterOffer}
              disabled={updatingStatus}
            >
              <ArrowRightLeft size={18} className="mr-2" />
              {updatingStatus ? "Sending..." : "Send Counter Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OffersTab;
