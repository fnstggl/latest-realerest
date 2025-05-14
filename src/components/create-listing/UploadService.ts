
// Add any missing imports and functions needed for proper functionality
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Uploads an image file to Supabase storage
 * @param file The file to upload
 * @param path The storage path to upload to
 * @returns The public URL of the uploaded file
 */
export const uploadImageToSupabase = async (
  file: File,
  path: string
): Promise<string | null> => {
  try {
    // Get session to verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No active session found");
      throw new Error("Authentication required");
    }
    
    // Create a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('property_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property_images')
      .getPublicUrl(data?.path || filePath);
    
    return publicUrl;
  } catch (error) {
    console.error("Exception uploading image:", error);
    return null;
  }
};

/**
 * Upload multiple images to Supabase storage
 * @param files Array of files to upload
 * @param propertyId Property ID to use in the path
 * @returns Array of public URLs for the uploaded images
 */
export const uploadPropertyImages = async (
  files: File[],
  propertyId: string
): Promise<string[]> => {
  // Create a storage path for this property's images
  const path = `properties/${propertyId}`;
  const uploadPromises: Promise<string | null>[] = [];
  
  // Start uploads in parallel
  for (const file of files) {
    uploadPromises.push(uploadImageToSupabase(file, path));
  }
  
  try {
    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    
    // Filter out any failed uploads (null values)
    return results.filter((url): url is string => url !== null);
  } catch (error) {
    console.error("Error uploading property images:", error);
    throw new Error("Failed to upload one or more images");
  }
};

/**
 * Deletes property images from Supabase storage
 * @param propertyId The ID of the property whose images should be deleted
 * @returns Boolean indicating success or failure
 */
export const deletePropertyImages = async (
  propertyId: string
): Promise<boolean> => {
  try {
    // Get session to verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No active session found");
      return false;
    }
    
    // List all files in the property's directory
    const { data: files, error: listError } = await supabase.storage
      .from('property_images')
      .list(`properties/${propertyId}`);
    
    if (listError) {
      console.error("Error listing property images:", listError);
      return false;
    }
    
    // If no files found, return success
    if (!files || files.length === 0) {
      return true;
    }
    
    // Get filenames to delete
    const filesToDelete = files.map(file => `properties/${propertyId}/${file.name}`);
    
    // Delete the files
    const { error: deleteError } = await supabase.storage
      .from('property_images')
      .remove(filesToDelete);
    
    if (deleteError) {
      console.error("Error deleting property images:", deleteError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting property images:", error);
    return false;
  }
};
