
import { supabase } from '@/integrations/supabase/client';

/**
 * Tests access to a Supabase storage bucket and returns diagnostic information
 * Useful for troubleshooting storage access issues
 */
export const testStorageBucketAccess = async (bucketName: string = 'property_images') => {
  try {
    // First, check if we can access the bucket directly
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket(bucketName);
    
    if (bucketError) {
      console.error(`Error accessing bucket ${bucketName}:`, bucketError);
    } else {
      console.log(`Successfully accessed bucket ${bucketName}:`, bucketData);
    }
    
    // Next, try to list files in the bucket
    const { data: listData, error: listError } = await supabase.storage
      .from(bucketName)
      .list();
    
    if (listError) {
      console.error(`Error listing files in bucket ${bucketName}:`, listError);
    } else {
      console.log(`Successfully listed ${listData?.length || 0} files in bucket ${bucketName}`);
    }
    
    // Try uploading a small test file
    const testContent = new Blob(['test content'], { type: 'text/plain' });
    const testFile = new File([testContent], 'test-upload.txt', { type: 'text/plain' });
    const testPath = `test/test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testPath, testFile, {
        upsert: true,
        contentType: 'text/plain'
      });
    
    if (uploadError) {
      console.error(`Error uploading test file to ${bucketName}:`, uploadError);
    } else {
      console.log(`Successfully uploaded test file to ${bucketName}:`, uploadData);
      
      // Try to delete the test file
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([testPath]);
      
      if (deleteError) {
        console.error(`Error deleting test file from ${bucketName}:`, deleteError);
      } else {
        console.log(`Successfully deleted test file from ${bucketName}`);
      }
    }
    
    // Finally, use the edge function test for a comprehensive check
    try {
      const functionUrl = `${window.location.origin}/functions/v1/test-storage-access`;
      const url = new URL(functionUrl);
      url.searchParams.set('bucket', bucketName);
      
      const response = await fetch(url.toString());
      const diagnosticData = await response.json();
      console.log(`Edge function diagnostic results for ${bucketName}:`, diagnosticData);
      
      return {
        success: true,
        bucketName,
        directAccess: !bucketError,
        listAccess: !listError,
        uploadAccess: !uploadError,
        diagnosticData
      };
    } catch (diagError) {
      console.error(`Error running diagnostic function for ${bucketName}:`, diagError);
      
      return {
        success: false,
        bucketName,
        directAccess: !bucketError,
        listAccess: !listError,
        uploadAccess: !uploadError,
        error: diagError
      };
    }
  } catch (error) {
    console.error(`Error testing storage bucket ${bucketName}:`, error);
    return {
      success: false,
      bucketName,
      error
    };
  }
};

/**
 * Creates a storage bucket with appropriate policies if it doesn't already exist
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
            fileSizeLimit: 5242880 // 5MB limit
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
