
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

interface SubmitSectionProps {
  isSubmitting: boolean;
  hasAuthError?: boolean;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  isSubmitting,
  hasAuthError = false
}) => {
  return (
    <div className="pt-6 border-t border-white/20">
      <button 
        type="submit" 
        disabled={isSubmitting || hasAuthError} 
        className="w-full py-6 text-xl rounded-xl disabled:opacity-70 relative bg-white text-[#01204b] group"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Creating Listing...</span>
          </div>
        ) : hasAuthError ? (
          <div className="flex items-center justify-center">
            <AlertCircle size={24} className="mr-2 text-red-500" />
            <span>Authentication Required</span>
          </div>
        ) : (
          <span className="relative z-10 font-polysans font-bold">Create Listing</span>
        )}
        
        <span 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: "transparent",
            border: "2px solid #fd4801",
            backgroundImage: "none",
            backgroundOrigin: "border-box",
            backgroundClip: "border-box",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow: "0 0 15px rgba(253, 72, 1, 0.5)"
          }}
        ></span>
      </button>
      
      {isSubmitting && (
        <p className="text-center text-sm text-gray-600 mt-4">
          Please wait, your listing is being created...
        </p>
      )}
      
      {hasAuthError && !isSubmitting && (
        <p className="text-center text-sm text-red-500 mt-4">
          Please resolve the authentication issue above before submitting.
        </p>
      )}
    </div>
  );
};

export default SubmitSection;
