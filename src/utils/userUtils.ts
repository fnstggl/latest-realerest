
import { supabase } from '@/integrations/supabase/client';

/**
 * Get user display name with better error handling
 */
export const getUserDisplayName = async (userId: string): Promise<string> => {
  try {
    console.log(`Attempting to get display name for user ID: ${userId}`);
    
    if (!userId) {
      console.warn('No user ID provided to getUserDisplayName');
      return "Unknown User";
    }
    
    // First try to get the profile name directly with a single call
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
      console.log(`Using email for ${userId}:`, profileData.email);
      return profileData.email;
    }
    
    // Fallback to getting email via RPC
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

/**
 * Get user role with better error handling
 */
export const getUserRole = async (userId: string): Promise<string> => {
  try {
    console.log(`Attempting to get role for user ID: ${userId}`);
    
    if (!userId) {
      console.warn('No user ID provided to getUserRole');
      return "buyer";
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error(`Error fetching account type for ${userId}:`, profileError);
      return "buyer";
    }
    
    if (!profileData || !profileData.account_type) {
      console.warn(`No account type found for user ${userId}, defaulting to buyer`);
      return "buyer";
    }
    
    // Validate the account type
    if (["seller", "buyer", "wholesaler"].includes(profileData.account_type)) {
      console.log(`Found valid role for ${userId}:`, profileData.account_type);
      return profileData.account_type;
    }
    
    console.warn(`Invalid account type for user ${userId}: ${profileData.account_type}, defaulting to buyer`);
    return "buyer";
  } catch (error) {
    console.error(`Error getting user role for ${userId}:`, error);
    return "buyer";
  }
};
