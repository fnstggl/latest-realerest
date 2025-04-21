
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-black focus:border-black focus:outline-none focus:ring-0 focus:border-black disabled:cursor-not-allowed disabled:opacity-50 peer transition-colors duration-300 relative z-10",
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="absolute inset-0 rounded-md opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: "transparent",
          border: "2px solid #000", // Black border when focused
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
