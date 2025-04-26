
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

interface ExtractButtonProps {
  isProcessing: boolean;
  onClick: () => void;
  disabled: boolean;
}

const ExtractButton = ({ isProcessing, onClick, disabled }: ExtractButtonProps) => {
  return (
    <div className="flex justify-end mt-4">
      <Button
        type="button" 
        onClick={onClick}
        disabled={disabled}
        className="relative group"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-bold">Extracting...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className="font-bold">Extract Details</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default ExtractButton;
