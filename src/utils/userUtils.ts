
import { supabase } from '@/integrations/supabase/client';

/**
 * Get user display name with better error handling
 */
export const getUserDisplayName = async (userId: string): Promise<string> => {
  try {
    console.log(`Attempting to get display name for user ID: ${userId}`);
    
    // First try to get the profile name directly
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error(`Error fetching profile for ${userId}:`, profileError);
    }
    
    if (profileData?.name) {
      console.log(`Found profile name for ${userId}:`, profileData.name);
      return profileData.name;
    }
    
    if (profileData?.email) {
      console.log(`No profile name found for ${userId}, using email:`, profileData.email);
      return profileData.email;
    }
    
    // If no profile found or no name, get the email as fallback
    console.log(`No profile found for user ID: ${userId}, falling back to email via RPC`);
    const { data: userData, error: userError } = await supabase.rpc('get_user_email', {
      user_id_param: userId
    });
    
    if (userError) {
      console.error(`Error getting email for ${userId}:`, userError);
    }
    
    if (userData) {
      console.log(`Retrieved email for ${userId}:`, userData);
      return userData;
    }
    
    console.warn(`Could not find any identifying information for user ${userId}`);
    return "Unknown User";
  } catch (error) {
    console.error(`Error getting user display name for ${userId}:`, error);
    return "Unknown User";
  }
};
