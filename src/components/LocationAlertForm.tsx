import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LocationAlertForm = () => {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !location) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('location_alerts')
        .insert([{ email, location }]);

      if (error) throw error;
      
      toast.success("Thanks for subscribing! We'll notify you when new properties are listed in your area.");
      setEmail('');
      setLocation('');
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center px-4">
      <h3 className="font-sans text-black font-bold mb-2">Can't find a home in your area?</h3>
      <p className="text-gray-600 mb-6">Be the first to know as soon as one's listed</p>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-xl mx-auto gap-4">
        <Input
          type="text"
          placeholder="City, State"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="translucent"
          className="w-full"
        >
          {isSubmitting ? "Processing..." : "Early Access"}
        </Button>
      </form>
    </div>
  );
};

export default LocationAlertForm;
