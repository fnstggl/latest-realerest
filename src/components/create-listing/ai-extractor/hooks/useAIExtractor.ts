
import { useState, useCallback } from 'react';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '../../formSchema';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export const useAIExtractor = (form: UseFormReturn<z.infer<typeof formSchema>>) => {
  const [propertyText, setPropertyText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const fetchCohereApiKey = useCallback(async () => {
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
  }, []);

  const extractPropertyDetails = async () => {
    if (!propertyText.trim()) {
      toast.error("Please enter details about your property");
      return;
    }

    setIsProcessing(true);

    try {
      const extracted = {
        address: false,
        city: false,
        state: false,
        zip: false,
        beds: false,
        baths: false,
        sqft: false,
        propertyType: false,
        price: false,
        marketPrice: false,
        arv: false,
        rehab: false
      };
      
      const normalizedText = propertyText
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Address extraction
      const addressPattern = /(?:^|\s)(\d+\s+[A-Za-z0-9\s.,'-]+(?:,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}|,\s*[A-Za-z\s]+,\s*[A-Z]{2}|,\s*[A-Z]{2}\s*\d{5}))/i;
      const addressMatch = normalizedText.match(addressPattern);
      
      if (addressMatch) {
        const fullAddressText = addressMatch[1].trim();
        const addressParts = fullAddressText.split(',').map(part => part.trim());
        
        if (addressParts.length >= 1) {
          form.setValue('address', addressParts[0]);
          extracted.address = true;
          
          if (addressParts.length >= 2) {
            // Extract state and zip
            const lastPart = addressParts[addressParts.length - 1];
            const stateZipPattern = /([A-Z]{2})\s*(\d{5})/i;
            const stateZipMatch = lastPart.match(stateZipPattern);
            
            if (stateZipMatch) {
              form.setValue('state', stateZipMatch[1].toUpperCase());
              form.setValue('zipCode', stateZipMatch[2]);
              extracted.state = true;
              extracted.zip = true;
              
              if (addressParts.length >= 3) {
                form.setValue('city', addressParts[addressParts.length - 2]);
                extracted.city = true;
              }
            } else {
              const statePattern = /\b([A-Z]{2})\b/i;
              const stateMatch = lastPart.match(statePattern);
              
              if (stateMatch) {
                form.setValue('state', stateMatch[1].toUpperCase());
                extracted.state = true;
                
                if (addressParts.length >= 3) {
                  const cityCandidate = addressParts[addressParts.length - 2];
                  form.setValue('city', cityCandidate);
                  extracted.city = true;
                }
              } else if (addressParts.length === 2) {
                form.setValue('city', addressParts[1]);
                extracted.city = true;
              }
            }
          }
        }
      }
      
      // Property details extraction
      const bedsPatterns = [/(\d+)\s*(?:bed|beds|bedroom|bedrooms|BR|B\/R|bd)/i];
      for (const pattern of bedsPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          form.setValue('beds', match[1]);
          extracted.beds = true;
          break;
        }
      }
      
      const bathsPatterns = [/(\d+(?:\.\d+)?)\s*(?:bath|baths|bathroom|bathrooms|BA|B\/A|bth)/i];
      for (const pattern of bathsPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          form.setValue('baths', match[1]);
          extracted.baths = true;
          break;
        }
      }
      
      const sqftPatterns = [/(\d+(?:,\d+)?)\s*(?:sq\.?\s*ft|sqft|square\s*feet|square\s*foot|sf|SqFt)/i];
      for (const pattern of sqftPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          form.setValue('sqft', match[1].replace(/,/g, ''));
          extracted.sqft = true;
          break;
        }
      }
      
      // Property type
      const propertyTypeMatches = {
        'House': [/\b(?:house|home|Single\s*Family|SFH)\b/i],
        'Multi-Family': [/\b(?:Multi[-\s]*Family|MFH|Duplex|Triplex|Quadplex)\b/i],
        'Condo': [/\b(?:Condo|Condominium)\b/i],
        'Apartment': [/\b(?:Apartment|Apt)\b/i],
        'Land': [/\b(?:Land|Lot|Vacant\s*Land)\b/i]
      };
      
      for (const [type, patterns] of Object.entries(propertyTypeMatches)) {
        for (const pattern of patterns) {
          if (normalizedText.match(pattern)) {
            form.setValue('propertyType', type);
            extracted.propertyType = true;
            break;
          }
        }
        if (extracted.propertyType) break;
      }
      
      // Price extraction
      const pricePatterns = [
        /(?:asking|price|list|selling|sell for)[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
        /\$\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i
      ];
      
      for (const pattern of pricePatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          let price = match[1].replace(/,/g, '');
          if (price.toLowerCase().endsWith('k')) {
            price = (parseFloat(price.toLowerCase().replace('k', '')) * 1000).toString();
          }
          form.setValue('price', price);
          extracted.price = true;
          break;
        }
      }
      
      // Market price extraction - only if explicitly mentioned
      const marketPricePatterns = [
        /(?:Market\s*Price|Market\s*Value|Comps|Comparables|Appraised)[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
        /(?:Market|Comps|Comparables|Appraised)\s*[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i
      ];
      
      for (const pattern of marketPricePatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          let marketPrice = match[1].replace(/,/g, '');
          if (marketPrice.toLowerCase().endsWith('k')) {
            marketPrice = (parseFloat(marketPrice.toLowerCase().replace('k', '')) * 1000).toString();
          }
          form.setValue('marketPrice', marketPrice);
          extracted.marketPrice = true;
          break;
        }
      }
      
      // ARV extraction
      const arvPatterns = [/(?:ARV|after\s*repair\s*value)[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i];
      for (const pattern of arvPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          let arv = match[1].replace(/,/g, '');
          if (arv.toLowerCase().endsWith('k')) {
            arv = (parseFloat(arv.toLowerCase().replace('k', '')) * 1000).toString();
          }
          form.setValue('afterRepairValue', arv);
          extracted.arv = true;
          break;
        }
      }
      
      // Rehab cost extraction
      const rehabPatterns = [/(?:rehab|repairs|renovation)(?:\s*cost)?[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i];
      for (const pattern of rehabPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          let rehab = match[1].replace(/,/g, '');
          if (rehab.toLowerCase().endsWith('k')) {
            rehab = (parseFloat(rehab.toLowerCase().replace('k', '')) * 1000).toString();
          }
          form.setValue('estimatedRehab', rehab);
          extracted.rehab = true;
          break;
        }
      }
      
      // Extract description
      const description = normalizedText
        .replace(/\d+\s+[A-Za-z0-9\s.,'-]+(?:,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}|,\s*[A-Za-z\s]+,\s*[A-Z]{2}|,\s*[A-Z]{2}\s*\d{5})/gi, '')
        .replace(/\d+\s*(?:bed|beds|bedroom|bedrooms|BR|B\/R|bd)/gi, '')
        .replace(/\d+(?:\.\d+)?\s*(?:bath|baths|bathroom|bathrooms|BA|B\/A|bth)/gi, '')
        .replace(/\d+(?:,\d+)?\s*(?:sq\.?\s*ft|sqft|square\s*feet|square\s*foot|sf|SqFt)/gi, '')
        .replace(/\$\s*\d+(?:,\d+)*(?:\.\d+)?K?/gi, '')
        .replace(/\d+(?:,\d+)*(?:\.\d+)?K?\s*(?:asking|price)/gi, '')
        .replace(/ARV[:;]?\s*\$?\s*\d+(?:,\d+)*(?:\.\d+)?K?/gi, '')
        .replace(/(?:rehab|repairs|renovation)(?:\s*cost)?[:;]?\s*\$?\s*\d+(?:,\d+)*(?:\.\d+)?K?/gi, '')
        .replace(/\s+/g, ' ')
        .replace(/,\s*,/g, ',')
        .replace(/\s+\./g, '.')
        .trim();
      
      if (description) {
        form.setValue('description', description);
      }
      
      // Check for fields that weren't extracted and try to use Cohere API
      const missingFields = Object.entries(extracted).filter(([_, value]) => !value);
      if (missingFields.length > 0 && apiKey) {
        try {
          const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'command-light',
              prompt: `Extract ONLY the following missing information from this real estate listing text: ${missingFields.map(([field]) => field).join(", ")}. Format as JSON with ONLY these fields.\n\nText: ${normalizedText}\n\nJSON:`,
              max_tokens: 150,
              temperature: 0.1,
            })
          });

          if (response.ok) {
            const data = await response.json();
            const generatedText = data.generations[0].text;
            
            try {
              const startIdx = generatedText.indexOf('{');
              const endIdx = generatedText.lastIndexOf('}') + 1;
              if (startIdx >= 0 && endIdx > startIdx) {
                const jsonStr = generatedText.substring(startIdx, endIdx);
                const extractedData = JSON.parse(jsonStr);
                
                if (!extracted.address && extractedData.address) form.setValue('address', extractedData.address);
                if (!extracted.city && extractedData.city) form.setValue('city', extractedData.city);
                if (!extracted.state && extractedData.state) form.setValue('state', extractedData.state);
                if (!extracted.zip && extractedData.zip) form.setValue('zipCode', extractedData.zip);
                if (!extracted.beds && extractedData.beds) form.setValue('beds', String(extractedData.beds));
                if (!extracted.baths && extractedData.baths) form.setValue('baths', String(extractedData.baths));
                if (!extracted.sqft && extractedData.sqft) form.setValue('sqft', String(extractedData.sqft).replace(/,/g, ''));
                if (!extracted.propertyType && extractedData.propertyType) form.setValue('propertyType', extractedData.propertyType);
                if (!extracted.price && extractedData.price) form.setValue('price', String(extractedData.price).replace(/[$,]/g, ''));
                if (!extracted.marketPrice && extractedData.marketPrice) form.setValue('marketPrice', String(extractedData.marketPrice).replace(/[$,]/g, ''));
                if (!extracted.arv && extractedData.arv) form.setValue('afterRepairValue', String(extractedData.arv).replace(/[$,]/g, ''));
                if (!extracted.rehab && extractedData.rehab) form.setValue('estimatedRehab', String(extractedData.rehab).replace(/[$,]/g, ''));
              }
            } catch (e) {
              console.error("Error parsing Cohere response:", e);
            }
          }
        } catch (error) {
          console.error("Error using Cohere API:", error);
        }
      }
      
      // Removed automatic rehab/market price calculation
      // Only set these values if they were explicitly found in the text

      toast.success("Property details extracted successfully!");
    } catch (error) {
      console.error("AI extraction error:", error);
      toast.error("Could not extract property details. Please try again or fill the form manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    propertyText,
    setPropertyText,
    isProcessing,
    fetchCohereApiKey,
    extractPropertyDetails
  };
};
