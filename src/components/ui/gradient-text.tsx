
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
        "relative inline-block",
        className
      )}
      {...props}
    >
      <span className="bg-gradient-to-r from-[#0892D0] via-[#3C79F5] via-[#6C42F5] via-[#D946EF] via-[#FF5C00] to-[#FF3CAC] bg-clip-text text-transparent bg-[length:200%] animate-gradient-text">
        {children}
      </span>
    </motion.div>
  );
}

export { GradientText }
