
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
    <div className="relative w-full">
      <div className="relative w-full group">
        <Textarea 
          value={value}
          onChange={onChange}
          placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
          className="w-full px-6 py-4 min-h-[120px] text-lg glass-input text-foreground rounded-xl bg-white backdrop-blur-sm border-transparent transition-all duration-300 relative z-20 focus:outline-none focus:ring-0 focus:border-transparent"
        />
        
        {/* This is the glow effect that appears on hover */}
        <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <GlowEffect
            colors={['#3C79F5', '#6C42F5', '#D946EF', '#FF5C00', '#FF3CAC']}
            mode="flowHorizontal"
            blur="soft"
            scale={1.02}
            duration={5}
          />
        </div>
        
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              className="absolute inset-0 rounded-xl overflow-hidden z-0"
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
      </div>
    </div>
  );
};

export default AITextArea;
