
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  accountType: string; // Added back temporarily to fix build errors
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isAuthenticated = !!user;
  const accountType = 'buyer'; // Default value to prevent errors

  // Set up auth state listener on mount and check for existing session
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          return;
        }
        
        if (session && session.user) {
          fetchUserProfile(session.user);
        }
      }
    );

    // Then check for existing session
    const fetchCurrentSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found existing session:', session.user.id);
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the profiles table
  const fetchUserProfile = async (supabaseUser: any) => {
    try {
      console.log('Fetching profile for user ID:', supabaseUser.id);
      
      // First try to get the profile from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If no profile exists, create a fallback user object from auth
        const newUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
          email: supabaseUser.email || ''
        };
        
        setUser(newUser);
        return;
      }

      if (profile) {
        console.log('Found profile:', profile);
        
        // Create user object from profile data
        const profileUser: User = {
          id: profile.id,
          name: profile.name || supabaseUser.user_metadata?.name || '',
          email: profile.email || supabaseUser.email || '',
        };
        
        setUser(profileUser);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Attempting to log in with:', email);
    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        
        // Check for specific error cases
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email before logging in. Check your inbox for a confirmation link.");
        } else {
          toast.error(error.message || "Login failed. Please check your credentials.");
        }
        
        throw error;
      }
      
      // User will be set by the auth state listener
      console.log('Login successful for user ID:', data.user?.id);
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log('Signing up with:', name, email);
    setIsLoading(true);
    
    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        toast.error(error.message || "Signup failed. Please try again.");
        throw error;
      }
      
      console.log('Signup successful for user ID:', data.user?.id);
      toast.success("Account created successfully! Please check your email to confirm your account.");
      
      // User will be set by the auth state listener and trigger
      return;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    
    // Sign out from Supabase
    supabase.auth.signOut().catch(error => {
      console.error('Supabase logout error:', error);
    });
    // State will be cleared by the auth state listener
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      accountType
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
