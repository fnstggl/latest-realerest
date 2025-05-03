
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type UserRole = 'seller' | 'buyer' | 'wholesaler';

// Create a cache to store user profiles to avoid repeated fetches
const profileCache: Record<string, UserProfile> = {};

export const useUserProfiles = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Function to get user profile with better error handling and caching
  const getUserProfile = useCallback(async (userId: string): Promise<UserProfile> => {
    // Return from cache if available to prevent duplicate requests
    if (profileCache[userId]) {
      console.log(`[useUserProfiles] Using cached profile for ${userId}:`, profileCache[userId]);
      return profileCache[userId];
    }

    setLoading(true);
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
      }

      // If we have profile data
      if (profileData) {
        // Validate role to ensure it's a valid UserRole type
        const validRoles: UserRole[] = ['buyer', 'seller', 'wholesaler'];
        const role: UserRole = validRoles.includes(profileData.account_type as UserRole) 
          ? profileData.account_type as UserRole
          : 'buyer';
        
        // IMPORTANT FIX: Use name if it exists, don't fallback to email when name exists
        // Only fallback to email if name is null or an empty string
        const displayName = profileData.name && profileData.name.trim() !== '' 
          ? profileData.name 
          : (profileData.email || 'Unknown User');

        const userProfile: UserProfile = {
          id: userId,
          name: displayName,
          email: profileData.email || '',
          role: role
        };

        console.log(`[useUserProfiles] Successfully fetched profile for ${userId}:`, userProfile);
        
        // Cache the profile
        profileCache[userId] = userProfile;
        setLoading(false);
        return userProfile;
      }

      // If profiles table didn't have what we need, try to get email via RPC function as fallback
      const { data: emailData, error: emailError } = await supabase.rpc('get_user_email', {
        user_id_param: userId
      });

      if (emailError) {
        console.error(`[useUserProfiles] RPC error for ${userId}:`, emailError);
      }

      if (emailData) {
        const userProfile: UserProfile = {
          id: userId,
          name: emailData, // This is the email, but it's better than nothing
          email: emailData,
          role: 'buyer' // Default role when we only have email
        };

        console.log(`[useUserProfiles] Fetched profile via RPC for ${userId}:`, userProfile);
        
        // Cache the profile
        profileCache[userId] = userProfile;
        setLoading(false);
        return userProfile;
      }

      // Last resort fallback
      console.warn(`[useUserProfiles] No profile data found for ${userId}, using fallback`);
      const fallbackProfile: UserProfile = {
        id: userId,
        name: 'Unknown User',
        email: '',
        role: 'buyer'
      };
      
      // We still cache the fallback to prevent repeated failed lookups
      profileCache[userId] = fallbackProfile;
      return fallbackProfile;
    } catch (error) {
      console.error(`[useUserProfiles] Exception fetching profile for ${userId}:`, error);
      
      const fallbackProfile: UserProfile = {
        id: userId,
        name: 'Unknown User',
        email: '',
        role: 'buyer'
      };
      
      return fallbackProfile;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to get multiple user profiles at once
  const getUserProfiles = useCallback(async (userIds: string[]): Promise<Record<string, UserProfile>> => {
    // Filter out duplicates and already cached profiles
    const uniqueUserIds = [...new Set(userIds)];
    const uncachedUserIds = uniqueUserIds.filter(id => !profileCache[id]);
    
    if (uncachedUserIds.length === 0) {
      console.log('[useUserProfiles] All requested profiles are already in cache');
      const requestedProfiles: Record<string, UserProfile> = {};
      uniqueUserIds.forEach(id => {
        requestedProfiles[id] = profileCache[id];
      });
      return requestedProfiles;
    }

    console.log(`[useUserProfiles] Fetching ${uncachedUserIds.length} uncached profiles`);
    
    // Create a map to store the results
    const profiles: Record<string, UserProfile> = {};
    
    // Fetch each user profile
    for (const userId of uncachedUserIds) {
      const profile = await getUserProfile(userId);
      profiles[userId] = profile;
    }
    
    // Combine with cached profiles
    uniqueUserIds.forEach(id => {
      if (!profiles[id] && profileCache[id]) {
        profiles[id] = profileCache[id];
      }
    });
    
    return profiles;
  }, [getUserProfile]);

  // Clear the cache function - useful when testing or when data might be stale
  const clearProfileCache = useCallback(() => {
    Object.keys(profileCache).forEach(key => {
      delete profileCache[key];
    });
    console.log('[useUserProfiles] Profile cache cleared');
  }, []);

  return {
    getUserProfile,
    getUserProfiles,
    clearProfileCache,
    loading
  };
};
