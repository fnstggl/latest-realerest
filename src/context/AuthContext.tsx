
import React, { createContext, useState, useContext, ReactNode } from 'react';

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountTypeState] = useState<'buyer' | 'seller'>('buyer');

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    // For demo purposes, we're simulating a successful login
    // In a real app, this would call an API endpoint
    console.log('Logging in with:', email, password);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set mock user data
    setUser({
      id: 'user-123',
      name: 'Demo User',
      email: email,
      accountType: accountType
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // For demo purposes, we're simulating a successful signup
    // In a real app, this would call an API endpoint
    console.log('Signing up with:', name, email, password);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set mock user data
    setUser({
      id: 'user-' + Math.floor(Math.random() * 1000),
      name: name,
      email: email,
      accountType: accountType
    });
  };

  const logout = () => {
    setUser(null);
  };

  const setAccountType = (type: 'buyer' | 'seller') => {
    setAccountTypeState(type);
    
    // If user is logged in, update their account type
    if (user) {
      setUser({
        ...user,
        accountType: type
      });
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
