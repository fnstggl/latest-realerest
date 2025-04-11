
-- This migration adds the missing relation between messages and property_offers

-- First make sure related_offer_id in messages has a foreign key constraint
ALTER TABLE public.messages
ADD CONSTRAINT messages_related_offer_id_fkey
FOREIGN KEY (related_offer_id) REFERENCES public.property_offers(id);

-- Let's make sure property_offers references property_listings
ALTER TABLE public.property_offers
ADD CONSTRAINT property_offers_property_id_fkey
FOREIGN KEY (property_id) REFERENCES public.property_listings(id);
