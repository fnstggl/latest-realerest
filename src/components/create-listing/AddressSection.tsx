
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '@/components/create-listing/formSchema';

// List of US states
export const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

interface AddressSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const AddressSection: React.FC<AddressSectionProps> = ({ form }) => {
  return (
    <div className="layer-1 glass-content p-6 rounded-xl backdrop-blur-sm border border-white/20 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Property Address</h2>
        <FormField 
          control={form.control} 
          name="address" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Full Property Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. 123 Main St" 
                  className="h-12 rounded-xl border border-white/40 bg-white/60 backdrop-blur-md" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* City field */}
          <FormField 
            control={form.control} 
            name="city" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">City</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Portland" 
                    className="h-12 rounded-xl border border-white/40 bg-white/60 backdrop-blur-md" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* State field */}
          <FormField 
            control={form.control} 
            name="state" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">State</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-xl border border-white/40 bg-white/60 backdrop-blur-md">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white/90 backdrop-blur-md border border-white/40 rounded-xl max-h-[280px]">
                    {usStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* ZIP Code field */}
          <FormField 
            control={form.control} 
            name="zipCode" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">ZIP Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 97204" 
                    className="h-12 rounded-xl border border-white/40 bg-white/60 backdrop-blur-md" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Description textarea */}
        <FormField 
          control={form.control} 
          name="description" 
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel className="text-black font-bold">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your property..." 
                  className="min-h-[120px] rounded-xl border border-white/40 bg-white/60 backdrop-blur-md" 
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

import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default AddressSection;
