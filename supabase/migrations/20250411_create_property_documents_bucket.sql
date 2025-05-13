
-- First check if the bucket already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'property_documents') THEN
    -- Create a storage bucket for property documents
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('property_documents', 'Property Documents', true);
  END IF;
END
$$;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Authenticated users can upload property documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own property documents" ON storage.objects;
DROP POLICY IF EXISTS "Sellers can read proof of funds for their properties" ON storage.objects;

-- Create a policy to allow authenticated users to upload to this bucket
CREATE POLICY "property_documents:auth_insert" 
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property_documents');

-- Create a policy to allow users to read their own uploads
CREATE POLICY "property_documents:owner_select" 
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'property_documents' AND (storage.foldername(name))[1] = auth.uid());

-- Create a policy to allow property sellers to read proof of funds documents for their properties
CREATE POLICY "property_documents:seller_access" 
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'property_documents' AND 
  (storage.foldername(name))[1] = 'proof_of_funds' AND
  auth.uid() IN (
    SELECT user_id FROM property_listings 
    WHERE id = (storage.foldername(name))[2]
  )
);
