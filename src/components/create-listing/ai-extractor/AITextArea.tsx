
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { GlowEffect } from '@/components/ui/glow-effect';

interface AITextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AITextArea = ({ value, onChange }: AITextAreaProps) => {
  return (
    <div className="relative">
      <div className="relative rounded-md overflow-hidden">
        <GlowEffect
          colors={['#3C79F5', '#6C42F5', '#D946EF', '#FF5C00', '#FF3CAC']}
          mode="flowHorizontal"
          blur="soft"
          scale={1.02}
          duration={8}
        />
        <Textarea 
          value={value}
          onChange={onChange}
          placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
          className="min-h-[120px] bg-white/80 backdrop-blur-sm border-gray-300 hover:border-gray-400 focus:border-gray-500 relative z-10"
        />
      </div>
    </div>
  );
};

export default AITextArea;
