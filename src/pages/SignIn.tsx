
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
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-donedeal-blue/20 justify-center items-center p-10">
        <div className="max-w-md">
          <FlatIllustration 
            className="w-full h-auto"
            type="house"
          />
          <h2 className="mt-8 text-3xl font-futura text-donedeal-navy text-center">
            Find Your Dream Home Below Market Value
          </h2>
          <p className="mt-4 text-donedeal-dark-gray text-center">
            Join thousands of smart homebuyers who've saved an average of 15% on their home purchase.
          </p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex justify-center items-center p-6 md:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-10 h-10 bg-donedeal-navy rounded-lg text-white flex items-center justify-center font-bold text-lg">DD</div>
                <span className="font-futura text-donedeal-navy text-xl">DoneDeal</span>
              </div>
            </Link>
            <h1 className="text-3xl font-futura text-donedeal-navy">Welcome Back</h1>
            <p className="text-donedeal-dark-gray">Sign in to your account to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-donedeal-dark-gray">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        className="h-12 rounded-lg" 
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
                    <FormLabel className="text-donedeal-dark-gray">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-12 rounded-lg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-donedeal-navy hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-donedeal-navy hover:bg-donedeal-navy/90 text-white rounded-lg font-medium"
              >
                Sign In
              </Button>
            </form>
          </Form>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 rounded-lg font-medium border-2 border-gray-200"
            onClick={() => toast.info("Social login coming soon!")}
          >
            Continue with Google
          </Button>

          <p className="text-center text-donedeal-dark-gray">
            Don't have an account?{" "}
            <Link to="/signup" className="text-donedeal-navy hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
