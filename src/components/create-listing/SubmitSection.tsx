import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
interface SubmitSectionProps {
  isSubmitting: boolean;
}
const SubmitSection: React.FC<SubmitSectionProps> = ({
  isSubmitting
}) => {
  return <div className="pt-6 border-t-2 border-gray-200">
      <Button type="submit" disabled={isSubmitting} className="w-full py-6 text-white font-bold text-xl rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-donedeal-navy">
        {isSubmitting ? <div className="flex items-center justify-center">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Creating Listing...</span>
          </div> : "Create Listing"}
      </Button>
      
      {isSubmitting && <p className="text-center text-sm text-gray-600 mt-4">
          Please wait, your listing is being created...
        </p>}
    </div>;
};
export default SubmitSection;