
-- Create a storage bucket for property images if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public)
SELECT 'property_images', 'Property Images', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'property_images'
);

-- First, drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Read Policy" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Policy" ON storage.objects;
DROP POLICY IF EXISTS "Owner Update Policy" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete Policy" ON storage.objects;

-- Create a policy to allow anyone to read images
CREATE POLICY "property_images:public_read" ON storage.objects 
    FOR SELECT USING (bucket_id = 'property_images');

-- Create a policy to allow authenticated users to upload images
CREATE POLICY "property_images:auth_insert" ON storage.objects 
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'property_images'
    );

-- Create a policy to allow users to update their own images
CREATE POLICY "property_images:owner_update" ON storage.objects 
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'property_images' AND 
        auth.uid() = owner
    );

-- Create a policy to allow users to delete their own images
CREATE POLICY "property_images:owner_delete" ON storage.objects 
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'property_images' AND 
        auth.uid() = owner
    );

-- Create a storage bucket for property documents if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public)
SELECT 'property_documents', 'Property Documents', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'property_documents'
);

-- Create policies for property_documents bucket
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
