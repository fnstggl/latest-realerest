
// Import and re-export the toast components from sonner
import { toast } from "sonner";
import * as React from "react";

type ToastProps = React.ComponentPropsWithoutRef<typeof toast>;

const useToast = () => {
  return {
    toast,
  };
};

export { useToast, toast };
