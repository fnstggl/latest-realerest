
-- This file is kept for reference but the actual policies are now consolidated in storage.sql
-- The policies below have been replaced with the simplified versions in storage.sql

/*
-- Enable RLS on the property_images bucket if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict for the property_images bucket
DROP POLICY IF EXISTS "User can select their own property images" ON storage.objects;
DROP POLICY IF EXISTS "User can insert their own property images" ON storage.objects;
DROP POLICY IF EXISTS "User can update their own property images" ON storage.objects;
DROP POLICY IF EXISTS "User can delete their own property images" ON storage.objects;

-- Create policy to select objects in the property_images bucket where user is owner
CREATE POLICY "User can select their own property images" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'property_images' AND 
  (
    -- Either the object has owner metadata matching auth.uid()
    (storage.foldername(name))[1] = auth.uid() OR
    (metadata ->> 'owner') = auth.uid() OR
    -- Or it's in a public folder
    (storage.foldername(name))[1] = 'public'
  )
);

-- Create policy to insert objects in the property_images bucket
CREATE POLICY "User can insert their own property images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'property_images' AND
  auth.uid() IS NOT NULL AND
  (
    -- Allow if explicitly setting owner metadata
    (metadata ->> 'owner')::text = auth.uid()::text OR
    -- Or if putting in user's own folder
    (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- Create policy to update objects in the property_images bucket where user is owner
CREATE POLICY "User can update their own property images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'property_images' AND
  (
    -- Either the object has owner metadata matching auth.uid()
    (metadata ->> 'owner')::text = auth.uid()::text OR
    -- Or it's in user's folder
    (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- Create policy to delete objects in the property_images bucket where user is owner
CREATE POLICY "User can delete their own property images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'property_images' AND
  (
    -- Either the object has owner metadata matching auth.uid()
    (metadata ->> 'owner')::text = auth.uid()::text OR
    -- Or it's in user's folder
    (storage.foldername(name))[1] = auth.uid()::text
  )
);
*/
