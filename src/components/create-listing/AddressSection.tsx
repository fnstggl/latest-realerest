
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '@/components/create-listing/formSchema';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="rounded-xl border border-black/10 bg-white p-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Property Address</h2>
        <FormField 
          control={form.control} 
          name="address" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Full Property Address</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    placeholder="e.g. 123 Main St" 
                    className="h-12 rounded-xl border-black/10 focus:border-transparent transition-all duration-300" 
                    {...field} 
                  />
                </FormControl>
                <span className="absolute inset-0 rounded-xl opacity-0 peer-focus:opacity-100 pointer-events-none transition-opacity"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField 
            control={form.control} 
            name="city" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">City</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Portland" 
                    className="h-12 rounded-xl border-black/10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                    <SelectTrigger className="h-12 rounded-xl border-black/10 hover:border-transparent transition-all duration-300">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl max-h-[280px] bg-white border border-black/10">
                    {usStates.map((state) => (
                      <SelectItem 
                        key={state} 
                        value={state}
                        className="relative hover:bg-transparent focus:bg-transparent active:bg-transparent group"
                      >
                        {state}
                        <span 
                          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                          style={{
                            background: "transparent",
                            border: "2px solid transparent",
                            backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                            backgroundOrigin: "border-box",
                            backgroundClip: "border-box",
                            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude"
                          }}
                        />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField 
            control={form.control} 
            name="zipCode" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">ZIP Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 97204" 
                    className="h-12 rounded-xl border-black/10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField 
          control={form.control} 
          name="description" 
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel className="text-black font-bold">Description</FormLabel>
              <div className="relative">
                <FormControl>
                  <Textarea 
                    placeholder="Describe your property..." 
                    className="min-h-[120px] rounded-xl border-black/10 focus:border-transparent transition-all duration-300" 
                    {...field} 
                  />
                </FormControl>
                <span className="absolute inset-0 rounded-xl opacity-0 peer-focus:opacity-100 pointer-events-none transition-opacity"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressSection;
