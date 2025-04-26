
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { GlowEffect } from "@/components/ui/glow-effect";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from './formSchema';
import { Tilt } from '@/components/ui/tilt';

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
      // For now we're using a mock implementation that simulates AI extraction
      // In production, this would call an API endpoint
      await mockAIExtraction(propertyText);
      toast.success("Property details extracted successfully!");
    } catch (error) {
      console.error("AI extraction error:", error);
      toast.error("Could not extract property details. Please try again or fill the form manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock function that simulates AI extraction and fills the form
  const mockAIExtraction = async (text: string) => {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Perform basic extraction using regex patterns
    // This is just a simple demonstration - a real AI would be much more sophisticated
    
    // Try to extract property type
    const propertyTypes = ['House', 'Condo', 'Apartment', 'Townhouse', 'Duplex', 'Land'];
    let foundType = '';
    for (const type of propertyTypes) {
      if (text.toLowerCase().includes(type.toLowerCase())) {
        foundType = type;
        break;
      }
    }
    if (foundType) form.setValue('propertyType', foundType);
    
    // Try to extract beds
    const bedsMatch = text.match(/(\d+)\s*bed(?:room)?s?/i);
    if (bedsMatch) form.setValue('beds', bedsMatch[1]);
    
    // Try to extract baths
    const bathsMatch = text.match(/(\d+(?:\.\d+)?)\s*bath(?:room)?s?/i);
    if (bathsMatch) form.setValue('baths', bathsMatch[1]);
    
    // Try to extract sqft
    const sqftMatch = text.match(/(\d+,?\d*)\s*sq(?:\.?\s*ft|uare\s*feet)/i);
    if (sqftMatch) form.setValue('sqft', sqftMatch[1].replace(',', ''));
    
    // Try to extract price
    const priceMatch = text.match(/\$\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand|million|m|MM)?/i);
    if (priceMatch) {
      let price = priceMatch[1].replace(/,/g, '');
      const multiplier = priceMatch[0].toLowerCase().includes('k') ? 1000 : 
                          (priceMatch[0].toLowerCase().includes('million') || 
                           priceMatch[0].toLowerCase().includes('m')) ? 1000000 : 1;
      price = String(parseFloat(price) * multiplier);
      form.setValue('price', price);
      form.setValue('marketPrice', String(parseFloat(price) * 1.1)); // Estimate 10% higher for market
    }
    
    // Try to extract address components
    const addressMatch = text.match(/(\d+\s+[A-Za-z0-9\s,\.]+)(?:,|\s+in\s+)?\s*([A-Za-z\s\.]+)(?:,|\s+)\s*([A-Z]{2})(?:,|\s+)\s*(\d{5})/i);
    if (addressMatch) {
      form.setValue('address', addressMatch[1]);
      form.setValue('city', addressMatch[2].trim());
      form.setValue('state', addressMatch[3].trim());
      form.setValue('zipCode', addressMatch[4]);
    }
    
    // Extract description
    if (text.length > 30) {
      form.setValue('description', text.slice(0, 500));
    }
  };

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <GlowEffect 
          colors={['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA']} 
          mode="colorShift" 
          blur="soft" 
          scale={1.25}
          duration={10}
        />
      </div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-[#9b87f5]" /> 
          AI Property Details Extractor
        </h2>
        
        <p className="text-sm text-gray-600 mb-4">
          Paste property details, listing information, or description and let AI extract the details for you.
        </p>
        
        <Tilt className="w-full" rotationFactor={3}>
          <div className="relative">
            <Textarea 
              value={propertyText}
              onChange={(e) => setPropertyText(e.target.value)}
              placeholder="Paste property details here... (e.g. '3 bed, 2 bath house located at 123 Main St, Portland, OR 97204. 1,800 sqft. Asking $450,000.')"
              className="min-h-[120px] rounded-xl bg-white/90 backdrop-blur-sm border-purple-200 hover:border-purple-300 focus:border-purple-400"
              disabled={isProcessing}
            />
            <div className="absolute -bottom-1 -right-1 -left-1 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
          </div>
        </Tilt>
        
        <div className="flex justify-end mt-4">
          <Button
            type="button" 
            onClick={extractPropertyDetails}
            disabled={isProcessing || propertyText.length < 50}
            className="relative group overflow-hidden rounded-xl"
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
            
            {/* Rainbow border hover effect */}
            <span 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
              style={{
                background: "transparent",
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(90deg, #9b87f5, #7E69AB 20%, #6E59A5 40%, #D6BCFA 60%, #8B5CF6 80%)",
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                boxShadow: "0 0 15px rgba(155, 135, 245, 0.5)"
              }}
            ></span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIPropertyExtractor;
