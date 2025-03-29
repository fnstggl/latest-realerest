
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
  isLoading: boolean; // Add this property to the interface
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  accountType: string; // Will be removed in future refactoring
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
    const setupAuth = async () => {
      try {
        console.log("Setting up auth state listener");
        
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_OUT') {
              setUser(null);
              return;
            }
            
            if (session && session.user) {
              await fetchUserProfile(session.user);
            }
          }
        );

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
          
        if (session?.user) {
          console.log('Found existing session:', session.user.id);
          await fetchUserProfile(session.user);
        }
        
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error in auth setup:", error);
        setIsLoading(false);
      }
    };

    setupAuth();
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
        .maybeSingle();

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
      } else {
        console.log('No profile found, creating from auth data');
        
        // Create user object directly from auth data if no profile found
        const newUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
          email: supabaseUser.email || ''
        };
        
        setUser(newUser);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Attempting to log in with:', email);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        toast.error(error.message || "Login failed. Please check your credentials.");
        throw error;
      }
      
      // User will be set by the auth state listener
      console.log('Login successful for user ID:', data.user?.id);
      toast.success("Login successful!");
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log('Signing up with:', name, email);
    
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
      
      // User will be set by the auth state listener
      return;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
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

  // Don't render children until we've checked for an existing session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#d60013] border-b-[#d60013] border-l-gray-200 border-r-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, // Expose isLoading to consumers
      login, 
      signup, 
      logout,
      accountType
    }}>
      {children}
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
