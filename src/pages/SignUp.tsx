
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import FlatIllustration from '@/components/FlatIllustration';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup failed:", error);
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
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-600">Join DoneDeal to start finding your dream home.</p>
          </div>
        
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8 bg-white">
            <FlatIllustration />
          </div>
        
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
            </div>
            <Button className="w-full bg-[#d60013] hover:bg-[#d60013]/90 text-white font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              Sign Up
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Already have an account? <Link to="/signin" className="text-[#d60013] font-bold hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    
      <div className="hidden lg:block lg:w-1/2 bg-white p-12 text-black relative overflow-hidden border-l-4 border-black">
        <h2 className="text-4xl font-bold mb-4">Find Your Dream Home</h2>
        <p className="text-lg mb-8">Discover properties below market value through DoneDeal's exclusive platform.</p>
        
        <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 bg-[#d60013] text-white">
          <h3 className="text-2xl font-bold mb-4">How DoneDeal Works</h3>
          <ol className="space-y-4 list-decimal ml-5">
            <li className="pl-2">
              <span className="font-bold">Create an account</span>
              <p className="text-sm">Sign up as a buyer or seller in just minutes</p>
            </li>
            <li className="pl-2">
              <span className="font-bold">Browse properties</span>
              <p className="text-sm">Find homes below market value in your area</p>
            </li>
            <li className="pl-2">
              <span className="font-bold">Join the waitlist</span>
              <p className="text-sm">Express interest in properties you love</p>
            </li>
            <li className="pl-2">
              <span className="font-bold">Get approved</span>
              <p className="text-sm">Connect with sellers and view full property details</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
