
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ensureAuthenticated } from "@/utils/authUtils";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";
import { v4 as uuidv4 } from 'uuid';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const isHEIC = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
};

export const convertHEICToJPEG = async (file: File): Promise<File> => {
  try {
    console.log("Converting HEIC file to JPEG:", file.name);
    const jpegBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8
    }) as Blob;
    
    // Create new file with proper name and type
    const fileName = file.name.replace(/\.(heic|HEIC|heif|HEIF)$/, '.jpg');
    return new File([jpegBlob], fileName, { type: "image/jpeg" });
  } catch (error) {
    console.error("HEIC conversion error:", error);
    throw new Error(`Failed to convert HEIC image: ${error}`);
  }
};

export const compressImage = async (file: File): Promise<File> => {
  try {
    console.log("Compressing image:", file.name, "Original size:", Math.round(file.size / 1024), "KB");
    
    // Check if the file is already small enough
    if (file.size < 800 * 1024) {
      console.log("Image already small enough, skipping compression");
      return file;
    }
    
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: file.type
    };
    
    const compressedFile = await imageCompression(file, options);
    console.log("Compressed size:", Math.round(compressedFile.size / 1024), "KB");
    
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    throw new Error(`Failed to compress image: ${error}`);
  }
};

export const preprocessImage = async (file: File): Promise<File> => {
  try {
    let processedFile = file;
    
    // Convert HEIC to JPEG if needed
    if (isHEIC(processedFile)) {
      processedFile = await convertHEICToJPEG(processedFile);
    }
    
    // Compress image
    processedFile = await compressImage(processedFile);
    
    return processedFile;
  } catch (error) {
    console.error("Image preprocessing error:", error);
    throw new Error(`Failed to preprocess image: ${error}`);
  }
};

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
    const session = await ensureAuthenticated(false);
    if (!session?.user) {
      console.error("User not authenticated for upload");
      toast.error("Authentication error. Please sign in again.");
      throw new Error("User not authenticated");
    }
    
    // Get the current user to include in metadata
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.error("Failed to get current user for metadata");
      throw new Error("User not authenticated. Upload aborted.");
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
            owner: userData.user.id
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

// The uploadImagesToSupabase function needed by CreateListing.tsx
export const uploadImagesToSupabase = async (
  imageFiles: File[], 
  propertyId: string,
  onProgressUpdate?: (progress: number) => void
): Promise<string[]> => {
  if (!imageFiles || imageFiles.length === 0) {
    console.log("No images to upload");
    return [];
  }

  console.log(`Starting to upload ${imageFiles.length} images for property ${propertyId}`);
  
  try {
    // Verify authentication before starting
    const authUser = await ensureAuthenticated(false);
    if (!authUser) {
      console.error("Authentication check failed in uploadImagesToSupabase");
      toast.error("Authentication required. Please sign in to continue.");
      return [];
    }
    
    // Generate a batch ID for this group of uploads (use propertyId if provided)
    const batchPath = `properties/${propertyId || uuidv4().slice(0, 8)}`;
    console.log(`Using batch path: ${batchPath}`);
    
    // First preprocess all images (convert/compress)
    const totalSteps = imageFiles.length * 2; // Preprocess + upload for each file
    let completedSteps = 0;
    
    if (onProgressUpdate) onProgressUpdate(5); // Start with 5%
    
    const preprocessPromises = imageFiles.map(async (file) => {
      const processedFile = await preprocessImage(file);
      completedSteps++;
      if (onProgressUpdate) {
        const progress = Math.round((completedSteps / totalSteps) * 90) + 5; // 5-95%
        onProgressUpdate(progress);
      }
      return processedFile;
    });
    
    const processedFiles = await Promise.all(preprocessPromises);
    console.log("All images preprocessed, starting uploads");
    
    // Upload all files with retry logic
    const uploadPromises = processedFiles.map(async (file) => {
      const result = await uploadFileWithRetry(file, batchPath);
      completedSteps++;
      if (onProgressUpdate) {
        const progress = Math.round((completedSteps / totalSteps) * 90) + 5; // 5-95%
        onProgressUpdate(progress);
      }
      return result;
    });
    
    const results = await Promise.all(uploadPromises);
    
    // Get successful upload URLs
    const uploadedUrls = results
      .filter(result => result.success && result.url)
      .map(result => result.url as string);
    
    // Check for any failed uploads
    const failedUploads = results.filter(result => !result.success);
    if (failedUploads.length > 0) {
      console.error(`${failedUploads.length} images failed to upload`);
      const errorMessages = failedUploads.map(result => result.error).join('; ');
      toast.error(`Some images failed to upload: ${errorMessages}`);
    }
    
    if (onProgressUpdate) onProgressUpdate(100); // Complete
    console.log(`Upload complete: ${uploadedUrls.length} successful, ${failedUploads.length} failed`);
    return uploadedUrls;
  } catch (error) {
    console.error("Error in uploadImagesToSupabase:", error);
    toast.error("Failed to process and upload images");
    if (onProgressUpdate) onProgressUpdate(0); // Reset progress on error
    return [];
  }
};

