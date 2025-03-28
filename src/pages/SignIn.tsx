
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
    <div className="flex min-h-screen bg-white">
      <div className="w-full lg:w-1/2 p-8 flex flex-col">
        <Button 
          variant="ghost" 
          className="w-fit mb-8 font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
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
          
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8 bg-white">
            <FlatIllustration />
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
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
            
            <Button className="w-full bg-[#d60013] hover:bg-[#d60013]/90 text-white font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              Log In
            </Button>
            
            <p className="text-sm text-center">
              Don't have an account? <Link to="/signup" className="text-[#d60013] font-bold hover:underline">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 bg-white p-12 text-black relative overflow-hidden border-l-4 border-black">
        <h2 className="text-3xl font-bold mb-4">DoneDeal</h2>
        <p className="text-lg mb-8">Find your dream home at the right price.</p>
        
        <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 bg-[#d60013] text-white">
          <h3 className="text-2xl font-bold mb-4">Why Use DoneDeal?</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="font-bold mr-2">✓</span>
              <span>Access exclusive below-market properties</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">✓</span>
              <span>Connect directly with sellers</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">✓</span>
              <span>Save thousands on your dream home</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">✓</span>
              <span>Simple, transparent process</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
