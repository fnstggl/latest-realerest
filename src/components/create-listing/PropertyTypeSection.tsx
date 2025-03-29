
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '@/components/create-listing/formSchema';

// Property types for the dropdown
export const propertyTypes = ["House", "Apartment", "Condo", "Townhouse", "Studio", "Land"];

interface PropertyTypeSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const PropertyTypeSection: React.FC<PropertyTypeSectionProps> = ({ form }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Property Type</h2>
      <FormField 
        control={form.control} 
        name="propertyType" 
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-bold">Select Property Type</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-12 rounded-none border-2 border-black">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border-2 border-black">
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
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
