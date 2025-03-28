
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    // For demo purposes, we're simulating a successful login
    // In a real app, this would call an API endpoint
    console.log('Logging in with:', email, password);
    
    try {
      // In a real app, this would verify with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock user data
      const newUser = {
        id: 'user-123',
        name: email.split('@')[0], // Use part of email as name
        email: email,
        accountType: accountType
      };
      
      setUser(newUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // For demo purposes, we're simulating a successful signup
    // In a real app, this would call an API endpoint
    console.log('Signing up with:', name, email, password);
    
    try {
      // In a real app, this would register with Supabase
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
      
      if (error) throw error;
      
      // Set mock user data
      const newUser = {
        id: 'user-' + Math.floor(Math.random() * 1000),
        name: name,
        email: email,
        accountType: accountType
      };
      
      setUser(newUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    // In a real app, this would sign out from Supabase
    supabase.auth.signOut().then(() => {
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
