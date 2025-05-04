import { useState } from 'react';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '../../formSchema';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

// Common two-word cities to prevent splitting city names incorrectly
const COMMON_TWO_WORD_CITIES = [
  "New York", "Los Angeles", "San Francisco", "San Diego", "San Jose", 
  "San Antonio", "Las Vegas", "St. Louis", "St. Paul", "Fort Worth", 
  "Fort Lauderdale", "Fort Collins", "Salt Lake", "Kansas City", 
  "Oklahoma City", "Baton Rouge", "New Orleans", "Santa Fe", "Santa Monica", 
  "Santa Barbara", "Santa Ana", "Santa Cruz", "Santa Rosa", "Santa Clara",
  "Coral Gables", "Palo Alto", "El Paso", "West Palm", "Palm Springs"
];

export const useAIExtractor = (form: UseFormReturn<z.infer<typeof formSchema>>) => {
  const [propertyText, setPropertyText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const fetchCohereApiKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-cohere-key');
      
      if (error) throw error;
      
      if (data?.apiKey) {
        setApiKey(data.apiKey);
      } else {
        console.error("No API key returned from function");
      }
    } catch (error) {
      console.error("Error fetching Cohere API key:", error);
    }
  };

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

      // Improved address extraction patterns
      // We prioritize the first matching address pattern in the text
      const addressPatterns = [
        // Street number + street name pattern (most common format for addresses)
        /\b(\d+\s+[A-Za-z0-9\s.'-]+(?:Road|Rd|Street|St|Avenue|Ave|Lane|Ln|Drive|Dr|Court|Ct|Boulevard|Blvd|Highway|Hwy|Place|Pl|Way|Terrace|Ter|Circle|Cir|Trail|Trl|Plaza|Plz)[.,]?)/i,
        
        // Street number + street name without suffix
        /\b(\d+\s+[A-Za-z0-9\s.'-]+)(?:\s+[A-Za-z]{2}\b|\s+\d{5}\b)/i,
        
        // Pattern with "Address:" prefix
        /\bAddress:?\s+(\d+[^,\n]+)/i,
        
        // Generic number + word pattern that might be an address
        /\b(\d+\s+[A-Za-z0-9\s.'-]+)[,\s]/i
      ];
      
      // Find the first address match in the text
      // This prioritizes the address that appears first in the text
      let firstMatchingAddress = null;
      let firstMatchStartIndex = Infinity;
      
      for (const pattern of addressPatterns) {
        const matches = [...normalizedText.matchAll(new RegExp(pattern, 'gi'))];
        for (const match of matches) {
          if (match.index !== undefined && match.index < firstMatchStartIndex) {
            firstMatchStartIndex = match.index;
            firstMatchingAddress = match[1].trim();
          }
        }
      }
      
      if (firstMatchingAddress) {
        form.setValue('address', firstMatchingAddress);
        extracted.address = true;
        console.log("Found address:", firstMatchingAddress);
      }
      
      // City extraction - check for common two-word cities first
      for (const twoWordCity of COMMON_TWO_WORD_CITIES) {
        if (normalizedText.includes(twoWordCity)) {
          form.setValue('city', twoWordCity);
          extracted.city = true;
          console.log("Found two-word city:", twoWordCity);
          break;
        }
      }
      
      // If no two-word city was found, look for city patterns
      if (!extracted.city) {
        const cityPatterns = [
          /\b(?:city|in):\s*([A-Za-z\s.]+)(?:,|\s+[A-Z]{2})/i,
          /\blocation:?\s+([^,]+),\s*[A-Z]{2}/i,
          /\bin\s+([A-Za-z\s.]+),\s*[A-Z]{2}/i,
          /,\s*([A-Za-z\s.]+),\s*[A-Z]{2}/i
        ];
        
        for (const pattern of cityPatterns) {
          const cityMatch = normalizedText.match(pattern);
          if (cityMatch) {
            const cityName = cityMatch[1].trim();
            form.setValue('city', cityName);
            extracted.city = true;
            console.log("Found city:", cityName);
            break;
          }
        }
      }
      
      // State extraction
      const statePatterns = [
        /,\s*([A-Z]{2})\s+\d{5}/i,
        /,\s*([A-Z]{2})(?:\s|$)/i,
        /\b(TX|FL|CA|NY|IL|PA|OH|GA|NC|MI|NJ|VA|WA|AZ|MA|TN|IN|MO|MD|WI|CO|MN|SC|AL|LA|KY|OR|OK|CT|IA|MS|AR|UT|KS|NV|NM|NE|WV|ID|HI|ME|NH|RI|MT|DE|SD|ND|AK|DC|WY|VT)\b/i
      ];
      
      for (const pattern of statePatterns) {
        const stateMatch = normalizedText.match(pattern);
        if (stateMatch) {
          form.setValue('state', stateMatch[1].toUpperCase());
          extracted.state = true;
          console.log("Found state:", stateMatch[1].toUpperCase());
          break;
        }
      }
      
      // ZIP code extraction
      const zipPattern = /\b(\d{5}(?:-\d{4})?)\b/;
      const zipMatches = [...normalizedText.matchAll(new RegExp(zipPattern, 'g'))];
      
      if (zipMatches.length > 0) {
        // Get just the first 5 digits
        const zipCode = zipMatches[0][1].substring(0, 5);
        form.setValue('zipCode', zipCode);
        extracted.zip = true;
        console.log("Found ZIP code:", zipCode);
      }

      // Beds extraction
      const bedsPatterns = [
        /(\d+)\s*(?:bed|beds|bedroom|bedrooms|BR|B\/R|bd)/i,
        /(?:bed|beds|bedroom|bedrooms|BR|B\/R|bd)[:\s-]*(\d+)/i,
        /(\d+)[-\s]*(?:bed|beds|bedroom|bedrooms|BR|B\/R|bd)/i
      ];
      
      for (const pattern of bedsPatterns) {
        const bedsMatch = normalizedText.match(pattern);
        if (bedsMatch) {
          form.setValue('beds', bedsMatch[1]);
          extracted.beds = true;
          break;
        }
      }

      // Baths extraction
      const bathsPatterns = [
        /(\d+(?:\.\d+)?)\s*(?:bath|baths|bathroom|bathrooms|BA|B\/A|bth)/i,
        /(?:bath|baths|bathroom|bathrooms|BA|B\/A|bth)[:\s-]*(\d+(?:\.\d+)?)/i,
        /(\d+(?:\.\d+)?)[-\s]*(?:bath|baths|bathroom|bathrooms|BA|B\/A|bth)/i
      ];
      
      for (const pattern of bathsPatterns) {
        const bathsMatch = normalizedText.match(pattern);
        if (bathsMatch) {
          form.setValue('baths', bathsMatch[1]);
          extracted.baths = true;
          break;
        }
      }

      // Square footage extraction
      const sqftPatterns = [
        /(\d+(?:,\d+)?)\s*(?:sq\.?\s*ft|sqft|square\s*feet|square\s*foot|sf|SqFt)/i,
        /(?:sq\.?\s*ft|sqft|square\s*feet|square\s*foot|sf|SqFt)[:\s-]*(\d+(?:,\d+)?)/i,
        /(\d+(?:,\d+)?)\s*(?:sq)/i
      ];
      
      for (const pattern of sqftPatterns) {
        const sqftMatch = normalizedText.match(pattern);
        if (sqftMatch) {
          const sqft = sqftMatch[1].replace(/,/g, '');
          form.setValue('sqft', sqft);
          extracted.sqft = true;
          break;
        }
      }

      // Property type extraction
      const propertyTypeMatches = {
        'House': [/(?:Row\s*[Hh]ome|Single\s*Family|SFH|Detached|Town\s*[Hh]ome|Brick\s*Row\s*[Hh]ome)/i, /\b(?:house|home)\b/i],
        'Multi-Family': [/(?:Multi[-\s]*Family|MFH|Duplex|Triplex|Quadplex|4-plex)/i],
        'Condo': [/\b(?:Condo|Condominium)\b/i],
        'Apartment': [/\b(?:Apartment|Apt)\b/i],
        'Studio': [/\b(?:Studio)\b/i],
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
      const askingPricePatterns = [
        /(?:Asking|Price|List\s*Price|Listed\s*at|asking price)[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
        /\$\s*(\d+(?:,\d+)*(?:\.\d+)?K?)\s*(?:asking|price)/i,
        /(\d+(?:,\d+)*(?:\.\d+)?)[Kk]\s*(?:asking|price)/i,
        /(\d+(?:,\d+)*(?:\.\d+)?)\s*[Kk]/i
      ];
      
      for (const pattern of askingPricePatterns) {
        const askingMatch = normalizedText.match(pattern);
        if (askingMatch) {
          let price = askingMatch[1].replace(/,/g, '');
          if (price.toLowerCase().endsWith('k')) {
            price = (parseFloat(price.toLowerCase().replace('k', '')) * 1000).toString();
          }
          form.setValue('price', price);
          extracted.price = true;
          
          const marketPrice = Math.round(parseFloat(price) * 1.1);
          form.setValue('marketPrice', String(marketPrice));
          extracted.marketPrice = true;
          break;
        }
      }

      // After Repair Value extraction
      const arvPatterns = [
        /ARV[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)\s*(?:[-–]\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?))?/i,
        /(?:after\s*repair\s*value|ARV)[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
        /(?:after\s*repair|ARV)[:\s;]+(\d+(?:,\d+)*(?:\.\d+)?K?)/i
      ];
      
      for (const pattern of arvPatterns) {
        const arvMatch = normalizedText.match(pattern);
        if (arvMatch) {
          let arvValue;
          if (arvMatch[2]) {
            let arvLow = arvMatch[1].replace(/,/g, '');
            let arvHigh = arvMatch[2].replace(/,/g, '');
            
            if (arvLow.toLowerCase().endsWith('k')) {
              arvLow = (parseFloat(arvLow.toLowerCase().replace('k', '')) * 1000).toString();
            }
            if (arvHigh.toLowerCase().endsWith('k')) {
              arvHigh = (parseFloat(arvHigh.toLowerCase().replace('k', '')) * 1000).toString();
            }
            
            const arvAvg = Math.round((parseFloat(arvLow) + parseFloat(arvHigh)) / 2);
            arvValue = String(arvAvg);
          } else {
            let arv = arvMatch[1].replace(/,/g, '');
            if (arv.toLowerCase().endsWith('k')) {
              arv = (parseFloat(arv.toLowerCase().replace('k', '')) * 1000).toString();
            }
            arvValue = arv;
          }
          form.setValue('afterRepairValue', arvValue);
          extracted.arv = true;
          break;
        }
      }

      // Rehab cost extraction
      const rehabPatterns = [
        /(?:Rehab|Renovation|Repair|Repairs)\s*(?:Cost|Estimate|Budget)?[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
        /(?:Rehab|REHAB)[:;]\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
        /(?:Rehab|REHAB)\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i
      ];
      
      for (const pattern of rehabPatterns) {
        const rehabMatch = normalizedText.match(pattern);
        if (rehabMatch) {
          let rehab = rehabMatch[1].replace(/,/g, '');
          if (rehab.toLowerCase().endsWith('k')) {
            rehab = (parseFloat(rehab.toLowerCase().replace('k', '')) * 1000).toString();
          }
          form.setValue('estimatedRehab', rehab);
          extracted.rehab = true;
          break;
        }
      }
      
      // Create description by removing extracted data
      const address = form.getValues('address') || '';
      const city = form.getValues('city') || '';
      const state = form.getValues('state') || '';
      const zipCode = form.getValues('zipCode') || '';
      
      let description = normalizedText;
      
      if (extracted.address && address) {
        description = description.replace(new RegExp(address.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
      }
      
      if (extracted.city && city) {
        description = description.replace(new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
      }
      
      if (extracted.state && state) {
        description = description.replace(new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
      }
      
      if (extracted.zip && zipCode) {
        description = description.replace(new RegExp(zipCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
      }
      
      description = description
        .replace(/\s+/g, ' ')
        .replace(/,\s*,/g, ',')
        .replace(/\s+\./g, '.')
        .trim();
      
      if (description) {
        form.setValue('description', description);
      }

      // If we're still missing critical address information and we have the API key, use Cohere
      const missingAddressFields = Object.entries({
        address: extracted.address,
        city: extracted.city,
        state: extracted.state,
        zip: extracted.zip
      }).filter(([_, value]) => !value).map(([field]) => field);
      
      if (missingAddressFields.length > 0 && apiKey) {
        console.log("Using Cohere API to extract missing fields:", missingAddressFields.join(", "));
        
        try {
          const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'command-light',
              prompt: `You are a real estate data extraction expert specializing in identifying address information. 
Extract ONLY the following information from this text: ${missingAddressFields.join(", ")}. 
Format the result as JSON with ONLY these fields and no other commentary. 
If you find multiple possibilities for address, ONLY include the FIRST one that appears in the text.
For two-word cities like "San Antonio" or "New York", include both words.

Text: "${normalizedText}"

JSON response:`,
              max_tokens: 150,
              temperature: 0.1,
              stop_sequences: ["}"]
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            const generatedText = data.generations[0].text + "}"; // Add closing brace
            
            try {
              const startIdx = generatedText.indexOf('{');
              const endIdx = generatedText.lastIndexOf('}') + 1;
              
              if (startIdx >= 0 && endIdx > startIdx) {
                const jsonStr = generatedText.substring(startIdx, endIdx);
                const extractedData = JSON.parse(jsonStr);
                console.log("Extracted data from Cohere:", extractedData);
                
                // Only set values that weren't already extracted
                if (!extracted.address && extractedData.address) {
                  form.setValue('address', extractedData.address);
                }
                
                if (!extracted.city && extractedData.city) {
                  form.setValue('city', extractedData.city);
                }
                
                if (!extracted.state && extractedData.state) {
                  // Ensure state is always uppercase and maximum 2 characters
                  const stateValue = extractedData.state.toUpperCase();
                  form.setValue('state', stateValue.substring(0, 2));
                }
                
                if (!extracted.zip && extractedData.zip) {
                  // Ensure we only get the first 5 digits for zip
                  const zipValue = extractedData.zip.replace(/\D/g, '');
                  form.setValue('zipCode', zipValue.substring(0, 5));
                }
              }
            } catch (e) {
              console.error("Error parsing Cohere response:", e);
            }
          }
        } catch (cohereError) {
          console.log("Error using Cohere API:", cohereError);
        }
      }
      
      // Estimate rehab costs if we don't have them but have ARV and price
      const arv = form.getValues('afterRepairValue');
      const price = form.getValues('price');
      
      if (!extracted.rehab && arv && price) {
        const estimatedRehab = Math.round((parseFloat(arv) - parseFloat(price)) * 0.7);
        if (estimatedRehab > 0) {
          form.setValue('estimatedRehab', String(estimatedRehab));
        }
      }
      
      // Show success/warning toast based on extraction results
      const anyFieldExtracted = Object.values(extracted).some(value => value === true);
      
      if (anyFieldExtracted) {
        toast.success("Property details extracted successfully!");
      } else {
        toast.warning("Limited details found. Please fill in the remaining fields manually.");
      }
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
