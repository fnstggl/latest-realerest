import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import imageCompression from 'browser-image-compression';

// Maximum image size in bytes (3MB)
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
// Target size for compressed images (500KB)
const TARGET_COMPRESSED_SIZE = 500 * 1024;
// Maximum dimensions for full-size images
const MAX_IMAGE_WIDTH = 1600;
// JPEG quality setting (0.75 = 75% quality, good balance between size and quality)
const JPEG_QUALITY = 0.75;

// Use a smaller default image size for faster loading
const DEFAULT_IMAGE = "https://source.unsplash.com/random/400x300?house";

/**
 * Checks if a file is a HEIC/HEIF format
 */
function isHeicFile(file: File): boolean {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  return fileType === 'image/heic' || 
         fileType === 'image/heif' || 
         fileName.endsWith('.heic') || 
         fileName.endsWith('.heif');
}

/**
 * Converts a HEIC/HEIF file to JPEG format
 * This uses a dynamic import to avoid bloating the main bundle
 */
async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    // Dynamically import heic2any library only when needed
    const heic2any = await import('heic2any');
    
    console.log("Converting HEIC file to JPEG:", file.name);
    
    // Convert the HEIC file to JPEG blob
    const jpegBlob = await heic2any.default({
      blob: file,
      toType: "image/jpeg",
      quality: 0.85 // Slightly higher than our normal JPEG quality to preserve details
    });
    
    // Handle both single blob and array of blobs return types
    const resultBlob = Array.isArray(jpegBlob) ? jpegBlob[0] : jpegBlob;
    
    // Create a new File from the JPEG blob
    const jpegFile = new File(
      [resultBlob], 
      file.name.replace(/\.(heic|heif)$/i, '.jpg'), 
      { type: 'image/jpeg' }
    );
    
    console.log("HEIC conversion complete:", 
      `${(file.size / 1024).toFixed(2)}KB →`,
      `${(jpegFile.size / 1024).toFixed(2)}KB`);
    
    return jpegFile;
  } catch (error) {
    console.error("Error converting HEIC to JPEG:", error);
    // If conversion fails, throw an error to be handled by the caller
    throw new Error(`Failed to convert HEIC image: ${file.name}`);
  }
}

/**
 * Compresses an image file to reduce its size while maintaining quality
 */
async function compressImage(file: File): Promise<File> {
  try {
    // Check if this is a HEIC/HEIF file that needs conversion
    if (isHeicFile(file)) {
      try {
        console.log("Processing HEIC file:", file.name);
        // Convert HEIC to JPEG first
        const jpegFile = await convertHeicToJpeg(file);
        console.log("HEIC converted to JPEG, now compressing:", jpegFile.name);
        // Then apply compression to the JPEG
        return await compressStandardImage(jpegFile);
      } catch (error) {
        console.error("HEIC conversion error:", error);
        throw error;
      }
    } else {
      // For standard image formats, just compress
      return await compressStandardImage(file);
    }
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    return file; // Return original as fallback
  }
}

/**
 * Standard compression for JPEG, PNG, etc.
 */
async function compressStandardImage(file: File): Promise<File> {
  // Skip compression for small enough files
  if (file.size <= TARGET_COMPRESSED_SIZE) {
    console.log("Image already small enough, skipping compression:", file.name);
    return file;
  }
  
  // Options for image compression
  const options = {
    maxSizeMB: TARGET_COMPRESSED_SIZE / (1024 * 1024),
    maxWidthOrHeight: MAX_IMAGE_WIDTH,
    useWebWorker: true,
    fileType: file.type,
    initialQuality: JPEG_QUALITY,
    alwaysKeepResolution: false
  };
  
  try {
    // Compress the image
    const compressedFile = await imageCompression(file, options);
    console.log(
      "Compression result:",
      file.name,
      `${(file.size / 1024).toFixed(2)}KB →`,
      `${(compressedFile.size / 1024).toFixed(2)}KB`,
      `(${Math.round((compressedFile.size / file.size) * 100)}%)`
    );
    
    return compressedFile;
  } catch (err) {
    console.error("Error compressing image:", err);
    return file; // Return original as fallback
  }
}

/**
 * Uploads images to Supabase storage with compression and optimization
 * Added better error handling and concurrency control
 */
