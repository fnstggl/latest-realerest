
-- Update the notifications table to allow the new notification types
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add a new constraint that allows the new notification types
ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('info', 'success', 'warning', 'error', 'new_listing', 'message', 'like', 'offer', 'counter_offer'));

-- Update the default value to ensure it's one of the allowed types
ALTER TABLE public.notifications 
ALTER COLUMN type SET DEFAULT 'info'::text;
