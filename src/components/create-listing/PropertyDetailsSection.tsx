
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '@/components/create-listing/formSchema';

interface PropertyDetailsSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({ form }) => {
  return (
    <div className="layer-1 glass-content p-6 rounded-xl backdrop-blur-sm border border-white/20 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bedrooms */}
        <FormField 
          control={form.control} 
          name="beds" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Bedrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 3" 
                  className="h-12 rounded-xl border border-white/40 bg-white/60 backdrop-blur-md" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Bathrooms */}
        <FormField 
          control={form.control} 
          name="baths" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Bathrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 2" 
                  className="h-12 rounded-xl border border-white/40 bg-white/60 backdrop-blur-md" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Square Footage */}
        <FormField 
          control={form.control} 
          name="sqft" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Square Footage</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 2000" 
                  className="h-12 rounded-xl border border-white/40 bg-white/60 backdrop-blur-md" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsSection;
