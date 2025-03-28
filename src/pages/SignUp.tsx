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
      // Handle signup error (e.g., display an error message)
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
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-600">Join DoneDeal to start finding your dream home.</p>
          </div>
        
          <FlatIllustration />
        
          <form onSubmit={handleSignup} className="space-y-6 mt-8">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                type="text" 
                id="name" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              Sign Up
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Already have an account? <Link to="/signin" className="text-[#ea384c] font-bold hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    
      <div className="hidden lg:block lg:w-1/2 bg-[#ea384c] p-12 text-white relative overflow-hidden">
        <h2 className="text-4xl font-bold mb-4">Find Your Dream Home</h2>
        <p className="text-lg mb-8">Discover properties below market value through DoneDeal's exclusive platform.</p>
        <img 
          src="public/lovable-uploads/d0e77653-32be-41fe-ae3e-bb2b1a0b5c93.png" 
          alt="Dream Home" 
          className="absolute bottom-0 right-0 max-w-md opacity-70"
        />
      </div>
    </div>
  );
};

export default SignUp;
