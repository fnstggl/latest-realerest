
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toast } = useToast()
  
  // Access the toast object's internal toast array directly
  // @ts-ignore - We know this exists but TypeScript doesn't
  const toasts = toast.toasts || []

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="flex items-start">
              {variant === "destructive" && (
                <div className="mr-3">
                  <span role="img" aria-label="error" className="text-2xl">🛑</span>
                </div>
              )}
              {variant === "success" && (
                <div className="mr-3">
                  <span role="img" aria-label="celebration" className="text-2xl">🎉</span>
                </div>
              )}
              {(!variant || variant === "default") && (
                <div className="mr-3">
                  <span role="img" aria-label="info" className="text-2xl">ℹ️</span>
                </div>
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
