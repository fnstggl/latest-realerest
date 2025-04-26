
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from './formSchema';
import { supabase } from '@/integrations/supabase/client';

interface AIPropertyExtractorProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const AIPropertyExtractor: React.FC<AIPropertyExtractorProps> = ({ form }) => {
  const [propertyText, setPropertyText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const fetchCohereApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-cohere-key');
        
        if (error) throw error;
        
        if (data?.apiKey) {
          setApiKey(data.apiKey);
        } else {
          toast.error("Could not retrieve Cohere API key");
        }
      } catch (error) {
        console.error("Error fetching Cohere API key:", error);
        toast.error("Failed to load API key");
      }
    };

    fetchCohereApiKey();
  }, []);

  const extractPropertyDetails = async () => {
    if (!propertyText.trim()) {
      toast.error("Please enter details about your property");
      return;
    }

    if (!apiKey) {
      toast.error("Cohere API key not available");
      return;
    }

    setIsProcessing(true);

    try {
      // First, let's extract information using regex patterns
      // This is more reliable than API for specific formats
      
      // Extract address components
      const addressMatch = propertyText.match(/([0-9]+\s+[A-Za-z\s]+(?:St|Ave|Rd|Dr|Pl|Ln|Way|Blvd|Ct)[,.\s]+[A-Za-z\s]+[,.\s]+[A-Z]{2}\s+\d{5})/i);
      if (addressMatch) {
        const fullAddress = addressMatch[0].trim();
        console.log("Extracted address:", fullAddress);
        
        // Split address into components
        const addressParts = fullAddress.split(',');
        if (addressParts.length >= 2) {
          const streetAddress = addressParts[0].trim();
          form.setValue('address', streetAddress);
          
          const locationParts = addressParts[1].trim().split(' ');
          if (locationParts.length >= 2) {
            // Extract city from second part of address
            const city = locationParts.slice(0, -2).join(' ').trim();
            form.setValue('city', city);
            
            // Extract state and zip
            const stateIndex = locationParts.length - 2;
            const zipIndex = locationParts.length - 1;
            form.setValue('state', locationParts[stateIndex].trim());
            form.setValue('zipCode', locationParts[zipIndex].trim());
          }
        }
      }
      
      // Extract beds/baths
      const bedsMatch = propertyText.match(/(\d+)\s*Beds/i);
      const bathsMatch = propertyText.match(/(\d+)\s*Baths/i);
      
      if (bedsMatch) form.setValue('beds', bedsMatch[1]);
      if (bathsMatch) form.setValue('baths', bathsMatch[1]);
      
      // Extract square footage
      const sqftMatch = propertyText.match(/(\d+(?:,\d+)?)\s*(?:SqFt|Sq\.?\s*Ft|Square\s*Feet)/i);
      if (sqftMatch) {
        const sqft = sqftMatch[1].replace(/,/g, '');
        form.setValue('sqft', sqft);
      }
      
      // Extract property type
      if (propertyText.match(/Rowhome|Row\s*home/i)) {
        form.setValue('propertyType', 'Rowhome');
      } else if (propertyText.match(/Townhouse|Town\s*house/i)) {
        form.setValue('propertyType', 'Townhouse');
      } else if (propertyText.match(/Single\s*Family|Detached/i)) {
        form.setValue('propertyType', 'Single Family');
      } else if (propertyText.match(/Condo|Condominium/i)) {
        form.setValue('propertyType', 'Condo');
      } else if (propertyText.match(/Multi-Family|Multi\s*Family|Duplex|Triplex|Quadplex/i)) {
        form.setValue('propertyType', 'Multi-Family');
      }
      
      // Extract asking price
      const askingMatch = propertyText.match(/Asking:?\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)/i);
      if (askingMatch) {
        const price = askingMatch[1].replace(/,/g, '');
        form.setValue('price', price);
        
        // Set market price slightly higher by default if we have a price
        const marketPrice = Math.round(parseFloat(price) * 1.1);
        form.setValue('marketPrice', String(marketPrice));
      }
      
      // Extract ARV (After Repair Value)
      const arvMatch = propertyText.match(/ARV:?\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*[–-]\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)/i);
      if (arvMatch) {
        const arvLow = parseFloat(arvMatch[1].replace(/,/g, ''));
        const arvHigh = parseFloat(arvMatch[2].replace(/,/g, ''));
        const arvAvg = Math.round((arvLow + arvHigh) / 2);
        form.setValue('afterRepairValue', String(arvAvg));
      }
      
      // Generate a description from the text
      form.setValue('description', 
        `${propertyText}. This property offers ${form.getValues('beds')} bedrooms and ${form.getValues('baths')} bathrooms with ${form.getValues('sqft')} square feet of living space.`
      );
      
      // Fallback to Cohere API for anything we couldn't extract with regex
      if (!addressMatch || !bedsMatch || !bathsMatch || !sqftMatch || !askingMatch) {
        console.log("Using Cohere API to supplement extraction");
        
        const response = await fetch('https://api.cohere.ai/v1/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'command-nightly',
            prompt: `Extract the following information from this real estate listing text: address, city, state, zip code, number of bedrooms, number of bathrooms, square footage, property type, asking price, and after repair value (ARV). Format the response as JSON.\n\nText: ${propertyText}\n\nJSON:`,
            max_tokens: 300,
            temperature: 0.2,
          })
        });

        if (!response.ok) {
          throw new Error(`Cohere API error: ${response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.generations[0].text;
        
        try {
          // Try to parse the generated JSON
          const startIdx = generatedText.indexOf('{');
          const endIdx = generatedText.lastIndexOf('}') + 1;
          if (startIdx >= 0 && endIdx > startIdx) {
            const jsonStr = generatedText.substring(startIdx, endIdx);
            const extractedData = JSON.parse(jsonStr);
            console.log("Extracted data from Cohere:", extractedData);
            
            // Fill in any missing values from the API response
            if (!form.getValues('address') && extractedData.address) {
              form.setValue('address', extractedData.address);
            }
            if (!form.getValues('city') && extractedData.city) {
              form.setValue('city', extractedData.city);
            }
            if (!form.getValues('state') && extractedData.state) {
              form.setValue('state', extractedData.state);
            }
            if (!form.getValues('zipCode') && extractedData.zip_code) {
              form.setValue('zipCode', extractedData.zip_code);
            }
            if (!form.getValues('beds') && extractedData.bedrooms) {
              form.setValue('beds', String(extractedData.bedrooms));
            }
            if (!form.getValues('baths') && extractedData.bathrooms) {
              form.setValue('baths', String(extractedData.bathrooms));
            }
            if (!form.getValues('sqft') && extractedData.square_footage) {
              form.setValue('sqft', String(extractedData.square_footage).replace(/,/g, ''));
            }
            if (!form.getValues('propertyType') && extractedData.property_type) {
              form.setValue('propertyType', extractedData.property_type);
            }
            if (!form.getValues('price') && extractedData.asking_price) {
              const price = String(extractedData.asking_price).replace(/[$,]/g, '');
              form.setValue('price', price);
              
              // Set market price slightly higher if we now have a price
              if (!form.getValues('marketPrice')) {
                const marketPrice = Math.round(parseFloat(price) * 1.1);
                form.setValue('marketPrice', String(marketPrice));
              }
            }
            if (!form.getValues('afterRepairValue') && extractedData.arv) {
              form.setValue('afterRepairValue', String(extractedData.arv).replace(/[$,]/g, ''));
            }
          }
        } catch (e) {
          console.error("Error parsing Cohere response:", e);
          // Continue with what we have from regex
        }
      }
      
      // Calculate estimated rehab costs if we have ARV and price
      const arv = form.getValues('afterRepairValue');
      const price = form.getValues('price');
      if (arv && price) {
        const estimatedRehab = Math.round((parseFloat(arv) - parseFloat(price)) * 0.7);
        if (estimatedRehab > 0) {
          form.setValue('estimatedRehab', String(estimatedRehab));
        }
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
          placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
          className="min-h-[120px] bg-white border-gray-300 hover:border-gray-400 focus:border-gray-500"
        />
      </div>
      
      <div className="flex justify-end mt-4">
        <Button
          type="button" 
          onClick={extractPropertyDetails}
          disabled={isProcessing || !propertyText.trim()}
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
