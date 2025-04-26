
import React, { useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '../formSchema';
import AIHeader from './AIHeader';
import AITextArea from './AITextArea';
import ExtractButton from './ExtractButton';
import AIExtractorWrapper from './AIExtractorWrapper';
import { useAIExtractor } from './hooks/useAIExtractor';

interface AIPropertyExtractorProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const AIPropertyExtractor: React.FC<AIPropertyExtractorProps> = ({ form }) => {
  const {
    propertyText,
    setPropertyText,
    isProcessing,
    fetchCohereApiKey,
    extractPropertyDetails
  } = useAIExtractor(form);

  useEffect(() => {
    fetchCohereApiKey();
  }, []);

  return (
    <AIExtractorWrapper>
      <AIHeader />
      <AITextArea 
        value={propertyText}
        onChange={(e) => setPropertyText(e.target.value)}
        isProcessing={isProcessing}
      />
      <ExtractButton 
        isProcessing={isProcessing}
        onClick={extractPropertyDetails}
        disabled={isProcessing || !propertyText.trim()}
      />
    </AIExtractorWrapper>
  );
};

export default AIPropertyExtractor;
