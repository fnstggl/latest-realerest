
import React from 'react';
import { cn } from "@/lib/utils";

interface AIExtractorWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const AIExtractorWrapper = ({ children, className }: AIExtractorWrapperProps) => {
  return (
    <div className="mb-12">
      <div className={cn("bg-white rounded-xl p-8", className)}>
        {children}
      </div>
    </div>
  );
};

export default AIExtractorWrapper;
