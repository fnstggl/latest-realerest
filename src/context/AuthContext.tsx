
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid'; // Correct import for UUID generation

interface User {
  id: string;
  name: string;
  email: string;
  accountType: 'buyer' | 'seller';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accountType: 'buyer' | 'seller';
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setAccountType: (type: 'buyer' | 'seller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we have user data in localStorage
const getUserFromStorage = (): User | null => {
  const userData = localStorage.getItem('donedeal_user');
  return userData ? JSON.parse(userData) : null;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getUserFromStorage());
  const [accountType, setAccountTypeState] = useState<'buyer' | 'seller'>(user?.accountType || 'buyer');

  const isAuthenticated = !!user;

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('donedeal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('donedeal_user');
    }
  }, [user]);

  // Set up auth state listener on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session && session.user) {
          // Update the user with data from Supabase auth
          const updatedUser = {
            id: session.user.id,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            accountType: accountType
          };
          setUser(updatedUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Check for existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        console.log('Found existing session:', session.user.id);
        const updatedUser = {
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          accountType: accountType
        };
        setUser(updatedUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [accountType]);

  const login = async (email: string, password: string) => {
    console.log('Attempting to log in with:', email);
    
    try {
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If Supabase auth succeeds, use that user
      if (data && data.user) {
        console.log('Supabase login successful for user ID:', data.user.id);
        
        const newUser = {
          id: data.user.id,
          name: data.user.user_metadata.name || email.split('@')[0] || '',
          email: email,
          accountType: accountType
        };
        
        setUser(newUser);
        return;
      }
      
      // If Supabase auth fails, check the error
      if (error) {
        console.error('Supabase login error:', error);
        
        // For demo purposes, if it's just an invalid credential error, fall back to demo mode
        if (error.message.includes('Invalid login credentials')) {
          console.log('Falling back to demo auth approach');
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Generate a valid UUID that will work with Supabase
          const userId = uuidv4();
          console.log('Created demo user with ID:', userId);
          
          const newUser = {
            id: userId,
            name: email.split('@')[0], // Use part of email as name
            email: email,
            accountType: accountType
          };
          
          setUser(newUser);
          return;
        }
        
        // For other errors, throw them to be handled by the caller
        throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log('Signing up with:', name, email);
    
    try {
      // Try to register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            accountType: accountType
          }
        }
      });
      
      // If Supabase signup succeeds, use that user ID
      if (data && data.user) {
        console.log('Supabase signup successful for user ID:', data.user.id);
        
        const newUser = {
          id: data.user.id,
          name: name,
          email: email,
          accountType: accountType
        };
        
        setUser(newUser);
        return;
      }
      
      // If Supabase signup fails, check the error
      if (error) {
        console.error('Supabase signup error:', error);
        
        // For demo purposes only, allow creation of a demo user
        console.log('Falling back to demo signup approach');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate a valid UUID that will work with Supabase
        const userId = uuidv4();
        console.log('Created demo user with ID:', userId);
        
        const newUser = {
          id: userId,
          name: name,
          email: email,
          accountType: accountType
        };
        
        setUser(newUser);
        return;
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    
    // Try to sign out from Supabase
    supabase.auth.signOut().catch(error => {
      console.error('Supabase logout error:', error);
    }).finally(() => {
      // Always clear the local user state
      setUser(null);
      localStorage.removeItem('donedeal_user');
    });
  };

  const setAccountType = (type: 'buyer' | 'seller') => {
    setAccountTypeState(type);
    
    // If user is logged in, update their account type
    if (user) {
      const updatedUser = {
        ...user,
        accountType: type
      };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      accountType,
      login, 
      signup, 
      logout,
      setAccountType
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
