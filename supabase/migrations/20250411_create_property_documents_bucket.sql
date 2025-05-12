
-- Create a storage bucket for property documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property_documents', 'Property Documents', true);

-- Create a policy to allow authenticated users to upload to this bucket
CREATE POLICY "Authenticated users can upload property documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property_documents');

-- Create a policy to allow users to read their own uploads
CREATE POLICY "Users can read their own property documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'property_documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create a policy to allow property sellers to read proof of funds documents for their properties
CREATE POLICY "Sellers can read proof of funds for their properties"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'property_documents' AND 
  (storage.foldername(name))[1] = 'proof_of_funds' AND
  auth.uid() IN (
    SELECT user_id FROM property_listings 
    WHERE id::text = (storage.foldername(name))[2]
  )
);
