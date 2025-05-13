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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
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
            owner: user.id
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

export const processAndUploadImages = async (imageFiles: File[]): Promise<string[]> => {
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }

  console.log(`Starting to process and upload ${imageFiles.length} images`);
  
  try {
    // Preprocess all images in parallel first (convert/compress)
    const preprocessPromises = imageFiles.map(file => preprocessImage(file));
    const processedFiles = await Promise.all(preprocessPromises);
    
    console.log("All images preprocessed, starting uploads");
    
    // Generate a batch ID for this group of uploads
    const batchId = uuidv4().slice(0, 8);
    
    // Upload all images (with retries baked in)
    const uploadPromises = processedFiles.map(file => 
      uploadFileWithRetry(file, `properties/${batchId}`)
    );
    
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
    
    console.log(`Upload complete: ${uploadedUrls.length} successful, ${failedUploads.length} failed`);
    return uploadedUrls;
  } catch (error) {
    console.error("Error in processAndUploadImages:", error);
    toast.error("Failed to process and upload images");
    return [];
  }
};
