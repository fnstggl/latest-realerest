
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 peer md:text-sm transition-all duration-300 relative z-10",
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="absolute inset-0 rounded-md opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: "transparent",
          border: "2px solid transparent",
          backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
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
Input.displayName = "Input"

export { Input }
