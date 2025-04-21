
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50 peer md:text-sm transition-all duration-300 relative z-10",
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="absolute inset-0 rounded-md opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: "transparent",
          border: "2px solid #000", // Bold black border when focused
          backgroundOrigin: "border-box",
          backgroundClip: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }} />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
