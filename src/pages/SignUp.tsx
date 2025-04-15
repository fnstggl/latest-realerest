
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setIsLoading(true);
    
    // Basic validation
    if (!name || !email || !password) {
      setSignupError("All fields are required");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setSignupError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }
    
    try {
      await signup(name, email, password);
      setSignupSuccess(true);
    } catch (error: any) {
      console.error("Signup failed:", error);
      setSignupError(error.message || "An error occurred during signup");
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
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-600">Join DoneDeal to start finding your dream home.</p>
          </div>
        
          {signupError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{signupError}</AlertDescription>
            </Alert>
          )}
          
          {signupSuccess ? (
            <div className="text-center p-6 border-4 border-green-500 rounded-md bg-green-50 mb-6 search-glow">
              <h3 className="text-xl font-bold text-green-700 mb-2">Account Created Successfully!</h3>
              <p className="mb-4">We've sent a confirmation email to your inbox. Please verify your email to complete the signup process.</p>
              <Button
                onClick={() => navigate('/signin')} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all search-glow"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-bold">Name</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:border-black focus:ring-0"
                />
              </div>
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
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#d60013] hover:bg-[#d60013]/90 text-white font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all search-glow"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Already have an account? <Link to="/signin" className="text-[#d60013] font-bold hover:underline">Log In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
