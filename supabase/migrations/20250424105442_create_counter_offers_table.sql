
-- Create a counter_offers table for tracking negotiation
CREATE TABLE public.counter_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES public.property_offers(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  from_seller BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.counter_offers ENABLE ROW LEVEL SECURITY;

-- Policies for counter offers (buyers and sellers can view related to their offers)
CREATE POLICY "Users can view counter offers for their property offers"
  ON public.counter_offers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.property_offers po
      WHERE po.id = counter_offers.offer_id
      AND (po.user_id = auth.uid() OR po.seller_id = auth.uid())
    )
  );

-- Users can create counter offers for their own offers
CREATE POLICY "Buyers can create counter offers"
  ON public.counter_offers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.property_offers po
      WHERE po.id = counter_offers.offer_id
      AND (po.user_id = auth.uid() OR po.seller_id = auth.uid())
    )
  );
