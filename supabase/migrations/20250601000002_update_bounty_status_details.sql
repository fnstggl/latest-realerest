
-- Update the status_details column default value to include buyers array with status
ALTER TABLE bounty_claims 
ALTER COLUMN status_details SET DEFAULT 
  '{"claimed": true, "buyers": [{"id": "default", "name": "Primary Buyer", "status": "Interested Buyer", "foundBuyer": false, "submittedOffer": false, "offerAccepted": false, "dealClosed": false}]}'::jsonb;

-- Add a comment to explain the structure
COMMENT ON COLUMN bounty_claims.status_details IS 'JSON structure containing: claimed (boolean), buyers (array of buyer objects with progress and status)';
