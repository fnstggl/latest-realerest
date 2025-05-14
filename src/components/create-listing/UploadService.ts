import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadFileWithRetry = async (
  file: File, 
  path = "properties",
  maxRetries = 3
): Promise<UploadResult> => {
  let attemptCount = 0;
  
  // Generate unique filename to avoid conflicts
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;
  
  // First verify authentication state
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error("User not authenticated for upload");
      toast.error("Authentication error. Please sign in again.");
      throw new Error("User not authenticated");
    }
    
    // Add timeout protection for the upload
    const uploadPromise = new Promise<{data: any, error: any}>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        console.error(`Upload timeout for ${file.name}`);
        reject(new Error(`Upload timeout for ${file.name}`));
      }, 30000); // 30 second timeout
      
      // Attempt the upload with owner metadata
      supabase.storage
        .from('property_images')
        .upload(filePath, file, {
          cacheControl: '31536000', // 1 year cache for immutable assets
          upsert: false,
          contentType: file.type,
          metadata: {
            owner: sessionData.session.user.id
          }
        })
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });

    while (attemptCount < maxRetries) {
      try {
        attemptCount++;
        
        console.log(`Upload attempt ${attemptCount} for ${file.name}`);
        
        if (attemptCount > 1) {
          // Small delay between retries to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 1000 * attemptCount)); 
        }
        
        // Perform the upload with timeout protection
        const { data, error } = await uploadPromise;
        
        if (error) {
          console.error(`Upload error (attempt ${attemptCount}):`, error);
          
          // Handle specific errors
          if (error.message.includes('permission') || error.message.includes('not allowed')) {
            // Try reauthenticating on permission issues
            try {
              await ensureAuthenticated(true);
              console.log("Re-authenticated for next attempt");
            } catch (authError) {
              console.error("Re-authentication failed:", authError);
            }
          }
          
          // If last attempt, throw the error
          if (attemptCount >= maxRetries) {
            throw error;
          }
          
          // Otherwise continue to next attempt
          continue;
        }
        
        // If we got here, upload was successful
        const publicURL = supabase.storage
          .from('property_images')
          .getPublicUrl(filePath).data.publicUrl;
        
        console.log(`Successfully uploaded ${file.name} on attempt ${attemptCount}`);
        return { 
          success: true, 
          url: publicURL
        };
      } catch (err) {
        console.error(`Exception on upload attempt ${attemptCount}:`, err);
        
        // If this was the last attempt, return the error
        if (attemptCount >= maxRetries) {
          return {
            success: false,
            error: `Failed to upload ${file.name} after ${maxRetries} attempts: ${err}`
          };
        }
      }
    }
    
    // This should never be reached but adding as fallback
    return {
      success: false,
      error: `Failed to upload ${file.name} after ${maxRetries} attempts.`
    };
  } catch (error) {
    console.error("Upload service error:", error);
    return {
      success: false,
      error: String(error)
    };
  }
};

export const uploadImagesToSupabase = async (
  imageFiles: File[], 
  propertyId: string,
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  try {
    if (!imageFiles || imageFiles.length === 0) {
      console.log("No images to upload");
      return [];
    }
    
    // Update progress to 10%
    onProgress?.(10);
    
    console.log(`Uploading ${imageFiles.length} images for property ${propertyId}`);
    
    // Calculate progress steps
    const progressStep = 80 / imageFiles.length; // 80% of progress for uploads
    
    // Generate a batch ID using the property ID
    const path = `properties/${propertyId}`;
    
    // Upload images one by one to track progress
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      console.log(`Uploading image ${i+1}/${imageFiles.length}: ${file.name}`);
      
      const result = await uploadFileWithRetry(file, path);
      
      if (result.success && result.url) {
        uploadedUrls.push(result.url);
      } else {
        console.error(`Failed to upload image ${i+1}: ${result.error}`);
      }
      
      // Update progress
      const currentProgress = 20 + ((i + 1) * progressStep);
      onProgress?.(Math.min(90, currentProgress)); // Cap at 90%
    }
    
    console.log(`Upload complete: ${uploadedUrls.length}/${imageFiles.length} successful`);
    onProgress?.(95); // Almost done
    
    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading images to Supabase:", error);
    throw new Error(`Failed to upload images: ${error}`);
  }
};

export const createNotification = async (
  propertyId: string,
  propertyType: string,
  city: string,
  state: string
): Promise<void> => {
  try {
    // Verify user authentication
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error("Cannot create notification: User not authenticated");
      return;
    }

    // Create a notification for the new property listing
    const { error } = await supabase.from('notifications').insert({
      type: 'new_property',
      user_id: sessionData.session.user.id,
      title: `New ${propertyType} Listed`,
      message: `A new ${propertyType.toLowerCase()} has been listed in ${city}, ${state}`,
      metadata: { 
        property_id: propertyId,
        property_type: propertyType,
        location: `${city}, ${state}`
      },
      seen: false
    });

    if (error) {
      console.error("Failed to create notification:", error);
    } else {
      console.log("Property notification created successfully");
    }
  } catch (error) {
    console.error("Error creating property notification:", error);
  }
};

// Fix for missing deletePropertyImages function referenced in PropertiesTab.tsx
export const deletePropertyImages = async (
  imageUrls: string[]
): Promise<boolean> => {
  try {
    if (!imageUrls || imageUrls.length === 0) {
      return true;
    }
    
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error("Cannot delete images: User not authenticated");
      return false;
    }
    
    console.log(`Attempting to delete ${imageUrls.length} images`);
    
    // Extract paths from URLs
    const filesToDelete = imageUrls.map(url => {
      // Get path part after property_images/
      const pathMatch = url.match(/property_images\/(.*)/);
      return pathMatch ? pathMatch[1] : null;
    }).filter(Boolean) as string[];
    
    if (filesToDelete.length === 0) {
      console.log("No valid image paths found to delete");
      return true;
    }
    
    const { data, error } = await supabase.storage
      .from('property_images')
      .remove(filesToDelete);
      
    if (error) {
      console.error("Error deleting images:", error);
      return false;
    }
    
    console.log(`Successfully deleted ${data?.length} images`);
    return true;
  } catch (error) {
    console.error("Error in deletePropertyImages:", error);
    return false;
  }
};
