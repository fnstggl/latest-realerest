import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from './formSchema';
import { supabase } from '@/integrations/supabase/client';
import AITextArea from './ai-extractor/AITextArea';

interface AIPropertyExtractorProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const AIPropertyExtractor: React.FC<AIPropertyExtractorProps> = ({
  form
}) => {
  const [propertyText, setPropertyText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const fetchCohereApiKey = async () => {
      try {
        const {
          data,
          error
        } = await supabase.functions.invoke('fetch-cohere-key');

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

      // Improved address extraction patterns for better matching
      const addressPatterns = [
        // Standard address format with street, city, state, zip
        /(?:^|\s)(\d+\s+[A-Za-z0-9\s.,'-]+(?:,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}|,\s*[A-Za-z\s]+,\s*[A-Z]{2}|,\s*[A-Z]{2}\s*\d{5}))/i,
        // Looking for specific address mentions
        /(?:Address|Property|Located at|Home at)[:;]?\s+(\d+[^,]+,\s*[^,]+(?:,\s*[A-Z]{2}\s*\d{5}|,\s*[A-Z]{2}))/i,
        // Street number and name pattern
        /\b(\d+\s+[A-Za-z0-9\s.'-]+(Road|Rd|Street|St|Avenue|Ave|Lane|Ln|Drive|Dr|Court|Ct|Boulevard|Blvd|Highway|Hwy|Place|Pl|Way|Terrace|Ter|Circle|Cir))/i
      ];

      let addressFound = false;
      for (const pattern of addressPatterns) {
        const addressMatch = normalizedText.match(pattern);
        if (addressMatch) {
          addressFound = true;
          const fullAddressText = addressMatch[1].trim();
          
          // Try to extract street address first
          const streetMatch = fullAddressText.match(/^\d+[^,]+/);
          if (streetMatch) {
            form.setValue('address', streetMatch[0].trim());
            extracted.address = true;
          }
          
          const addressParts = fullAddressText.split(',').map(part => part.trim());
          
          if (addressParts.length >= 2) {
            // If address wasn't extracted yet but we have parts
            if (!extracted.address && addressParts[0]) {
              form.setValue('address', addressParts[0]);
              extracted.address = true;
            }
            
            // Extract city, state, zip from the address parts
            const lastPart = addressParts[addressParts.length - 1];
            const stateZipPattern = /([A-Z]{2})\s*(\d{5})?/i;
            const stateZipMatch = lastPart.match(stateZipPattern);
            
            if (stateZipMatch) {
              form.setValue('state', stateZipMatch[1].toUpperCase());
              extracted.state = true;
              
              if (stateZipMatch[2]) {
                form.setValue('zipCode', stateZipMatch[2]);
                extracted.zip = true;
              }
              
              // City is usually the part before state/zip
              if (addressParts.length >= 3) {
                form.setValue('city', addressParts[addressParts.length - 2]);
                extracted.city = true;
              } else if (addressParts.length === 2) {
                // Try to extract city from the same part as state/zip
                const cityMatch = lastPart.match(/([^,]+),\s*[A-Z]{2}/i);
                if (cityMatch) {
                  form.setValue('city', cityMatch[1].trim());
                  extracted.city = true;
                }
              }
            } else {
              // If no state/zip pattern, try just state pattern
              const statePattern = /\b([A-Z]{2})\b/i;
              const stateMatch = lastPart.match(statePattern);
              
              if (stateMatch) {
                form.setValue('state', stateMatch[1].toUpperCase());
                extracted.state = true;
                
                if (addressParts.length >= 3) {
                  form.setValue('city', addressParts[addressParts.length - 2]);
                  extracted.city = true;
                }
              } else if (addressParts.length >= 2) {
                // If no state pattern but we have multiple parts, assume the second-to-last is the city
                form.setValue('city', addressParts[addressParts.length - 2]);
                extracted.city = true;
              }
            }
          }
          
          break;
        }
      }
      
      // Standalone city detection if not found in address
      if (!extracted.city) {
        const cityPatterns = [
          /\b(?:in|at|near|city\s+of)\s+([A-Za-z\s.']+?)[,\s]/i,
          /\bCity[:;]?\s+([A-Za-z\s.']+)/i
        ];
        
        for (const pattern of cityPatterns) {
          const cityMatch = normalizedText.match(pattern);
          if (cityMatch) {
            form.setValue('city', cityMatch[1].trim());
            extracted.city = true;
            break;
          }
        }
      }
      
      // Standalone state detection if not found in address
      if (!extracted.state) {
        const statePatterns = [
          /\b(?:state\s+of|in)\s+([A-Z]{2})\b/i,
          /\bState[:;]?\s+([A-Z]{2})\b/i,
          /\bin\s+([A-Za-z\s]+?)[,\s]/i
        ];
        
        for (const pattern of statePatterns) {
          const stateMatch = normalizedText.match(pattern);
          if (stateMatch) {
            const potentialState = stateMatch[1].trim().toUpperCase();
            if (potentialState.length === 2 || usStates.includes(potentialState)) {
              form.setValue('state', potentialState.substring(0, 2));
              extracted.state = true;
              break;
            }
          }
        }
      }
      
      // Standalone ZIP code detection if not found in address
      if (!extracted.zip) {
        const zipPatterns = [
          /\b(ZIP|postal\s+code)[:;]?\s+(\d{5})/i,
          /\b(\d{5}[-\s]?\d{0,4})\b/
        ];
        
        for (const pattern of zipPatterns) {
          const zipMatch = normalizedText.match(pattern);
          if (zipMatch) {
            // Extract the first 5 digits as ZIP code
            const zip = zipMatch[pattern.toString().includes("ZIP") ? 2 : 1].substring(0, 5);
            form.setValue('zipCode', zip);
            extracted.zip = true;
            break;
          }
        }
      }

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

      const address = form.getValues('address') || '';
      const city = form.getValues('city') || '';
      const state = form.getValues('state') || '';
      const zipCode = form.getValues('zipCode') || '';

      let description = normalizedText;

      if (extracted.address && address) {
        description = description.replace(address, '');
      }
      if (extracted.city && city) {
        description = description.replace(new RegExp(city, 'gi'), '');
      }
      if (extracted.state && state) {
        description = description.replace(new RegExp(state, 'gi'), '');
      }
      if (extracted.zip && zipCode) {
        description = description.replace(zipCode, '');
      }

      description = description
        .replace(/\s+/g, ' ')
        .replace(/,\s*,/g, ',')
        .replace(/\s+\./g, '.')
        .trim();

      if (description) {
        form.setValue('description', description);
      }

      // Enhanced address extraction with Cohere API
      const missingFields = Object.entries(extracted).filter(([field, value]) => 
        !value && ['address', 'city', 'state', 'zip'].includes(field)
      );
      
      if (missingFields.length > 0 && apiKey) {
        console.log("Using Cohere API to extract missing address fields:", missingFields.map(([field]) => field).join(", "));
        
        try {
          const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'command-light',
              prompt: `You are a real estate data extraction expert. Extract ONLY the following address information from this real estate listing text: ${missingFields.map(([field]) => field).join(", ")}. Format as JSON with ONLY these fields. Be as accurate as possible.
              
Example: For "123 Main St, Springfield, IL 62701", you would return {"address":"123 Main St", "city":"Springfield", "state":"IL", "zip":"62701"}

For partial data like "property in Chicago area", you might return {"city":"Chicago", "state":"IL"}

Text: ${normalizedText}

Return JSON with ONLY the requested fields:`,
              max_tokens: 150,
              temperature: 0.1,
              stop_sequences: ["}"],
            })
          });

          if (response.ok) {
            const data = await response.json();
            const generatedText = data.generations[0].text;
            
            try {
              let jsonText = generatedText + "}";  // Add closing brace if not present
              const startIdx = jsonText.indexOf('{');
              const endIdx = jsonText.lastIndexOf('}') + 1;
              
              if (startIdx >= 0 && endIdx > startIdx) {
                const jsonStr = jsonText.substring(startIdx, endIdx);
                const extractedData = JSON.parse(jsonStr);
                console.log("Extracted address data from Cohere:", extractedData);
                
                if (!extracted.address && extractedData.address) {
                  form.setValue('address', extractedData.address);
                }
                if (!extracted.city && extractedData.city) {
                  form.setValue('city', extractedData.city);
                }
                if (!extracted.state && extractedData.state) {
                  form.setValue('state', extractedData.state.toUpperCase().substring(0, 2));
                }
                if (!extracted.zip && extractedData.zip) {
                  form.setValue('zipCode', extractedData.zip);
                }
              }
            } catch (e) {
              console.error("Error parsing Cohere address response:", e);
            }
          }
        } catch (cohereError) {
          console.log("Error using Cohere API for address extraction:", cohereError);
        }
      }

      const arv = form.getValues('afterRepairValue');
      const price = form.getValues('price');

      if (!extracted.rehab && arv && price) {
        const estimatedRehab = Math.round((parseFloat(arv) - parseFloat(price)) * 0.7);
        if (estimatedRehab > 0) {
          form.setValue('estimatedRehab', String(estimatedRehab));
        }
      }

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

  // Helper definition for US states
  const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

  return (
    <div className="mb-12">
      <div className="bg-white rounded-xl p-8 px-[32px] py-0">
        <h3 className="text-2xl font-bold mb-2">Paste Property Details</h3>
        <p className="text-sm text-gray-600 mb-6">
          List faster with AI. Just paste your property details here and Realer Estate will sort it for you
        </p>
        
        <div className="relative">
          <AITextArea 
            value={propertyText}
            onChange={(e) => setPropertyText(e.target.value)}
            isProcessing={isProcessing}
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <Button type="button" onClick={extractPropertyDetails} disabled={isProcessing || !propertyText.trim()} className="relative group">
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-bold">Extracting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                <span className="font-bold">Extract Details</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIPropertyExtractor;
