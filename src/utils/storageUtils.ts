
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures a storage bucket exists with appropriate policies
 */
export const ensureStorageBucketExists = async (bucketName: string = 'property_images') => {
  try {
    // Check if bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket(bucketName);
    
    if (bucketError) {
      if (bucketError.message.includes('not found')) {
        // Create the bucket
        const { data, error } = await supabase.storage
          .createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760 // 10MB limit
          });
        
        if (error) {
          console.error(`Failed to create bucket ${bucketName}:`, error);
          return { success: false, error };
        }
        
        console.log(`Created bucket ${bucketName}:`, data);
        return { success: true, created: true, bucket: data };
      } else {
        console.error(`Error checking bucket ${bucketName}:`, bucketError);
        return { success: false, error: bucketError };
      }
    }
    
    console.log(`Bucket ${bucketName} already exists:`, bucketData);
    return { success: true, created: false, bucket: bucketData };
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return { success: false, error };
  }
};
