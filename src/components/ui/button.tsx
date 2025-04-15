
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white/30 text-primary-foreground backdrop-blur-md rounded-xl hover:bg-white/40 shadow-lg border border-white/30 rainbow-glow-hover",
        destructive: "bg-white/30 text-destructive-foreground backdrop-blur-md rounded-xl hover:bg-white/40 shadow-lg border border-white/30 rainbow-glow-hover",
        outline: "border border-white/30 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-foreground shadow-lg rainbow-glow-hover",
        secondary: "bg-white/30 text-secondary-foreground backdrop-blur-md rounded-xl hover:bg-white/40 shadow-lg border border-white/30 rainbow-glow-hover",
        ghost: "hover:bg-accent hover:text-accent-foreground rainbow-glow-hover",
        link: "text-[#FF5C00] underline-offset-4 hover:underline",
        warning: "bg-white/30 text-amber-500 backdrop-blur-md rounded-xl hover:bg-white/40 shadow-lg border border-white/30 rainbow-glow-hover",
        glass: "bg-white/30 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/40 text-foreground shadow-lg rainbow-glow-hover",
        navy: "bg-white/30 text-white backdrop-blur-md rounded-xl hover:bg-white/40 shadow-lg border border-white/30 rainbow-glow-hover",
        red: "bg-white/30 text-white backdrop-blur-md rounded-xl hover:bg-white/40 shadow-lg border border-white/30 rainbow-glow-hover",
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
