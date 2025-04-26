
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '../formSchema';
import AIHeader from './AIHeader';
import AITextArea from './AITextArea';
import ExtractButton from './ExtractButton';
import { usePropertyExtractor } from './usePropertyExtractor';

interface AIPropertyExtractorProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const AIPropertyExtractor: React.FC<AIPropertyExtractorProps> = ({ form }) => {
  const {
    propertyText,
    setPropertyText,
    isProcessing,
    extractPropertyDetails
  } = usePropertyExtractor(form);

  return (
    <div className="mb-12">
      <div className="bg-white rounded-xl p-8">
        <AIHeader />
        <AITextArea 
          value={propertyText}
          onChange={(e) => setPropertyText(e.target.value)}
        />
        <ExtractButton 
          isProcessing={isProcessing}
          onClick={extractPropertyDetails}
          disabled={isProcessing || !propertyText.trim()}
        />
      </div>
    </div>
  );
};

export default AIPropertyExtractor;
