
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from './formSchema';

interface AIPropertyExtractorProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const AIPropertyExtractor: React.FC<AIPropertyExtractorProps> = ({ form }) => {
  const [propertyText, setPropertyText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const extractPropertyDetails = async () => {
    if (!propertyText.trim() || propertyText.length < 50) {
      toast.error("Please enter more details about your property");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('https://api.cohere.ai/v1/classify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer jriYm6w64hIS9CruxyACLRXX5SoU9ZvoLw9Thp8O`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'embed-english-v3.0',
          inputs: [propertyText],
          examples: [
            { text: "3 bed 2 bath house at 123 Main St", label: "property_details" },
            { text: "1800 sqft, asking $450k", label: "property_metrics" },
            { text: "Portland Oregon 97204", label: "location" }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze property details');
      }

      const data = await response.json();
      
      // Extract numeric values using regex patterns
      const bedsMatch = propertyText.match(/(\d+)\s*bed(?:room)?s?/i);
      const bathsMatch = propertyText.match(/(\d+(?:\.\d+)?)\s*bath(?:room)?s?/i);
      const sqftMatch = propertyText.match(/(\d+,?\d*)\s*sq(?:\.?\s*ft|uare\s*feet)/i);
      const priceMatch = propertyText.match(/\$\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand|million|m|MM)?/i);
      const addressMatch = propertyText.match(/(\d+\s+[A-Za-z0-9\s,\.]+)(?:,|\s+in\s+)?\s*([A-Za-z\s\.]+)(?:,|\s+)\s*([A-Z]{2})(?:,|\s+)\s*(\d{5})/i);

      // Extract and set values
      if (bedsMatch) form.setValue('beds', bedsMatch[1]);
      if (bathsMatch) form.setValue('baths', bathsMatch[1]);
      if (sqftMatch) form.setValue('sqft', sqftMatch[1].replace(',', ''));
      
      if (priceMatch) {
        let price = priceMatch[1].replace(/,/g, '');
        const multiplier = priceMatch[0].toLowerCase().includes('k') ? 1000 : 
                         (priceMatch[0].toLowerCase().includes('million') || 
                          priceMatch[0].toLowerCase().includes('m')) ? 1000000 : 1;
        price = String(parseFloat(price) * multiplier);
        form.setValue('price', price);
        form.setValue('marketPrice', String(parseFloat(price) * 1.1));
      }
      
      if (addressMatch) {
        form.setValue('address', addressMatch[1]);
        form.setValue('city', addressMatch[2].trim());
        form.setValue('state', addressMatch[3].trim());
        form.setValue('zipCode', addressMatch[4]);
      }
      
      // Set description
      if (propertyText.length > 30) {
        form.setValue('description', propertyText.slice(0, 500));
      }

      toast.success("Property details extracted successfully!");
    } catch (error) {
      console.error("AI extraction error:", error);
      toast.error("Could not extract property details. Please try again or fill the form manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <Textarea 
          value={propertyText}
          onChange={(e) => setPropertyText(e.target.value)}
          placeholder="Paste property details here... (e.g. '3 bed, 2 bath house located at 123 Main St, Portland, OR 97204. 1,800 sqft. Asking $450,000.')"
          className="min-h-[120px] bg-white border-gray-300 hover:border-gray-400 focus:border-gray-500"
        />
      </div>
      
      <div className="flex justify-end mt-4">
        <Button
          type="button" 
          onClick={extractPropertyDetails}
          disabled={isProcessing || propertyText.length < 50}
          className="relative group"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Extracting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>Extract Details</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIPropertyExtractor;
