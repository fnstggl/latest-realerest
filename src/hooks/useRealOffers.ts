
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RealOffer {
  id: string;
  amount: number;
  buyerName: string;
  withdrawn?: boolean;
}

export function useRealOffers(propertyId: string | undefined) {
  const [realOffers, setRealOffers] = useState<RealOffer[]>([]);
  useEffect(() => {
    if (!propertyId) return;
    let isMounted = true;
    const fetchRealOffers = async () => {
      try {
        const { data, error } = await supabase
          .from("property_offers")
          .select("id, offer_amount, user_id, status")
          .eq("property_id", propertyId)
          .eq("is_interested", true)
          .order("offer_amount", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching real offers:", error);
          return;
        }

        if (data && data.length > 0 && isMounted) {
          const formatted = data.map((offer: any) => ({
            id: offer.id,
            amount: Number(offer.offer_amount),
            buyerName: "Anonymous buyer",
            withdrawn: offer.status === "withdrawn",
          }));
          setRealOffers(formatted);
        } else if (isMounted) {
          setRealOffers([]);
        }
      } catch (e) {
        if (isMounted) setRealOffers([]);
      }
    };
    fetchRealOffers();
    return () => { isMounted = false; };
  }, [propertyId]);

  return realOffers;
}
