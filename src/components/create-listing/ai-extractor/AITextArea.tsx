
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { GlowEffect } from '@/components/ui/glow-effect';
import { motion } from 'framer-motion';

interface AITextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isProcessing: boolean;
}

const AITextArea = ({ value, onChange, isProcessing }: AITextAreaProps) => {
  return (
    <div className="relative">
      <div className="relative rounded-md">
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            opacity: isProcessing ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
        >
          <GlowEffect
            colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
            mode="colorShift"
            blur="medium"
            duration={4}
            className="opacity-60"
          />
        </motion.div>
        <Textarea 
          value={value}
          onChange={onChange}
          placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
          className="min-h-[120px] bg-white relative z-10 border border-gray-200 focus:border-gray-300 focus:ring-0 transition-colors"
        />
      </div>
    </div>
  );
};

export default AITextArea;
