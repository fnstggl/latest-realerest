
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm shadow-sm layer-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white/30 backdrop-blur-md text-primary-foreground hover:bg-white/40 border border-white/30",
        secondary:
          "border-transparent bg-white/20 backdrop-blur-md text-secondary-foreground hover:bg-white/30 border border-white/20",
        destructive:
          "border-transparent bg-white/20 backdrop-blur-md text-destructive-foreground hover:bg-white/30 border border-white/20",
        outline: "text-foreground border border-white/30 bg-white/10 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} style={style} {...props} />
  )
}

export { Badge, badgeVariants }
