import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  accountType?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  accountType: string;
  updateUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isAuthenticated = !!user;
  const accountType = user?.accountType || 'buyer'; // Default value to prevent errors

  const updateUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching updated profile:', error);
        return;
      }
      
      if (profile) {
        setUser(prevUser => ({
          ...(prevUser || { id: session.user.id, name: '', email: session.user.email || '' }),
          accountType: profile.account_type,
          name: profile.name || prevUser?.name || '',
        }));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  useEffect(() => {
    let timeoutId: number | undefined;
    let unsubscribe: (() => void) | undefined;

    const setupAuth = async () => {
      try {
        console.log("Setting up auth state listener");
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_OUT') {
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            if (session && session.user) {
              fetchUserProfile(session.user);
            }
          }
        );

        unsubscribe = () => subscription.unsubscribe();

        timeoutId = window.setTimeout(() => {
          if (isLoading) {
            console.log('Auth loading timeout reached, forcing completion');
            setIsLoading(false);
          }
        }, 1500);

        const { data: { session } } = await supabase.auth.getSession();
          
        if (session?.user) {
          console.log('Found existing session:', session.user.id);
          fetchUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in auth setup:", error);
        setIsLoading(false);
      }
    };

    setupAuth();
    
    return () => {
      unsubscribe?.();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    
    const profileChangesChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        () => {
          updateUserData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(profileChangesChannel);
    };
  }, [user?.id]);

  const fetchUserProfile = async (supabaseUser: any) => {
    try {
      console.log('Fetching profile for user ID:', supabaseUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      const newUser: User = {
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        email: profile?.email || supabaseUser.email || '',
        accountType: profile?.account_type || 'buyer'
      };
      
      setUser(newUser);
      setIsLoading(false);
      
      if (error) {
        console.error('Error fetching profile:', error);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Attempting to log in with:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        toast.error(error.message || "Login failed. Please check your credentials.");
        throw error;
      }
      
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
      
      return;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    
    supabase.auth.signOut().catch(error => {
      console.error('Supabase logout error:', error);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-container">
          <div className="pulsing-circle" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      signup, 
      logout,
      accountType,
      updateUserData
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
