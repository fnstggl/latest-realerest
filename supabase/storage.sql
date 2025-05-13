
-- Create a storage bucket for property images if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public)
SELECT 'property_images', 'Property Images', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'property_images'
);

-- Enable RLS on the objects table if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create simplified, non-conflicting policies

-- 1. Public read access for all images (simplifies frontend display)
CREATE POLICY "property_images:public_read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property_images');

-- 2. Authenticated users can upload images with proper ownership
CREATE POLICY "property_images:authenticated_insert" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
    bucket_id = 'property_images' AND
    (
        -- Either metadata owner matches user ID
        ((metadata ->> 'owner')::text = auth.uid()::text) OR
        -- Or object is in user's folder path
        (storage.foldername(name))[1] = auth.uid()::text
    )
);

-- 3. Users can only update their own images
CREATE POLICY "property_images:owner_update" 
ON storage.objects FOR UPDATE 
TO authenticated
USING (
    bucket_id = 'property_images' AND
    (
        -- Either metadata owner matches user ID
        ((metadata ->> 'owner')::text = auth.uid()::text) OR
        -- Or object is in user's folder path
        (storage.foldername(name))[1] = auth.uid()::text
    )
);

-- 4. Users can only delete their own images
CREATE POLICY "property_images:owner_delete" 
ON storage.objects FOR DELETE 
TO authenticated
USING (
    bucket_id = 'property_images' AND
    (
        -- Either metadata owner matches user ID
        ((metadata ->> 'owner')::text = auth.uid()::text) OR
        -- Or it's in user's folder
        (storage.foldername(name))[1] = auth.uid()::text
    )
);
