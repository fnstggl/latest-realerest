
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from 'framer-motion';
import { GlowEffect } from '@/components/ui/glow-effect';

interface AITextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isProcessing: boolean;
}

const AITextArea = ({ value, onChange, isProcessing }: AITextAreaProps) => {
  return (
    <div className="relative rounded-md">
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            className="absolute -inset-[2px] rounded-lg overflow-hidden z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlowEffect
              colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
              mode="flowHorizontal"
              blur="soft"
              duration={3}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Textarea 
        value={value}
        onChange={onChange}
        placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
        className="min-h-[120px] bg-white border-2 relative z-10"
        style={{ 
          backgroundColor: 'white',
          borderColor: isProcessing ? 'transparent' : undefined,
        }}
      />
    </div>
  );
};

export default AITextArea;
