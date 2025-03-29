
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  
  // Only show toast for authentication failures when not in a loading state
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.state !== 'silentCheck') {
      toast.error("You must be logged in to access this page");
    }
  }, [isAuthenticated, isLoading, location.state]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-t-[#d60013] border-r-[#d60013] border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Only redirect when we're sure the user is not authenticated
  if (!isAuthenticated) {
    // Redirect to login page with the current path as the return destination
    return <Navigate to="/signin" state={{ returnPath: location.pathname, silent: true }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
