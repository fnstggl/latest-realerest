
"use client"
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

function GradientText({
  className,
  children,
  as: Component = "span",
  ...props
}: GradientTextProps) {
  return (
    <motion.div
      className={cn(
        "relative inline-flex overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute inset-0">
        <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-gradient-1 bg-[#3C79F5] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-gradient-2 bg-[#6C42F5] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-gradient-3 bg-[#D946EF] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-gradient-4 bg-[#FF3CAC] mix-blend-overlay blur-[1rem]"></span>
      </span>
    </motion.div>
  );
}

export { GradientText }
