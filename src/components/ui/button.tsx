
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white/40 text-black backdrop-blur-md rounded-xl hover:bg-white/50 hover:border-[#0892D0] shadow-lg border border-white/40 layer-hover layer-2",
        destructive: "bg-white/40 text-black backdrop-blur-md rounded-xl hover:bg-white/50 hover:border-[#0892D0] shadow-lg border border-white/40 layer-hover layer-2",
        outline: "border border-white/40 bg-white/30 hover:bg-white/40 hover:border-[#0892D0] backdrop-blur-md rounded-xl text-black shadow-lg layer-hover layer-1",
        secondary: "bg-white/40 text-black backdrop-blur-md rounded-xl hover:bg-white/50 hover:border-[#0892D0] shadow-lg border border-white/40 layer-hover layer-2",
        ghost: "hover:bg-accent hover:text-accent-foreground layer-hover layer-1",
        link: "text-black underline-offset-4 hover:underline hover:text-[#0892D0] layer-1",
        warning: "bg-white/40 text-[#0892D0] backdrop-blur-md rounded-xl hover:bg-white/50 hover:border-[#0892D0] shadow-lg border border-white/40 layer-hover layer-2",
        glass: "bg-white/50 backdrop-blur-md border border-white/40 rounded-xl hover:bg-white/60 hover:border-[#0892D0] text-black shadow-lg layer-hover layer-2",
        navy: "bg-white/50 text-black backdrop-blur-md rounded-xl hover:bg-white/60 hover:border-[#0892D0] shadow-lg border border-white/40 layer-hover layer-2",
        red: "bg-white/50 text-black backdrop-blur-md rounded-xl hover:bg-white/60 hover:border-[#0892D0] shadow-lg border border-white/40 layer-hover layer-2",
        translucent: "bg-white/50 backdrop-blur-md border border-white/40 rounded-xl text-black hover:bg-white/60 hover:border-[#0892D0] transition-all shadow-md layer-hover layer-2",
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
