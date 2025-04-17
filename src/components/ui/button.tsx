
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0892D0] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#0892D0] text-white rounded-lg hover:bg-[#077fb4] shadow-sm transition-all",
        destructive: "bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm transition-all",
        outline: "border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-black shadow-sm transition-all",
        secondary: "bg-gray-100 text-black rounded-lg hover:bg-gray-200 shadow-sm transition-all",
        ghost: "text-gray-700 hover:text-[#0892D0] hover:bg-gray-50 transition-colors",
        link: "text-[#0892D0] underline-offset-4 hover:underline transition-colors",
        warning: "bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm transition-all",
        glass: "bg-white border border-gray-200 rounded-lg hover:bg-white text-black shadow-sm transition-all",
        navy: "bg-[#0892D0] text-white rounded-lg hover:bg-[#077fb4] shadow-sm transition-all",
        red: "bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm transition-all",
        translucent: "bg-white border border-gray-200 rounded-lg text-black hover:bg-white transition-all shadow-sm",
        gradient: "bg-white hover:bg-white relative group overflow-hidden border border-transparent rounded-lg",
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
