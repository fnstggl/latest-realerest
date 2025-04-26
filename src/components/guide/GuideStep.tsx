
import React from 'react';
import { cn } from "@/lib/utils";

interface GuideStepProps {
  number: number;
  title: string;
  description: string;
  position: 'left' | 'right';
  className?: string;
}

export const GuideStep: React.FC<GuideStepProps> = ({
  number,
  title,
  description,
  position,
  className
}) => {
  return (
    <div className={cn(
      "w-full md:w-[45%]",
      position === 'left' ? 'md:mr-auto' : 'md:ml-auto',
      className
    )}>
      <div className="mb-6">
        <span className="font-futura text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Step {number}
        </span>
      </div>
      <h3 className="font-playfair text-2xl font-bold italic mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};
