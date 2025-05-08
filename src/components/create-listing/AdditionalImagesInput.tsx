
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
    <div className="mt-4">
      <FormField
        control={form.control}
        name="additionalImagesLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700">Additional Images (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Paste a Google Drive or Dropbox link to upload more images"
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