// Add the createNotification function that is being imported in CreateListing.tsx
export const createNotification = async (
  propertyId: string,
  propertyType: string = 'Property',
  city: string = '',
  state: string = ''
): Promise<void> => {
  try {
    const authUser = await ensureAuthenticated(false);
    if (!authUser) {
      console.error("Authentication check failed in createNotification");
      return;
    }
    
    const location = city && state ? `${city}, ${state}` : "a new location";
    
    // Create a notification for new property listing
    const { error } = await supabase
      .from('notifications')
      .insert({
        title: "New Property Listed",
        message: `A new ${propertyType} in ${location} was just listed`,
        type: "property",
        properties: { propertyId },
        user_id: authUser.id // Add the user_id field that was missing
      });
    
    if (error) {
      console.error("Failed to create notification:", error);
    } else {
      console.log("Notification created for new property");
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Add function to delete property images
export const deletePropertyImages = async (imageUrls: string[]): Promise<boolean> => {
  if (!imageUrls || imageUrls.length === 0) return true;
  
  try {
    const authUser = await ensureAuthenticated(false);
    if (!authUser) {
      console.error("Authentication check failed in deletePropertyImages");
      toast.error("Authentication required. Please sign in to continue.");
      return false;
    }
    
    // Extract paths from URLs
    const imagePaths = imageUrls.map(url => {
      // Parse the URL to get the path
      try {
        const urlObj = new URL(url);
        // Get the path without the leading slash
        const pathWithoutBucket = urlObj.pathname.split('/storage/v1/object/public/property_images/')[1];
        if (!pathWithoutBucket) {
          console.error("Could not parse image path from URL:", url);
          return null;
        }
        return pathWithoutBucket;
      } catch (err) {
        console.error("Invalid URL:", url, err);
        return null;
      }
    }).filter(Boolean) as string[];
    
    if (imagePaths.length === 0) {
      console.warn("No valid image paths to delete");
      return true;
    }
    
    console.log("Deleting images:", imagePaths);
    
    // Delete the images
    const { data, error } = await supabase.storage
      .from('property_images')
      .remove(imagePaths);
    
    if (error) {
      console.error("Error deleting images:", error);
      toast.error("Failed to delete some images");
      return false;
    }
    
    console.log("Images deleted successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in deletePropertyImages:", error);
    toast.error("Failed to delete images");
    return false;
  }
};

export const processAndUploadImages = async (imageFiles: File[]): Promise<string[]> => {
  // Maintain this function for backward compatibility
  // It delegates to the new uploadImagesToSupabase function
  return uploadImagesToSupabase(imageFiles, uuidv4().slice(0, 8));
};
