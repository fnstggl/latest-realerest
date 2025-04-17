
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
        className="w-full py-6 text-white font-bold text-xl rounded-xl border border-transparent hover:border-[#0892D0] hover:shadow-[0_0_15px_rgba(8,146,208,0.5)] transition-all disabled:opacity-70 bg-transparent relative overflow-hidden group"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Creating Listing...</span>
          </div>
        ) : (
          <span className="relative z-10 text-gradient-primary">Create Listing</span>
        )}
        
        {/* Rainbow border hover effect */}
        <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-radial from-[#0892D0]/30 to-transparent"></span>
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
