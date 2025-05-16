
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to upload an image to Supabase storage
export const uploadImageToSupabase = async (file: File, propertyId: string): Promise<string | null> => {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('property_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property_images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Exception in image upload:', error);
    return null;
  }
};

// Wrapper function for multiple image uploads with progress tracking
export const uploadImagesToSupabase = async (
  files: File[], 
  propertyId: string,
  progressCallback?: (progress: number) => void
): Promise<string[]> => {
  const totalFiles = files.length;
  let uploadedFiles = 0;
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const url = await uploadImageToSupabase(file, propertyId);
    if (url) {
      uploadedUrls.push(url);
    }
    
    uploadedFiles++;
    if (progressCallback) {
      progressCallback(Math.round((uploadedFiles / totalFiles) * 100));
    }
  }

  return uploadedUrls;
};

// Function to create notification
export const createNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  type = 'info', 
  properties = {}
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('notifications').insert([{
      user_id: userId,
      title,
      message,
      type,
      properties
    }]);

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception creating notification:', error);
    return false;
  }
};

// Function to delete property images from storage
export const deletePropertyImages = async (propertyId: string): Promise<boolean> => {
  try {
    // First list all files in the property folder
    const { data: files, error: listError } = await supabase.storage
      .from('property_images')
      .list(propertyId);

    if (listError) {
      console.error('Error listing files:', listError);
      return false;
    }

    if (!files || files.length === 0) {
      console.log('No files found for property:', propertyId);
      return true; // Consider this a success since there's nothing to delete
    }

    // Get paths for all files
    const filePaths = files.map(file => `${propertyId}/${file.name}`);

    // Delete all files
    const { data, error } = await supabase.storage
      .from('property_images')
      .remove(filePaths);

    if (error) {
      console.error('Error deleting files:', error);
      return false;
    }

    console.log('Successfully deleted files:', data);
    return true;
  } catch (error) {
    console.error('Exception in deleting property images:', error);
    return false;
  }
};
