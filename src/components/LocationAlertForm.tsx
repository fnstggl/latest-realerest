
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
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <h3 className="text-black font-medium mb-2">Can't find a home in your area?</h3>
      <p className="text-gray-600 mb-4">Be the first to know as soon as one's listed</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Input
          type="text"
          placeholder="City, State"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1"
          required
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="whitespace-nowrap"
        >
          {isSubmitting ? "Subscribing..." : "Get Notified"}
        </Button>
      </form>
    </div>
  );
};

export default LocationAlertForm;
