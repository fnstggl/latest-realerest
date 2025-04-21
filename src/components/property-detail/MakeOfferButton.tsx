
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const MakeOfferButton: React.FC<{
  propertyId: string;
  propertyTitle: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerId: string;
  currentPrice: number;
  onOfferSubmitted: () => void;
}> = ({
  propertyId,
  propertyTitle,
  sellerName,
  sellerEmail,
  sellerPhone,
  sellerId,
  currentPrice,
  onOfferSubmitted,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmitOffer = async () => {
    setSubmitting(true);

    try {
      // Get buyer's username/name from Supabase profile (do NOT fallback to email for display if profile name exists)
      let buyerName = "";
      if (user && user.id) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .maybeSingle();
        if (profile && profile.name) {
          buyerName = profile.name;
        } else {
          buyerName = user.email; // fallback, but should seldom be hit
        }
      }

      // Insert offer
      const { data: offer, error: offerError } = await supabase
        .from("property_offers")
        .insert({
          property_id: propertyId,
          user_id: user?.id,
          offer_amount: currentPrice,
          seller_id: sellerId,
        })
        .select()
        .single();

      if (offerError) {
        toast.error("Failed to submit offer.");
        setSubmitting(false);
        return;
      }

      // Notify buyer
      await supabase.from("notifications").insert({
        user_id: user?.id,
        title: "Offer Submitted!",
        message: `Your offer of $${currentPrice.toLocaleString()} for "${propertyTitle}" has been sent.`,
        type: "success",
        properties: {
          propertyId,
          offerId: offer.id,
        },
        read: false,
      });

      // Notify seller
      await supabase.from("notifications").insert({
        user_id: sellerId,
        title: "New Offer Received",
        message: `You received a new offer from ${buyerName} for your property "${propertyTitle}".`,
        type: "info",
        properties: {
          propertyId,
          offerId: offer.id,
          buyerName,
          amount: currentPrice,
        },
        read: false,
      });

      toast.success("Offer submitted!");
      onOfferSubmitted && onOfferSubmitted();
    } catch (error) {
      toast.error("Error submitting offer.");
    }
    setSubmitting(false);
  };

  return (
    <Button
      className="w-full bg-black text-white font-bold py-2 relative group overflow-hidden rounded-xl"
      onClick={handleSubmitOffer}
      disabled={submitting}
    >
      <span className="text-white relative z-10 flex items-center">
        Submit Offer <ArrowRight size={18} className="ml-2" />
      </span>
    </Button>
  );
};

export default MakeOfferButton;
