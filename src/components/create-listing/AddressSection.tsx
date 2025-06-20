
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '@/components/create-listing/formSchema';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
interface AddressSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  form
}) => {
  return <div className="rounded-xl border border-black/10 bg-white p-6">
      <div>
        <h2 className="text-xl font-polysans font-bold mb-4 text-[#01204b]">Property Address</h2>
        <FormField control={form.control} name="address" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-[#01204b] font-polysans font-semibold">Street Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. 123 Main St" 
                  className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-semibold placeholder:text-[#746d79] placeholder:font-polysans placeholder:font-semibold" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>
      
      <div>
        <h2 className="text-xl font-polysans font-bold mb-4 my-[15px] text-[#01204b]">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="city" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-[#01204b] font-polysans font-semibold">City</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Portland" 
                    className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-semibold placeholder:text-[#746d79] placeholder:font-polysans placeholder:font-semibold" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="state" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-[#01204b] font-polysans font-semibold">State</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger 
className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-semibold text-[#746d79]"
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
                        <SelectItem 
                          key={state} 
                          value={state}
                          className="relative hover:bg-black hover:text-white transition-colors"
                        >
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="zipCode" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-[#01204b] font-polysans font-semibold">ZIP Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 97204" 
                    className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-semibold placeholder:text-[#746d79] placeholder:font-polysans placeholder:font-semibold" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </div>
        
        <FormField control={form.control} name="description" render={({
        field
      }) => <FormItem className="mt-6">
              <FormLabel className="text-[#01204b] font-polysans font-semibold">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your property..." 
                  className="min-h-[120px] rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 focus:border-2  font-polysans font-semibold placeholder:text-[#746d79] placeholder:font-polysans placeholder:font-semibold" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>
    </div>;
};

export default AddressSection;
