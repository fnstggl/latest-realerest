
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FlatIllustration from "@/components/FlatIllustration";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This would be replaced with actual authentication logic
    console.log(values);
    toast.success("Successfully signed in!");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-white justify-center items-center p-10">
        <div className="max-w-md">
          <FlatIllustration 
            className="w-full h-auto"
          />
          <h2 className="mt-8 text-3xl font-bold text-black">
            Find Your Dream Home Below Market Value
          </h2>
          <p className="mt-4 text-black">
            Join thousands of smart homebuyers who've saved an average of 15% on their home purchase.
          </p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex justify-center items-center p-6 md:p-10 relative">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 p-2 text-black hover:bg-[#ea384c]/10 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-1" size={20} />
          <span>Back</span>
        </Button>

        <div className="w-full max-w-md space-y-6 p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-10 h-10 bg-[#ea384c] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black">DD</div>
                <span className="font-bold text-black text-xl">DoneDeal</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
            <p className="text-black">Sign in to your account to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-bold">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        className="h-12 rounded-none border-2 border-black focus:ring-[#ea384c]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-bold">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-12 rounded-none border-2 border-black focus:ring-[#ea384c]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-[#ea384c] hover:underline font-bold">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#ea384c] hover:bg-[#ea384c]/90 text-white rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Sign In
              </Button>
            </form>
          </Form>

          <div className="relative flex items-center">
            <div className="flex-grow border-t-2 border-black"></div>
            <span className="flex-shrink mx-4 text-black font-bold">or</span>
            <div className="flex-grow border-t-2 border-black"></div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            onClick={() => toast.info("Social login coming soon!")}
          >
            Continue with Google
          </Button>

          <p className="text-center text-black">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#ea384c] hover:underline font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
