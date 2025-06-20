
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
    <div className="rounded-xl border border-black/10 bg-white p-6">
      <h2 className="text-xl font-polysans font-bold mb-4 text-[#01204b]">Property Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bedrooms */}
        <FormField 
          control={form.control} 
          name="beds" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#01204b] font-polysans font-semibold">Bedrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 3" 
                  className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-bold text-[#746d79]" 
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
              <FormLabel className="text-[#01204b] font-polysans font-semibold">Bathrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 2" 
                  className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-bold text-[#746d79]" 
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
              <FormLabel className="text-[#01204b] font-polysans font-semibold">Square Footage</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 2000" 
                  className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-bold text-[#746d79]" 
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
