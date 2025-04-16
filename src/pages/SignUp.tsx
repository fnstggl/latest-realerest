
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
          className="w-fit mb-8 property-card-glow"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        
        <div className="mx-auto w-full max-w-md glass-card backdrop-blur-lg border border-white/30 p-8 rounded-xl shadow-lg property-card-glow">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-black">Create Account</h1>
            <p className="text-gray-600">Join DoneDeal to start finding your dream home.</p>
          </div>
        
          {signupError && (
            <Alert variant="destructive" className="mb-6 glass backdrop-blur-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{signupError}</AlertDescription>
            </Alert>
          )}
          
          {signupSuccess ? (
            <div className="text-center p-6 glass backdrop-blur-lg border border-green-300 rounded-md mb-6 property-card-glow">
              <h3 className="text-xl font-bold text-green-700 mb-2">Account Created Successfully!</h3>
              <p className="mb-4 text-black">We've sent a confirmation email to your inbox. Please verify your email to complete the signup process.</p>
              <Button
                onClick={() => navigate('/signin')} 
                className="property-card-glow glass-button-primary text-white font-bold"
              >
                Go to Login
              </Button>
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
                  className="mt-2 glass-input"
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
                  className="mt-2 glass-input"
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
                  className="mt-2 glass-input"
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>
              <Button 
                type="submit"
                className="w-full property-card-glow glass-button-primary text-white font-bold"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Already have an account? <Link to="/signin" className="text-black font-bold hover:underline rainbow-text">Log In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
