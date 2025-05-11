
// Follow this setup guide to integrate the Supabase client library for Edge Functions:
// https://supabase.com/docs/guides/functions/connect-to-supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Create a single supabase client for interacting with your database
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // CORS headers for browser access
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get URL params
    const url = new URL(req.url)
    const bucket = url.searchParams.get('bucket') || 'property_images'

    // Get query parameter to check policies
    const checkPolicies = url.searchParams.has('check_policies')

    // Test bucket access
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket(bucket)

    if (bucketError) {
      console.error("Bucket access error:", bucketError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: bucketError,
          message: `Failed to access bucket: ${bucket}`,
          step: 'getBucket'
        }),
        { 
          headers: { ...corsHeaders },
          status: 500
        }
      )
    }

    // Test listing files
    const { data: listData, error: listError } = await supabase
      .storage
      .from(bucket)
      .list()

    if (listError) {
      console.error("File listing error:", listError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: listError,
          message: `Failed to list files in bucket: ${bucket}`,
          step: 'listFiles',
          bucketInfo: bucketData
        }),
        { 
          headers: { ...corsHeaders },
          status: 500
        }
      )
    }

    // Get all storage policies for this bucket
    let policiesData = {};
    
    if (checkPolicies) {
      try {
        // Query for existing policies
        const { data: policies, error: policiesError } = await supabase
          .from('pg_policies')
          .select('*')
          .eq('tablename', 'objects')
          .eq('schemaname', 'storage');
        
        if (policiesError) {
          console.error("Error fetching policies:", policiesError);
          policiesData = { error: policiesError.message };
        } else {
          policiesData = policies || [];
        }
      } catch (e) {
        console.error("Policy check error:", e);
        policiesData = { error: e.message };
      }
    }

    // Test upload permission with a tiny file
    let uploadTest = null;
    try {
      const testContent = new Uint8Array([84, 101, 115, 116]); // "Test" in binary
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(`test-${Date.now()}.txt`, testContent, {
          contentType: 'text/plain',
          upsert: true
        });

      uploadTest = {
        success: !uploadError,
        data: uploadData,
        error: uploadError
      };

      // If successful, delete the test file
      if (!uploadError && uploadData) {
        await supabase.storage
          .from(bucket)
          .remove([uploadData.path]);
      }
    } catch (uploadErr) {
      uploadTest = {
        success: false,
        error: uploadErr.message
      };
    }

    // Return success with diagnostic data
    return new Response(
      JSON.stringify({
        success: true,
        bucket: bucketData,
        files: listData,
        fileCount: listData?.length || 0,
        policies: policiesData,
        uploadTest,
        message: `Successfully accessed storage bucket '${bucket}'`
      }),
      { 
        headers: { ...corsHeaders },
        status: 200 
      }
    )
  } catch (error) {
    console.error("Global error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: "Server error during storage test" 
      }),
      { 
        headers: { ...corsHeaders },
        status: 500
      }
    )
  }
})
