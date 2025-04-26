
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from 'framer-motion';

interface AITextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isProcessing: boolean;
}

const AITextArea = ({ value, onChange, isProcessing }: AITextAreaProps) => {
  return (
    <div className="relative">
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#0894FF] via-[#C959DD] to-[#FF2E54] z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      <Textarea 
        value={value}
        onChange={onChange}
        placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
        className={`min-h-[120px] bg-white relative z-10 transition-all ${isProcessing ? 'border-transparent' : 'border-gray-200 hover:border-gray-300'}`}
      />
    </div>
  );
};

export default AITextArea;
