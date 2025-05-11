
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

    // Test bucket access
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket(bucket)

    if (bucketError) {
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

    // Check policies
    const { data: policiesData, error: policiesError } = await supabase
      .rpc('get_policies_for_table', { table_name: 'objects', schema_name: 'storage' })
      .single()

    // Return success with diagnostic data
    return new Response(
      JSON.stringify({
        success: true,
        bucket: bucketData,
        files: listData,
        fileCount: listData?.length || 0,
        policies: policiesError ? 'Failed to fetch policies' : (policiesData || 'No policy data available'),
        message: `Successfully accessed storage bucket '${bucket}'`
      }),
      { 
        headers: { ...corsHeaders },
        status: 200 
      }
    )
  } catch (error) {
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
