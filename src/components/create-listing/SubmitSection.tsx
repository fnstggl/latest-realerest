
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
        className="w-full py-6 bg-white text-black font-bold text-xl rounded-xl border border-transparent hover:border-transparent transition-all disabled:opacity-70 relative group overflow-hidden"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Creating Listing...</span>
          </div>
        ) : (
          <span className="relative z-10 text-gradient-static">Create Listing</span>
        )}
        
        {/* Rainbow border hover effect */}
        <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" style={{
          background: "transparent",
          padding: "1px",
          border: "2px solid transparent",
          backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)",
          filter: "blur(0.5px)"
        }}></span>
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
