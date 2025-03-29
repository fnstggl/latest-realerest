
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '@/components/create-listing/formSchema';

interface ComparableSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const ComparableSection: React.FC<ComparableSectionProps> = ({ form }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Comparable Properties (Optional)</h2>
      <div className="space-y-4">
        {/* Comparable Address 1 */}
        <FormField 
          control={form.control} 
          name="comparableAddress1" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Comparable Address 1</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter address" 
                  className="h-12 rounded-none border-2 border-black" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Comparable Address 2 */}
        <FormField 
          control={form.control} 
          name="comparableAddress2" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Comparable Address 2</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter address" 
                  className="h-12 rounded-none border-2 border-black" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Comparable Address 3 */}
        <FormField 
          control={form.control} 
          name="comparableAddress3" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-bold">Comparable Address 3</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter address" 
                  className="h-12 rounded-none border-2 border-black" 
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

export default ComparableSection;
