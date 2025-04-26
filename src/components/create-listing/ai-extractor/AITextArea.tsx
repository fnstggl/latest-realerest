
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
          colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
          mode="flowHorizontal"
          blur="soft"
          scale={1.02}
          duration={8}
          className="opacity-60"
          style={{
            margin: '-1px',
            padding: '1px',
          }}
        />
        <Textarea 
          value={value}
          onChange={onChange}
          placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
          className="min-h-[120px] bg-white relative z-10 border-transparent focus:border-transparent focus:ring-0"
        />
      </div>
    </div>
  );
};

export default AITextArea;
