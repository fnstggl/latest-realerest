
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '@/components/create-listing/formSchema';

export const propertyTypes = ["House", "Apartment", "Condo", "Townhouse", "Studio", "Land"];

interface PropertyTypeSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const PropertyTypeSection: React.FC<PropertyTypeSectionProps> = ({ form }) => {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6">
      <h2 className="text-xl font-polysans font-bold mb-4 text-[#01204b]">Property Type</h2>
      <FormField 
        control={form.control} 
        name="propertyType" 
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#01204b] font-polysans font-semibold">Select Property Type</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
<SelectTrigger className="h-12 rounded-xl bg-white relative border border-black/10 hover:border-black focus:border-black focus:ring-black transition-all duration-300 font-polysans font-semibold text-[#746d79]">
                  <SelectValue placeholder="e.g. House, Apartment, etc" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border border-black/10 rounded-xl">
                {propertyTypes.map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="relative text-[#01204b] hover:bg-black/5 focus:bg-black/5 active:bg-black/5 group"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyTypeSection;
