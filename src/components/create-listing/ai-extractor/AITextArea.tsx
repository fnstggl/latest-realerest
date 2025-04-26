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
      <div className="relative w-full group p-[5px] rounded-xl">
        <div className="absolute inset-0 rounded-xl overflow-hidden z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <GlowEffect
            colors={['#00FFA3', '#DC1FFF', '#FFB800']}
            mode="breathe"
            blur="medium"
            scale={1.1}
            duration={7}
            edgeFade={2}
          />
        </div>
        
        <div className="relative z-10 rounded-xl overflow-hidden">
          <Textarea 
            value={value}
            onChange={onChange}
            placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
            className="w-full px-6 py-4 min-h-[120px] text-lg bg-white border border-black text-foreground rounded-xl focus:border-black"
            style={{ backgroundColor: 'white' }}
          />
        </div>
        
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              className="absolute inset-0 rounded-xl overflow-hidden z-0 pointer-events-none"
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
                scale={1.1}
                edgeFade={2}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AITextArea;
