
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '@/components/create-listing/formSchema';

interface PriceSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const PriceSection: React.FC<PriceSectionProps> = ({ form }) => {
  // Calculate percent difference and round it
  const calculateDiscountPercent = () => {
    const price = Number(form.watch('price')) || 0;
    const marketPrice = Number(form.watch('marketPrice')) || 0;
    if (price && marketPrice && marketPrice > price) {
      const discount = (marketPrice - price) / marketPrice * 100;
      return Math.round(discount).toString();
    }
    return "0";
  };

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6">
      <h2 className="text-xl font-polysans font-bold mb-4 text-[#01204b]">Price Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Listing Price */}
        <FormField 
          control={form.control} 
          name="price" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#01204b] font-polysans font-semibold">Your Listing Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 450000" 
                  className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-bold text-[#746d79]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Market Price */}
        <FormField 
          control={form.control} 
          name="marketPrice" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#01204b] font-polysans font-semibold">Average Market Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 500000" 
                  className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-bold text-[#746d79]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {form.watch('price') && form.watch('marketPrice') && (
        <div className="mt-4 p-4 rounded-xl border border-black/10 bg-white">
          <p className="font-polysans font-semibold">
            Discount: <span className="text-[#ea384c]">{calculateDiscountPercent()}% below market</span>
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* After Repair Value */}
        <FormField 
          control={form.control} 
          name="afterRepairValue" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#01204b] font-polysans font-semibold">After Repair Value ($) (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 550000" 
                  className="h-12 rounded-xl border-black/10 hover:border-black focus:border-black focus:ring-0 font-polysans font-bold text-[#746d79]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Estimated Rehab Cost */}
        <FormField 
          control={form.control} 
          name="estimatedRehab" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#01204b] font-polysans font-semibold">Estimated Rehab Cost ($) (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 50000" 
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

export default PriceSection;
