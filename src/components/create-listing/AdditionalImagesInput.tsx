
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';
import { z } from "zod";
import { formSchema } from './formSchema';

interface AdditionalImagesInputProps {
  form: {
    control: Control<z.infer<typeof formSchema>>;
    setValue: (name: string, value: any) => void;
    watch: (name: string) => any;
  }
}

const AdditionalImagesInput: React.FC<AdditionalImagesInputProps> = ({ form }) => {
  return (
    <div className="p-6 rounded-xl border border-black/10 bg-white mt-6">
      <FormField
        control={form.control}
        name="additionalImagesLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Additional Images (Optional)</FormLabel>
            <div className="text-sm text-gray-600 mb-4">
              If you have many images or large HEIC/iPhone photos, you can share them through a link instead.
            </div>
            <FormControl>
              <Input
                placeholder="Paste a Google Drive, Dropbox, or other image sharing link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalImagesInput;
