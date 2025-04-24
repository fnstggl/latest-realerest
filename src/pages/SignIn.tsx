
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const returnPath = (location.state as { returnPath?: string })?.returnPath || '/';
  
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && pageLoaded) {
      navigate(returnPath);
    }
  }, [isAuthenticated, navigate, returnPath, pageLoaded]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    if (!email || !password) {
      setLoginError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      setLoginError(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="w-full" 
            />
          </div>
          <div>
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="w-full" 
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