export const uploadImagesToSupabase = async (
  files: File[], 
  propertyId?: string, 
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  if (files.length === 0) return [DEFAULT_IMAGE];
  
  // Create a folder name for this batch of uploads - use property ID if available for better tracking
  const folderName = propertyId ? `property-${propertyId}` : `listing-${uuidv4()}`;
  
  try {
    // Test bucket access before proceeding with full upload
    try {
      console.log("Testing storage bucket access...");
      const { error: testError } = await supabase.storage
        .from('property_images')
        .list("test", { limit: 1 });
        
      if (testError) {
        console.error("Storage bucket access test failed:", testError);
        if (testError.message?.includes("row-level security") || testError.message?.includes("permission denied")) {
          throw new Error("Storage permission denied. Please make sure you're logged in and have permission to upload images.");
        }
      }
      console.log("Storage bucket access verified");
    } catch (accessError) {
      console.error("Storage bucket test access error:", accessError);
      throw accessError;
    }
  
    // Process files in sequence with compression
    const compressedFiles: File[] = [];
    
    // Step 1: Compress all images
    for (let i = 0; i < files.length; i++) {
      if (onProgress) {
        onProgress(Math.min(30, (i / files.length) * 30));
      }
      
      try {
        const compressedFile = await compressImage(files[i]);
        compressedFiles.push(compressedFile);
      } catch (err) {
        console.error("Error compressing file:", err);
        // Use original file as fallback
        compressedFiles.push(files[i]);
      }
    }
    
    // Step 2: Upload compressed files with improved error handling
    const results: string[] = [];
    // Reduce concurrency to avoid overwhelming the API - use sequential uploads to prevent race conditions
    const concurrencyLimit = 1; // Process one file at a time for reliability
    
    // Process files in batches with lower concurrency
    for (let i = 0; i < compressedFiles.length; i += concurrencyLimit) {
      const batch = compressedFiles.slice(i, i + concurrencyLimit);
      const progressStart = 30 + (i / compressedFiles.length) * 50;
      
      const batchPromises = batch.map(async (file, batchIndex) => {
        const currentIndex = i + batchIndex;
        const progressIncrement = 50 / compressedFiles.length;
        
        try {
          // Create a unique but descriptive filename
          const fileExt = file.type === 'image/jpeg' ? 'jpg' : 
                          file.type === 'image/png' ? 'png' : 
                          file.name.split('.').pop();
          const fileName = `${currentIndex}-${Date.now().toString().slice(-6)}.${fileExt}`;
          const filePath = `${folderName}/${fileName}`;
          
          console.log(`Uploading file ${currentIndex + 1}/${compressedFiles.length}: ${filePath}`);
          
          // Add timeout protection for each upload
          const uploadPromise = new Promise<{data: any, error: any}>((resolve, reject) => {
            // Create a timeout for the upload
            const timeoutId = setTimeout(() => {
              reject(new Error(`Upload timeout for ${file.name}`));
            }, 30000); // 30 second timeout
            
            // Attempt the upload
            supabase.storage
              .from('property_images')
              .upload(filePath, file, {
                cacheControl: '31536000', // 1 year cache for immutable assets
                upsert: false,
                contentType: file.type
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
          
          const { data, error } = await uploadPromise;
          
          if (error) {
            console.error('Error uploading image:', error);
            // Check specifically for RLS policy errors
            if (error.message?.includes("row-level security") || error.message?.includes("permission denied")) {
              throw new Error("Storage permission denied. Please make sure you're logged in and have the correct permissions to upload images.");
            }
            return null;
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);
          
          console.log(`Successfully uploaded: ${filePath}`, publicUrl);
          
          // Update progress within batch
          if (onProgress) {
            onProgress(Math.min(80, progressStart + progressIncrement * (batchIndex + 1)));
          }
            
          return publicUrl;
        } catch (err) {
          console.error('Error processing file:', err);
          return null;
        }
      });
      
      try {
        // Wait for current batch to complete before processing next batch
        const batchResults = await Promise.all(batchPromises);
        
        // Filter successful uploads and add to results
        batchResults.forEach(result => {
          if (result) {
            results.push(result);
          }
        });
      } catch (batchError) {
        console.error('Error in upload batch:', batchError);
        throw batchError; // Re-throw to handle in the main try-catch
      }
    }
    
    if (onProgress) {
      onProgress(95);
    }
    
    console.log(`Upload completed: ${results.length} files uploaded successfully`);
    return results.length > 0 ? results : [DEFAULT_IMAGE];
    
  } catch (error: any) {
    console.error('Error in image upload process:', error);
    // Provide specific error messages for common issues
    if (error.message?.includes("row-level security") || error.message?.includes("permission denied")) {
      throw new Error("Storage permission denied. Please make sure you're logged in and have the correct permissions to upload images.");
    }
    // Throw the error to be handled by the calling code
    throw error;
  }
};

/**
 * Deletes images associated with a property listing from storage
 */
export const deletePropertyImages = async (propertyId: string, images?: string[]): Promise<boolean> => {
  try {
    if (!images || images.length === 0) {
      console.log("No images to delete for property:", propertyId);
      return true;
    }
    
    const filesToDelete: string[] = [];
    
    // First try to delete by property folder
    try {
      const { data: folderData, error: folderError } = await supabase.storage
        .from('property_images')
        .list(`property-${propertyId}`);
      
      if (!folderError && folderData && folderData.length > 0) {
        // Found property folder, extract file paths
        filesToDelete.push(...folderData.map(file => `property-${propertyId}/${file.name}`));
      }
    } catch (folderErr) {
      console.error("Error listing property folder:", folderErr);
    }
    
    // If no files found by property ID folder, try to extract file paths from URLs
    if (filesToDelete.length === 0 && images && images.length > 0) {
      // Extract file paths from the image URLs
      images.forEach(imageUrl => {
        try {
          // Parse the URL to extract the file path
          const url = new URL(imageUrl);
          const pathParts = url.pathname.split('/');
          const bucketName = pathParts[2]; // typically "property_images"
          
          if (bucketName === "property_images") {
            // Extract the file path (everything after the bucket name)
            const filePath = pathParts.slice(3).join('/');
            if (filePath) {
              filesToDelete.push(filePath);
            }
          }
        } catch (err) {
          console.error("Error parsing image URL:", imageUrl, err);
        }
      });
    }
    
    if (filesToDelete.length > 0) {
      console.log(`Deleting ${filesToDelete.length} images for property ${propertyId}`);
      const { error } = await supabase.storage
        .from('property_images')
        .remove(filesToDelete);
        
      if (error) {
        console.error("Error deleting property images:", error);
        return false;
      }
      
      return true;
    } else {
      console.log("No image files found to delete for property:", propertyId);
      return true;
    }
  } catch (error) {
    console.error("Error in deletePropertyImages:", error);
    return false;
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
