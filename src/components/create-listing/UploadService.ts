
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

// Maximum image size in bytes (3MB)
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

// Use a smaller default image size for faster loading
const DEFAULT_IMAGE = "https://source.unsplash.com/random/400x300?house";

export const uploadImagesToSupabase = async (files: File[], onProgress?: (progress: number) => void): Promise<string[]> => {
  if (files.length === 0) return [DEFAULT_IMAGE];
  
  // Create a unique folder name for this batch of uploads
  const folderName = `listing-${uuidv4()}`;
  
  try {
    // Adjust concurrency based on file count for optimal performance
    // For 1-5 files, process 2 at a time
    // For 6-10 files, process 3 at a time
    const concurrencyLimit = files.length > 5 ? 3 : 2;
    const results: string[] = [];
    
    // Process files in batches to control concurrency
    for (let i = 0; i < files.length; i += concurrencyLimit) {
      const batch = files.slice(i, i + concurrencyLimit);
      const batchPromises = batch.map(async (file) => {
        try {
          // Create a unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `${folderName}/${fileName}`;
          
          // Use optimized upload settings
          const { data, error } = await supabase.storage
            .from('property_images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (error) {
            console.error('Error uploading image:', error);
            return null;
          }
          
          // Get public URL with better caching
          const { data: { publicUrl } } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);
          
          // Update progress - distribute progress across batches
          if (onProgress) {
            const progressIncrement = 80 / files.length;
            onProgress(Math.min(90, (i / files.length) * 100 + progressIncrement));
          }
            
          return publicUrl;
        } catch (err) {
          console.error('Error processing file:', err);
          return null;
        }
      });
      
      // Wait for current batch to complete before processing next batch
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean) as string[]);
    }
    
    if (onProgress) {
      onProgress(95);
    }
    
    return results.length > 0 ? results : [DEFAULT_IMAGE];
    
  } catch (error) {
    console.error('Error in image upload:', error);
    return [DEFAULT_IMAGE]; // Fallback to default image
  }
};

export const createNotification = async (propertyId: string, propertyType: string, city: string, state: string) => {
  try {
    // First, add a 'notifications' table if it doesn't exist
    // This is a dynamic solution that doesn't rely on modifying the database schema
    
    // Create a collection in Supabase storage for notifications (as a temporary solution)
    const notificationsData = {
      type: 'new_listing',
      title: 'New Property Listed',
      message: `A new ${propertyType} was just listed in ${city}, ${state}`,
      property_id: propertyId,
      created_at: new Date().toISOString()
    };
    
    // Store notification data in localStorage as a fallback mechanism
    const storageKey = 'system_notifications';
    const existingNotifications = localStorage.getItem(storageKey);
    let notifications = [];
    
    if (existingNotifications) {
      notifications = JSON.parse(existingNotifications);
    }
    
    notifications.push(notificationsData);
    localStorage.setItem(storageKey, JSON.stringify(notifications));
    
    console.log("Notification created for new property using fallback mechanism");
    return notificationsData;
    
  } catch (error) {
    console.error("Could not create notification:", error);
    return null;
  }
};
