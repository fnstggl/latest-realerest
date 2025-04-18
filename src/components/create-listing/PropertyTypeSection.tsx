
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
                <SelectTrigger className="h-12 rounded-xl bg-white relative border border-black/10 hover:border-transparent transition-all duration-300">
                  <SelectValue placeholder="Select property type" />
                  <span className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 pointer-events-none transition-opacity"
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
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border border-black/10 rounded-xl">
                {propertyTypes.map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="relative hover:bg-transparent focus:bg-transparent active:bg-transparent group"
                  >
                    {type}
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
    </div>
  );
};

export default PropertyTypeSection;
