
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitSectionProps {
  isSubmitting: boolean;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  isSubmitting
}) => {
  return (
    <div className="pt-6 border-t border-white/20">
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full py-6 text-white font-bold text-xl rounded-xl layer-3 glass-card backdrop-blur-lg border border-white/40 hover:translate-y-[-5px] transition-all disabled:opacity-70 bg-[#d60013]"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Creating Listing...</span>
          </div>
        ) : (
          <span className="text-gradient-primary">Create Listing</span>
        )}
      </Button>
      
      {isSubmitting && (
        <p className="text-center text-sm text-gray-600 mt-4">
          Please wait, your listing is being created...
        </p>
      )}
    </div>
  );
};

export default SubmitSection;
