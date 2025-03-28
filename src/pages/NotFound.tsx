
import React from 'react';
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-donedeal-blue/30 to-donedeal-pink/30 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-donedeal-navy rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-white">404</span>
        </div>
        <h1 className="text-3xl font-bold text-donedeal-navy mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Button asChild size="lg" className="bg-donedeal-navy hover:bg-donedeal-navy/90">
          <Link to="/" className="flex items-center gap-2">
            <Home size={18} />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
