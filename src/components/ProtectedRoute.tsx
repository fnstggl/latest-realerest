
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to access this page");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    console.log("Protected route: User not authenticated, redirecting to signin");
    // Redirect to login page with the current path as the return destination
    return <Navigate to="/signin" state={{ returnPath: location.pathname }} replace />;
  }

  console.log("Protected route: User authenticated:", user?.id);
  return <>{children}</>;
};

export default ProtectedRoute;
