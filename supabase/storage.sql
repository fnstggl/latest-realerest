
-- Create a storage bucket for property images if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public)
SELECT 'property_images', 'Property Images', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'property_images'
);

-- Create a policy to allow anyone to read images
CREATE POLICY "Public Read Policy" ON storage.objects 
    FOR SELECT USING (bucket_id = 'property_images');

-- Create a policy to allow authenticated users to upload images
CREATE POLICY "Authenticated Upload Policy" ON storage.objects 
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'property_images'
    );

-- Create a policy to allow users to update their own images
CREATE POLICY "Owner Update Policy" ON storage.objects 
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'property_images' AND 
        auth.uid()::text = owner::text
    );

-- Create a policy to allow users to delete their own images
CREATE POLICY "Owner Delete Policy" ON storage.objects 
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'property_images' AND 
        auth.uid()::text = owner::text
    );
