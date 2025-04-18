
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
    <div className="flex min-h-screen bg-gradient-to-br from-white/10 to-purple-100/20">
      <div className="w-full p-8 flex flex-col">
        <Button 
          variant="glass" 
          className="w-fit mb-8" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        
        <div className="mx-auto w-full max-w-md bg-white/75 backdrop-blur-lg border border-white/30 p-8 rounded-xl shadow-lg">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-black">Create Account</h1>
            <p className="text-gray-600">Join Realer Estate to start finding your dream home.</p>
          </div>
        
          {signupError && (
            <Alert variant="destructive" className="mb-6 bg-white/75 backdrop-blur-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{signupError}</AlertDescription>
            </Alert>
          )}
          
          {signupSuccess ? (
            <div className="text-center p-6 bg-white/75 backdrop-blur-lg border border-green-300 rounded-md mb-6">
              <h3 className="text-xl font-bold text-green-700 mb-2">Account Created Successfully!</h3>
              <p className="mb-4 text-black">We've sent a confirmation email to your inbox. Please verify your email to complete the signup process.</p>
              <div className="gradient-border-container">
                <button
                  onClick={() => navigate('/signin')} 
                  className="gradient-border-button w-full font-futura font-bold"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-bold text-black">Name</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 bg-white border-gray-200 focus:border-gray-300 focus:ring-0"
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-bold text-black">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 bg-white border-gray-200 focus:border-gray-300 focus:ring-0"
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-bold text-black">Password</Label>
                <Input 
                  type="password" 
                  id="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 bg-white border-gray-200 focus:border-gray-300 focus:ring-0"
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>
              <div className="relative">
                <div className="gradient-border-container">
                  <button
                    type="submit"
                    className="gradient-border-button w-full font-futura font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Already have an account? <Link to="/signin" className="text-black font-bold hover:underline">Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
