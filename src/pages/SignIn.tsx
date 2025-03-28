import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import FlatIllustration from '@/components/FlatIllustration';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 p-8 flex flex-col">
        <Button 
          variant="ghost" 
          className="w-fit mb-8 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Log In</h1>
            <p className="text-gray-600">Welcome back! Please log in to continue.</p>
          </div>
          
          <FlatIllustration />
          
          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              Log In
            </Button>
            
            <p className="text-sm text-center">
              Don't have an account? <Link to="/signup" className="text-[#ea384c] font-bold hover:underline">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 bg-[#ea384c] p-12 text-white relative overflow-hidden">
        <h2 className="text-3xl font-bold mb-4">DoneDeal</h2>
        <p className="text-lg mb-8">Find your dream home at the right price.</p>
        <img 
          src="public/lovable-uploads/59f79997-a99c-4099-9789-64564594a98a.png" 
          alt="Hero" 
          className="absolute bottom-0 right-0 max-w-md"
        />
      </div>
    </div>
  );
};

export default SignIn;
