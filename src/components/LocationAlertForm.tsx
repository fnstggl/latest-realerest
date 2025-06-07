
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
      // Standardize inputs to improve matching (trim whitespace and convert to lowercase)
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedLocation = location.trim().toLowerCase();
      
      // Check if this email is already subscribed to this location
      const { data: existingAlerts, error: checkError } = await supabase
        .from('location_alerts')
        .select('id')
        .ilike('email', normalizedEmail)
        .ilike('location', normalizedLocation);
        
      if (checkError) throw checkError;
      
      if (existingAlerts && existingAlerts.length > 0) {
        toast.info(`You've already joined the early access list for ${location}`);
        setIsSubmitting(false);
        return;
      }
      
      // No duplicate found, create new alert
      const { error } = await supabase
        .from('location_alerts')
        .insert([{
          email: normalizedEmail,
          location: normalizedLocation
        }]);
        
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

  return <div className="w-full max-w-3xl mx-auto text-center px-4">
      <h3 className="font-polysans font-bold text-[#01204b] mb-2 text-base">Can't find a home in your area?</h3>
      <p className="text-gray-600 font-polysans-semibold mb-6">Be the first to know as soon as one's listed</p>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-xl mx-auto gap-4">
        <Input type="text" placeholder="City, State" value={location} onChange={e => setLocation(e.target.value)} className="focus-visible:ring-2 focus-visible:ring-[#000000e6] focus-visible:ring-opacity-20 font-polysans-semibold" required />
        <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="focus-visible:ring-2 focus-visible:ring-[#000000e6] focus-visible:ring-opacity-20 font-polysans-semibold" required />
        <div className="relative w-full rounded-full overflow-hidden">
          <Button type="submit" disabled={isSubmitting} variant="translucent" className="w-full font-polysans-semibold border-none">
            <span className="relative z-10">{isSubmitting ? "Processing..." : "Early Access"}</span>
          </Button>
          <span className="absolute inset-0 opacity-100 pointer-events-none rounded-full" style={{
          background: "transparent",
          border: "2px solid #fd4801",
          backgroundOrigin: "border-box",
          backgroundClip: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude"
        }} />
        </div>
      </form>
    </div>;
};

export default LocationAlertForm;
