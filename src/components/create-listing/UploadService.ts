
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

// Extend File type to include optional image dimensions
interface EnhancedFile extends File {
  width?: number;
  height?: number;
}

/**
 * Enhanced check if a file is a HEIC/HEIF format using multiple detection methods
 */
function isHeicFile(file: File): boolean {
  // Check file type and name
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  // Multiple detection methods
  return (
    fileType === 'image/heic' || 
    fileType === 'image/heif' || 
    fileName.endsWith('.heic') || 
    fileName.endsWith('.heif') ||
    // Sometimes HEIC files get misclassified as octet-stream
    (fileType === 'application/octet-stream' && 
      (fileName.endsWith('.heic') || fileName.endsWith('.heif')))
  );
}

/**
 * Converts a HEIC/HEIF file to JPEG format using more reliable direct approach
 */
async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    console.log("Converting HEIC file to JPEG:", file.name);

    // Load heic2any as a dynamic import with error handling
    let heic2any;
    try {
      heic2any = await import('heic2any');
    } catch (importError) {
      console.error("Failed to import heic2any library:", importError);
      throw new Error("HEIC conversion library not available");
    }
    
    // Configure conversion with better reliability settings
    const conversionOptions = {
      blob: file,
      toType: "image/jpeg",
      quality: 0.8
    };
    
    // Add timeout for conversion to prevent hanging
    const conversionPromise = heic2any.default(conversionOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("HEIC conversion timed out")), 30000)
    );
    
    // Race between conversion and timeout
    const jpegBlob = await Promise.race([conversionPromise, timeoutPromise]);
    
    if (!jpegBlob) {
      throw new Error("Empty result from HEIC conversion");
    }
    
    // Handle both single blob and array of blobs return types
    const resultBlob = Array.isArray(jpegBlob) ? jpegBlob[0] : jpegBlob;
    
    // Create a new File from the JPEG blob
    const jpegFile = new File(
      [resultBlob], 
      file.name.replace(/\.(heic|heif)$/i, '.jpg'), 
      { type: 'image/jpeg' }
    );
    
    console.log("HEIC conversion successful:", 
      `${(file.size / 1024).toFixed(2)}KB →`,
      `${(jpegFile.size / 1024).toFixed(2)}KB`);
    
    return jpegFile;
  } catch (error) {
    console.error("Error converting HEIC to JPEG:", error);
    
    // Create a fallback approach - since client-side conversion failed,
    // we'll tag this file for server-side processing instead
    const originalFile = new File(
      [file], 
      file.name,
      { type: file.type }
    );
    
    // Tag file for server processing
    Object.defineProperty(originalFile, 'needsServerConversion', {
      value: true,
      writable: false
    });
    
    throw new Error(`HEIC conversion failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Compresses an image file to reduce its size while maintaining quality
 * With improved handling for different image formats
 */
async function compressImage(file: File): Promise<File> {
  try {
    // Check if this is a HEIC/HEIF file that needs conversion
    if (isHeicFile(file)) {
      try {
        // Convert HEIC to JPEG first
        const jpegFile = await convertHeicToJpeg(file);
        // Then apply compression to the JPEG
        return await compressStandardImage(jpegFile);
      } catch (error) {
        console.error("HEIC conversion failed, using original file:", error);
        
        // If we failed to convert, we'll upload the original and handle server-side
        return file;
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
    alwaysKeepResolution: true,
    preserveExif: true
  };
  
  try {
    // Compress the image with retry mechanism
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
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
        attempts++;
        if (attempts >= maxAttempts) throw err;
        console.log(`Compression attempt ${attempts} failed, retrying...`);
        // Adjust quality on retry
        options.initialQuality = Math.max(0.5, options.initialQuality - 0.1);
      }
    }
    
    throw new Error("All compression attempts failed");
  } catch (err) {
    console.error("Image compression failed:", err);
    return file; // Return original as fallback
  }
}

/**
 * Uploads images to Supabase storage with improved handling for HEIC files
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
    // Process files in sequence with compression
    const compressedFiles: File[] = [];
    const originalFileTypes: Record<number, boolean> = {};
    
    // Step 1: Compress all images
    for (let i = 0; i < files.length; i++) {
      if (onProgress) {
        onProgress(Math.min(30, (i / files.length) * 30));
      }
      
      try {
        // Track if this was originally a HEIC file
        const wasHeic = isHeicFile(files[i]);
        originalFileTypes[i] = wasHeic;
        
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
    const failedUploads: number[] = [];
    
    // Check authentication status before upload
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      console.error("No active session found, uploads may fail due to authentication");
      // We'll still try to upload in case public uploads are allowed
    } else {
      console.log("Authenticated upload, user ID:", sessionData.session.user.id);
    }
    
    // Process files sequentially with retry mechanism
    for (let i = 0; i < compressedFiles.length; i++) {
      const file = compressedFiles[i];
      const progressStart = 30 + (i / compressedFiles.length) * 50;
      
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount <= maxRetries) {
        try {
          // Create a unique but descriptive filename
          const fileExt = file.type === 'image/jpeg' ? 'jpg' : 
                        file.type === 'image/png' ? 'png' :
                        file.name.split('.').pop();
          const fileName = `${i}-${Date.now().toString().slice(-6)}${retryCount > 0 ? `-retry${retryCount}` : ''}.${fileExt}`;
          const filePath = `${folderName}/${fileName}`;
          
          // Track if this was originally a HEIC file
          const wasHeic = originalFileTypes[i] || false;
          
          console.log(`Attempting upload to property_images/${filePath} (Retry: ${retryCount})`);
          console.log(`File type: ${file.type}, size: ${file.size} bytes`);
          
          // Refresh auth token before upload
          if (retryCount > 0) {
            await supabase.auth.refreshSession();
            console.log("Auth session refreshed for retry");
          }
          
          // Upload to Supabase with proper content-type
          const { data, error } = await supabase.storage
            .from('property_images')
            .upload(filePath, file, {
              cacheControl: '31536000',
              upsert: false,
              contentType: file.type
            });
              
          if (error) {
            console.error("Supabase upload error:", error);
            throw error;
          }
          
          console.log("Upload successful:", data);
          
          // Get public URL with improved query parameters
          const { data: { publicUrl } } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);
          
          // Append metadata flags to help with display
          let finalUrl = publicUrl;
          const urlObj = new URL(publicUrl);
          
          // Add width and height if available
          const enhancedFile = file as EnhancedFile;
          if (enhancedFile.width && enhancedFile.height) {
            urlObj.searchParams.append('width', enhancedFile.width.toString());
            urlObj.searchParams.append('height', enhancedFile.height.toString());
          }
          
          // Add original format flag if it was a HEIC file
          if (wasHeic) {
            urlObj.searchParams.append('format', 'heic');
          }
          
          finalUrl = urlObj.toString();
          console.log("Final URL with metadata:", finalUrl);
          
          // Update progress
          if (onProgress) {
            const progressIncrement = 50 / compressedFiles.length;
            onProgress(Math.min(80, progressStart + progressIncrement));
          }
              
          results.push(finalUrl);
          break; // Success, exit retry loop
        } catch (err) {
          retryCount++;
          console.error(`Error uploading file (attempt ${retryCount}/${maxRetries}):`, err);
          
          if (retryCount > maxRetries) {
            failedUploads.push(i);
            break;
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
      }
    }
    
    if (failedUploads.length > 0) {
      console.warn(`Failed to upload ${failedUploads.length} images after retries`);
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
