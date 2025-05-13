
// Re-export from sonner to maintain backwards compatibility
import { toast } from "sonner";

// Export a minimal API that matches what might have been previously imported
export const useToast = () => {
  return {
    toast
  };
};

// Re-export toast directly
export { toast };
