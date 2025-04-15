
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Extract return path from location state, if present
  const returnPath = (location.state as { returnPath?: string })?.returnPath || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnPath);
    }
  }, [isAuthenticated, navigate, returnPath]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setLoginError("Email and password are required");
      setIsLoading(false);
      return;
    }
    
    try {
      await login(email, password);
      // No need for navigation here; the useEffect will handle it
    } catch (error: any) {
      setLoginError(error.message || "Failed to sign in");
      // We don't need to call toast.error here since it's already called in the login function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full p-8 flex flex-col">
        <Button 
          variant="ghost" 
          className="w-fit mb-8 font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all search-glow"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to DoneDeal.</p>
          </div>
        
          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <Label htmlFor="email" className="font-bold">Email</Label>
              <Input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:border-black focus:ring-0"
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-bold">Password</Label>
              <Input 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:border-black focus:ring-0"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-[#d60013] hover:bg-[#d60013]/90 text-white font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all search-glow"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Don't have an account? <Link to="/signup" className="text-[#d60013] font-bold hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
