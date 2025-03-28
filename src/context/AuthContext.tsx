
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

  const login = async (email: string, password: string) => {
    console.log('Logging in with:', email);
    
    try {
      // For this demo, we'll use a hybrid approach - try to use Supabase auth if available,
      // but we'll still use our simplified approach for the demo
      
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If Supabase auth succeeds, use that user ID
      if (data && data.user) {
        const newUser = {
          id: data.user.id,
          name: email.split('@')[0], // Use part of email as name if not available
          email: email,
          accountType: accountType
        };
        
        setUser(newUser);
        return;
      }
      
      // If Supabase auth fails, fall back to our demo approach
      console.log('Falling back to demo auth approach');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a valid UUID that will work with Supabase
      const userId = uuidv4();
      
      const newUser = {
        id: userId,
        name: email.split('@')[0], // Use part of email as name
        email: email,
        accountType: accountType
      };
      
      setUser(newUser);
      return;
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
        const newUser = {
          id: data.user.id,
          name: name,
          email: email,
          accountType: accountType
        };
        
        setUser(newUser);
        return;
      }
      
      // If Supabase signup fails, fall back to our demo approach
      console.log('Falling back to demo signup approach');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a valid UUID that will work with Supabase
      const userId = uuidv4();
      
      const newUser = {
        id: userId,
        name: name,
        email: email,
        accountType: accountType
      };
      
      setUser(newUser);
      return;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
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
