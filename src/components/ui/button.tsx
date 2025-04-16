
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0892D0] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white/80 text-black rounded-xl hover:bg-white/90 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] shadow-sm border border-white/40 transition-all",
        destructive: "bg-white/80 text-red-500 rounded-xl hover:bg-white/90 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] shadow-sm border border-white/40 transition-all",
        outline: "border border-white/40 bg-white/80 hover:bg-white/90 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] rounded-xl text-black shadow-sm transition-all",
        secondary: "bg-white/80 text-black rounded-xl hover:bg-white/90 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] shadow-sm border border-white/40 transition-all",
        ghost: "hover:text-[#0892D0] transition-colors",
        link: "text-black underline-offset-4 hover:underline hover:text-[#0892D0] transition-colors",
        warning: "bg-white/80 text-[#0892D0] rounded-xl hover:bg-white/90 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] shadow-sm border border-white/40 transition-all",
        glass: "bg-white/80 border border-white/40 rounded-xl hover:bg-white/90 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] text-black shadow-sm transition-all",
        navy: "bg-white/80 text-black rounded-xl hover:bg-white/90 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] shadow-sm border border-white/40 transition-all",
        red: "bg-white/80 text-black rounded-xl hover:bg-white/90 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] shadow-sm border border-white/40 transition-all",
        translucent: "bg-white/80 border border-white/40 rounded-xl text-black hover:bg-white/90 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] transition-all shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
