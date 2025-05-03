
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomToastProps {
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  onClose?: () => void;
  className?: string;
}

const CustomToast = ({ 
  title, 
  description, 
  variant = "info",
  onClose, 
  className 
}: CustomToastProps) => {
  
  const getIcon = () => {
    switch (variant) {
      case "success":
        return (
          <div className="mr-3">
            <span role="img" aria-label="celebration" className="text-2xl">🎉</span>
          </div>
        );
      case "error":
        return (
          <div className="mr-3">
            <span role="img" aria-label="error" className="text-2xl">🛑</span>
          </div>
        );
      case "info":
      default:
        return (
          <div className="mr-3">
            <span role="img" aria-label="info" className="text-2xl">ℹ️</span>
          </div>
        );
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      case "info":
      default:
        return "border-blue-500";
    }
  };

  return (
    <div className={cn(
      "w-full max-w-md rounded-lg border-2 bg-white p-4 shadow-md flex items-start",
      getBorderColor(),
      className
    )}>
      {getIcon()}
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        )}
      </div>
      
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-2 rounded-full p-1 hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
      )}
    </div>
  );
};

export { CustomToast };
