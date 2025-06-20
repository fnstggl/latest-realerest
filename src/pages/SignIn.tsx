import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    isAuthenticated
  } = useAuth();

  // Extract return path from location state, if present
  const returnPath = (location.state as {
    returnPath?: string;
  })?.returnPath || '/dashboard';

  // Mark page as loaded once component mounts
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && pageLoaded) {
      navigate(returnPath);
    }
  }, [isAuthenticated, navigate, returnPath, pageLoaded]);
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
  return <div className="flex min-h-screen bg-gradient-to-br from-white/10 to-purple-100/20">
      <div className="w-full p-4 sm:p-6 md:p-8 flex flex-col">
        <Button variant="glass" className="w-fit mb-4 sm:mb-6 md:mb-8" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-1 sm:mr-2" size={16} />
          <span className="text-sm sm:text-base">Back</span>
        </Button>
        
        <div className="mx-auto w-full max-w-md bg-white/75 backdrop-blur-lg border border-white/30 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 font-polysans text-[#01204b]">Welcome Back</h1>
            <p className="text-gray-600 text-sm sm:text-base font-polysans-semibold">Sign in to continue to Realer Estate. It's free.</p>
          </div>
        
          {loginError && <Alert variant="destructive" className="mb-4 sm:mb-6 bg-white/75 backdrop-blur-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">{loginError}</AlertDescription>
            </Alert>}
          
          <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="email" className="font-polysans text-[#01204b] text-sm sm:text-base">Email</Label>
              <Input type="email" id="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 sm:mt-2 bg-white border-gray-200 font-polysans-semibold focus:border-gray-300 focus:ring-0 text-sm sm:text-base" />
            </div>
            <div>
              <Label htmlFor="password" className="font-polysans text-[#01204b] text-sm sm:text-base">Password</Label>
              <Input type="password" id="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 sm:mt-2 bg-white border-gray-200 font-polysans-semibold focus:border-gray-300 focus:ring-0 text-sm sm:text-base" />
            </div>
            <div className="relative">
              <div className="gradient-border-container">
                <button type="submit" disabled={isLoading} className="gradient-border-button w-full font-polysans">
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-polysans-semibold text-gray-600 text-center">
              Don't have an account? <Link to="/signup" className="text-[#01204b] font-polysans hover:text-black">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>;
};
export default SignIn;