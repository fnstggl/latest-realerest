
-- Create a storage bucket for property images if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public)
SELECT 'property_images', 'Property Images', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'property_images'
);

-- Create a policy to allow anyone to read images
CREATE POLICY "Public Access Policy" ON storage.objects 
    FOR SELECT USING (bucket_id = 'property_images');

-- Create a policy to allow authenticated users to upload images
CREATE POLICY "Auth Upload Policy" ON storage.objects 
    FOR INSERT WITH CHECK (
        bucket_id = 'property_images' AND 
        auth.role() = 'authenticated'
    );
