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
    // Import heic2any type to avoid TypeScript errors while keeping dynamic import
    type HeicConverter = {
      default: (options: {
        blob: Blob,
        toType?: string,
        quality?: number
      }) => Promise<Blob | Blob[]>;
    }
    
    // Dynamically import heic2any library only when needed
    const heicLib = await import('heic2any') as HeicConverter;
    
    console.log("Converting HEIC file to JPEG:", file.name);
    
    // Convert the HEIC file to JPEG blob
    const jpegBlob = await heicLib.default({
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
        // Convert HEIC to JPEG first
        const jpegFile = await convertHeicToJpeg(file);
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
    alwaysKeepResolution: false,
    onProgress: undefined
  };
  
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
}

/**
 * Uploads images to Supabase storage with compression and optimization
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
    
    // Step 2: Upload compressed files with concurrency control
    const concurrencyLimit = Math.min(3, files.length);
    const results: string[] = [];
    
    // Process files in batches
    for (let i = 0; i < compressedFiles.length; i += concurrencyLimit) {
      const batch = compressedFiles.slice(i, i + concurrencyLimit);
      const progressStart = 30 + (i / compressedFiles.length) * 50;
      
      const batchPromises = batch.map(async (file, batchIndex) => {
        try {
          // Create a unique but descriptive filename
          const fileExt = file.type === 'image/jpeg' ? 'jpg' : 
                          file.type === 'image/png' ? 'png' :
                          file.name.split('.').pop();
          const fileName = `${i + batchIndex}-${Date.now().toString().slice(-6)}.${fileExt}`;
          const filePath = `${folderName}/${fileName}`;
          
          // Extract image dimensions if possible
          let width = 0;
          let height = 0;
          
          try {
            const img = document.createElement('img');
            const loaded = new Promise<void>((resolve, reject) => {
              img.onload = () => {
                width = img.naturalWidth;
                height = img.naturalHeight;
                resolve();
              };
              img.onerror = reject;
            });
            
            img.src = URL.createObjectURL(file);
            await Promise.race([
              loaded,
              new Promise<void>(resolve => setTimeout(resolve, 1000)) // Timeout after 1s
            ]);
          } catch (e) {
            console.log('Could not extract image dimensions:', e);
          }
          
          // Add metadata for better tracking and caching
          const metadata = {
            originalName: file.name,
            contentType: file.type,
            size: file.size,
            width: width || undefined,
            height: height || undefined,
            uploadedAt: new Date().toISOString(),
            propertyId: propertyId || null,
            wasHeic: isHeicFile(files[i + batchIndex]) ? true : undefined
          };
          
          // Upload to Supabase with better caching directives
          const { data, error } = await supabase.storage
            .from('property_images')
            .upload(filePath, file, {
              cacheControl: '31536000', // 1 year cache for immutable assets
              upsert: false,
              contentType: file.type,
              duplex: 'half',
              metadata
            });
            
          if (error) {
            console.error('Error uploading image:', error);
            return null;
          }
          
          // Get public URL with query string to aid in different size rendering
          const { data: { publicUrl } } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);
          
          // Append width and height as query params if available
          const finalUrl = width && height 
            ? `${publicUrl}?w=${width}&h=${height}` 
            : publicUrl;
          
          // Update progress within batch
          if (onProgress) {
            const progressIncrement = 50 / compressedFiles.length;
            onProgress(Math.min(80, progressStart + (batchIndex / batch.length) * progressIncrement));
          }
            
          return finalUrl;
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
