
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Show toast only when needed - don't put this in a useEffect that runs on every render
  if (!isAuthenticated) {
    // Only show toast if we're actually redirecting (not on initial load)
    if (location.state !== 'silentCheck') {
      toast.error("You must be logged in to access this page");
    }
    
    // Redirect to login page with the current path as the return destination
    return <Navigate to="/signin" state={{ returnPath: location.pathname, silent: true }} replace />;
  }

  // Only log when needed
  if (process.env.NODE_ENV === 'development') {
    console.log("Protected route: User authenticated:", user?.id);
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
