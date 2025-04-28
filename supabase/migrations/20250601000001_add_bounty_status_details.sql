
-- Add status_details column to track progress of bounty claims
ALTER TABLE bounty_claims ADD COLUMN IF NOT EXISTS status_details jsonb DEFAULT '{"claimed": true, "foundBuyer": false, "submittedOffer": false, "offerAccepted": false, "dealClosed": false}'::jsonb;

