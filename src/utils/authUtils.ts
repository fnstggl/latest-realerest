
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Validates authentication and returns current session details
 * Returns null if not authenticated
 */
export const validateAuthState = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Auth validation error:", error);
      return null;
    }
    
    if (!data.session || !data.session.user) {
      console.warn("No active session found during auth validation");
      return null;
    }
    
    return data.session;
  } catch (err) {
    console.error("Exception in auth validation:", err);
    return null;
  }
};

/**
 * Checks if the user is fully authenticated and returns user data
 * Shows toast notification if not authenticated
 */
export const ensureAuthenticated = async (showToast = true) => {
  const session = await validateAuthState();
  
  if (!session || !session.user) {
    if (showToast) {
      toast.error("Authentication required. Please sign in to continue.");
    }
    return null;
  }
  
  return session.user;
};
