
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/components/UserTag';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  // Track data source and loading state for debugging
  _source?: 'cache' | 'db' | 'rpc' | 'fallback';
}

// Create a cache to store user profiles with timestamp to manage invalidation
interface CachedProfile extends UserProfile {
  timestamp: number;
}

// Set cache expiration to 5 minutes
const CACHE_EXPIRATION = 5 * 60 * 1000;
const profileCache: Record<string, CachedProfile> = {};

export const useUserProfiles = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Helper to check if cache is still valid
  const isCacheValid = (cachedProfile: CachedProfile): boolean => {
    const now = Date.now();
    return now - cachedProfile.timestamp < CACHE_EXPIRATION;
  };

  // Utility to normalize and validate user role
  const normalizeRole = (role?: string): UserRole => {
    const validRoles: UserRole[] = ['seller', 'buyer', 'wholesaler'];
    return role && validRoles.includes(role as UserRole) 
      ? role as UserRole 
      : 'buyer';
  };

  // Function to get user profile with better error handling, caching, and consistent data flow
  const getUserProfile = useCallback(async (userId: string): Promise<UserProfile> => {
    if (!userId) {
      console.error('[useUserProfiles] Called with invalid userId');
      return {
        id: 'unknown',
        name: 'Unknown User',
        email: '',
        role: 'buyer',
        _source: 'fallback'
      };
    }

    // Check cache first and return if valid
    if (profileCache[userId] && isCacheValid(profileCache[userId])) {
      console.log(`[useUserProfiles] Using cached profile for ${userId}:`, profileCache[userId]);
      return { ...profileCache[userId], _source: 'cache' };
    }

    setLoading(true);
    setError(null);
    console.log(`[useUserProfiles] Fetching profile for ${userId}`);

    try {
      // First try to get from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, account_type')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error(`[useUserProfiles] Error fetching profile for ${userId}:`, profileError);
        setError(`Error fetching profile: ${profileError.message}`);
      }

      // If we found a valid profile with a name
      if (profileData) {
        const role = normalizeRole(profileData.account_type);
        
        // CRITICAL FIX: Only use name if it exists and isn't empty
        // This ensures we don't use empty names from the database
        if (profileData.name && profileData.name.trim() !== '') {
          const userProfile: UserProfile = {
            id: userId,
            name: profileData.name.trim(),
            email: profileData.email || '',
            role,
            _source: 'db'
          };

          console.log(`[useUserProfiles] Successfully fetched profile with name for ${userId}:`, userProfile);
          
          // Cache the profile with timestamp
          profileCache[userId] = { ...userProfile, timestamp: Date.now() };
          setLoading(false);
          return userProfile;
        }
        
        // If name is empty but email exists, create a proper display name from email
        if (profileData.email) {
          const emailName = profileData.email.split('@')[0];
          const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          
          const userProfile: UserProfile = {
            id: userId,
            name: capitalizedName,
            email: profileData.email,
            role,
            _source: 'db'
          };

          console.log(`[useUserProfiles] Created name from email for ${userId}:`, userProfile);
          
          // Cache the profile with timestamp
          profileCache[userId] = { ...userProfile, timestamp: Date.now() };
          setLoading(false);
          return userProfile;
        }
      }

      // If profiles table didn't have what we need, try to get email via RPC function as fallback
      const { data: emailData, error: emailError } = await supabase.rpc('get_user_email', {
        user_id_param: userId
      });

      if (emailError) {
        console.error(`[useUserProfiles] RPC error for ${userId}:`, emailError);
        setError(`RPC error: ${emailError.message}`);
      }

      if (emailData) {
        // Create a proper display name from the email
        const emailName = emailData.split('@')[0];
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        
        const userProfile: UserProfile = {
          id: userId,
          name: capitalizedName,
          email: emailData,
          role: 'buyer',
          _source: 'rpc'
        };

        console.log(`[useUserProfiles] Created profile with name from RPC email for ${userId}:`, userProfile);
        
        // Cache the profile with timestamp
        profileCache[userId] = { ...userProfile, timestamp: Date.now() };
        setLoading(false);
        return userProfile;
      }

      // Last resort fallback
      console.warn(`[useUserProfiles] No profile data found for ${userId}, using fallback`);
      const fallbackProfile: UserProfile = {
        id: userId,
        name: 'Unknown User',
        email: '',
        role: 'buyer',
        _source: 'fallback'
      };
      
      // We still cache the fallback to prevent repeated failed lookups
      profileCache[userId] = { ...fallbackProfile, timestamp: Date.now() };
      return fallbackProfile;
    } catch (error) {
      console.error(`[useUserProfiles] Exception fetching profile for ${userId}:`, error);
      setError(`Exception: ${error instanceof Error ? error.message : String(error)}`);
      
      const fallbackProfile: UserProfile = {
        id: userId,
        name: 'Unknown User',
        email: '',
        role: 'buyer',
        _source: 'fallback'
      };
      
      return fallbackProfile;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to get multiple user profiles at once with better batching and error handling
  const getUserProfiles = useCallback(async (userIds: string[]): Promise<Record<string, UserProfile>> => {
    if (!userIds.length) {
      return {};
    }
    
    // Filter out duplicates and invalid IDs
    const uniqueUserIds = [...new Set(userIds.filter(id => !!id))];
    if (uniqueUserIds.length === 0) {
      return {};
    }
    
    // Check which profiles are cached and valid
    const now = Date.now();
    const uncachedUserIds = uniqueUserIds.filter(
      id => !profileCache[id] || !isCacheValid(profileCache[id])
    );
    
    const profiles: Record<string, UserProfile> = {};
    
    // Add cached profiles to result first
    uniqueUserIds.forEach(id => {
      if (profileCache[id] && isCacheValid(profileCache[id])) {
        profiles[id] = { ...profileCache[id], _source: 'cache' };
      }
    });
    
    if (uncachedUserIds.length === 0) {
      console.log('[useUserProfiles] All requested profiles are already in cache');
      return profiles;
    }

    setLoading(true);
    console.log(`[useUserProfiles] Fetching ${uncachedUserIds.length} uncached profiles:`, uncachedUserIds);
    
    try {
      // Fetch profiles in bulk when possible
      const { data: dbProfiles, error: dbError } = await supabase
        .from('profiles')
        .select('id, name, email, account_type')
        .in('id', uncachedUserIds);
        
      if (dbError) {
        console.error('[useUserProfiles] Error fetching multiple profiles:', dbError);
        setError(`Error fetching multiple profiles: ${dbError.message}`);
      }
      
      // Process valid profiles from database
      if (dbProfiles && dbProfiles.length > 0) {
        // Create a map of user IDs to profiles for quick lookup
        const dbProfilesMap: Record<string, any> = {};
        dbProfiles.forEach(profile => {
          if (profile && profile.id) {
            dbProfilesMap[profile.id] = profile;
          }
        });
        
        // Process each profile in the database result
        for (const userId of uncachedUserIds) {
          const dbProfile = dbProfilesMap[userId];
          
          if (dbProfile) {
            const role = normalizeRole(dbProfile.account_type);
            let userProfile: UserProfile;
            
            // CRITICAL FIX: Prioritize actual names from database over any fallback logic
            if (dbProfile.name && dbProfile.name.trim() !== '') {
              userProfile = {
                id: userId,
                name: dbProfile.name.trim(),
                email: dbProfile.email || '',
                role,
                _source: 'db'
              };
            } 
            // Only if name is truly empty/null, then fall back to email processing
            else if (dbProfile.email) {
              const emailName = dbProfile.email.split('@')[0];
              const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
              
              userProfile = {
                id: userId,
                name: capitalizedName,
                email: dbProfile.email,
                role,
                _source: 'db'
              };
            }
            // Last resort fallback
            else {
              userProfile = {
                id: userId,
                name: 'User',
                email: '',
                role,
                _source: 'fallback'
              };
            }
            
            // Add to results and cache
            profiles[userId] = userProfile;
            profileCache[userId] = { ...userProfile, timestamp: now };
          }
        }
      }
      
      // Get any remaining profiles via individual RPC calls
      const remainingUserIds = uncachedUserIds.filter(id => !profiles[id]);
      
      if (remainingUserIds.length > 0) {
        console.log(`[useUserProfiles] Fetching ${remainingUserIds.length} remaining profiles via RPC`);
        
        // Fetch remaining profiles one by one
        for (const userId of remainingUserIds) {
          const profile = await getUserProfile(userId);
          profiles[userId] = profile;
        }
      }
      
      return profiles;
    } catch (error) {
      console.error('[useUserProfiles] Error in getUserProfiles:', error);
      setError(`Failed to get user profiles: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return any cached profiles we have as fallback
      return profiles;
    } finally {
      setLoading(false);
    }
  }, [getUserProfile]);

  // Function to clear the entire cache or just for a specific userId
  const clearProfileCache = useCallback((userId?: string) => {
    if (userId) {
      if (profileCache[userId]) {
        delete profileCache[userId];
        console.log(`[useUserProfiles] Cleared profile cache for ${userId}`);
      }
    } else {
      Object.keys(profileCache).forEach(key => {
        delete profileCache[key];
      });
      console.log('[useUserProfiles] Profile cache completely cleared');
    }
  }, []);

  // Function to update a profile in the cache (useful after profile changes)
  const updateProfileCache = useCallback((profile: UserProfile) => {
    if (profile && profile.id) {
      profileCache[profile.id] = { ...profile, timestamp: Date.now() };
      console.log(`[useUserProfiles] Updated profile cache for ${profile.id}:`, profile);
    }
  }, []);

  return {
    getUserProfile,
    getUserProfiles,
    clearProfileCache,
    updateProfileCache,
    loading,
    error
  };
};
