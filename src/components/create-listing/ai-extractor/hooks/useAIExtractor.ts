
import { useState, useCallback } from 'react';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '../../formSchema';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { usStates } from '../../AddressSection';

// Map state abbreviations to full names and vice versa
const stateMapping: Record<string, string> = {
  'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR', 'CALIFORNIA': 'CA',
  'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA',
  'HAWAII': 'HI', 'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA',
  'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD',
  'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO',
  'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ',
  'NEW MEXICO': 'NM', 'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH',
  'OKLAHOMA': 'OK', 'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
  'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT',
  'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY',
  'DISTRICT OF COLUMBIA': 'DC'
};

// Create reverse mapping (abbreviation to full name)
const reverseStateMapping: Record<string, string> = {};
Object.entries(stateMapping).forEach(([fullName, abbr]) => {
  reverseStateMapping[abbr] = fullName;
});

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper function to normalize and validate state values
const normalizeState = (state: string): string | null => {
  if (!state) return null;
  
  // Convert to uppercase for matching
  const uppercaseState = state.toUpperCase();
  
  // Check if it's a valid 2-letter code already
  if (usStates.includes(uppercaseState)) {
    return uppercaseState;
  }
  
  // Check if it's a full state name and convert to abbreviation
  if (stateMapping[uppercaseState]) {
    return stateMapping[uppercaseState];
  }
  
  // Check for partial matches in full state names
  for (const [fullName, abbr] of Object.entries(stateMapping)) {
    if (fullName.startsWith(uppercaseState)) {
      return abbr;
    }
  }
  
  return null;
};

// Helper function to validate bathroom count
const validateBathrooms = (value: string): string => {
  const bathsNum = parseFloat(value);
  // Ensure bathroom count is reasonable (not greater than 30)
  if (bathsNum > 30) {
    return "1"; // Default to 1 if unrealistic value
  }
  return value;
};

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
            // Apply proper capitalization to street address
            const capitalizedAddress = capitalizeWords(streetMatch[0].trim());
            form.setValue('address', capitalizedAddress);
            extracted.address = true;
          }
          
          const addressParts = fullAddressText.split(',').map(part => part.trim());
          
          if (addressParts.length >= 2) {
            // If address wasn't extracted yet but we have parts
            if (!extracted.address && addressParts[0]) {
              const capitalizedAddress = capitalizeWords(addressParts[0]);
              form.setValue('address', capitalizedAddress);
              extracted.address = true;
            }
            
            // Extract city, state, zip from the address parts
            const lastPart = addressParts[addressParts.length - 1];
            const stateZipPattern = /([A-Za-z]{2})\s*(\d{5})?/i;
            const stateZipMatch = lastPart.match(stateZipPattern);
            
            if (stateZipMatch) {
              const stateValue = stateZipMatch[1].toUpperCase();
              const normalizedState = normalizeState(stateValue);
              
              if (normalizedState) {
                form.setValue('state', normalizedState);
                extracted.state = true;
              }
              
              if (stateZipMatch[2]) {
                form.setValue('zipCode', stateZipMatch[2]);
                extracted.zip = true;
              }
              
              // City is usually the part before state/zip
              if (addressParts.length >= 3) {
                const cityValue = capitalizeWords(addressParts[addressParts.length - 2]);
                form.setValue('city', cityValue);
                extracted.city = true;
              } else if (addressParts.length === 2) {
                // Try to extract city from the same part as state/zip
                const cityMatch = lastPart.match(/([^,]+),\s*[A-Za-z]{2}/i);
                if (cityMatch) {
                  const cityValue = capitalizeWords(cityMatch[1].trim());
                  form.setValue('city', cityValue);
                  extracted.city = true;
                }
              }
            } else {
              // If no state/zip pattern, try just state pattern
              const statePattern = /\b([A-Za-z]+)\b/i;
              const stateMatch = lastPart.match(statePattern);
              
              if (stateMatch) {
                const stateValue = stateMatch[1];
                const normalizedState = normalizeState(stateValue);
                
                if (normalizedState) {
                  form.setValue('state', normalizedState);
                  extracted.state = true;
                }
                
                if (addressParts.length >= 3) {
                  const cityValue = capitalizeWords(addressParts[addressParts.length - 2]);
                  form.setValue('city', cityValue);
                  extracted.city = true;
                }
              } else if (addressParts.length >= 2) {
                // If no state pattern but we have multiple parts, assume the second-to-last is the city
                const cityValue = capitalizeWords(addressParts[addressParts.length - 2]);
                form.setValue('city', cityValue);
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
            const cityValue = capitalizeWords(cityMatch[1].trim());
            form.setValue('city', cityValue);
            extracted.city = true;
            break;
          }
        }
      }
      
      // Standalone state detection if not found in address
      if (!extracted.state) {
        const statePatterns = [
          /\b(?:state\s+of|in)\s+([A-Za-z]{2,})\b/i,
          /\bState[:;]?\s+([A-Za-z]{2,})\b/i,
          /\bin\s+([A-Za-z\s]+?)[,\s]/i,
          /\b([A-Za-z]+)\s+(?:state)\b/i
        ];
        
        for (const pattern of statePatterns) {
          const stateMatch = normalizedText.match(pattern);
          if (stateMatch) {
            const potentialState = stateMatch[1].trim();
            const normalizedState = normalizeState(potentialState);
            
            if (normalizedState) {
              form.setValue('state', normalizedState);
              extracted.state = true;
              break;
            }
          }
        }
      }
      
      // Standalone ZIP code detection if not found in address
      if (!extracted.zip) {
        const zipPatterns = [
          /\b(?:ZIP|postal\s+code)[:;]?\s+(\d{5})/i,
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
          const bathValue = validateBathrooms(bathsMatch[1]);
          form.setValue('baths', bathValue);
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

      // Enhanced address extraction with Cohere API for missing fields
      const missingFields = Object.entries(extracted).filter(([field, value]) => 
        !value && ['address', 'city', 'state', 'zip', 'beds', 'baths', 'sqft', 'propertyType'].includes(field)
      );
      
      if (missingFields.length > 0 && apiKey) {
        console.log("Using Cohere API to extract missing fields:", missingFields.map(([field]) => field).join(", "));
        
        try {
          const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'command-light',
              prompt: `You are a real estate data extraction expert. Extract ONLY the following information from this real estate listing text: ${missingFields.map(([field]) => field).join(", ")}. 
              
For addresses, return the exact property address with proper capitalization.
For state names, return the 2-letter abbreviation (e.g., TX for Texas, CA for California).
For bathrooms, never return a value above 30 (be realistic).
Format as JSON with ONLY these fields and be as accurate as possible.

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
                console.log("Extracted data from Cohere:", extractedData);
                
                if (!extracted.address && extractedData.address) {
                  form.setValue('address', capitalizeWords(extractedData.address));
                }
                
                if (!extracted.city && extractedData.city) {
                  form.setValue('city', capitalizeWords(extractedData.city));
                }
                
                if (!extracted.state && extractedData.state) {
                  const normalizedState = normalizeState(extractedData.state);
                  if (normalizedState) {
                    form.setValue('state', normalizedState);
                  }
                }
                
                if (!extracted.zip && extractedData.zip) {
                  form.setValue('zipCode', extractedData.zip);
                }
                
                if (!extracted.beds && extractedData.beds) {
                  form.setValue('beds', String(extractedData.beds));
                }
                
                if (!extracted.baths && extractedData.baths) {
                  // Validate bathroom count
                  const bathValue = validateBathrooms(String(extractedData.baths));
                  form.setValue('baths', bathValue);
                }
                
                if (!extracted.sqft && extractedData.sqft) {
                  form.setValue('sqft', String(extractedData.sqft).replace(/,/g, ''));
                }
                
                if (!extracted.propertyType && extractedData.propertyType) {
                  form.setValue('propertyType', extractedData.propertyType);
                }
              }
            } catch (e) {
              console.error("Error parsing Cohere address response:", e);
            }
          }
        } catch (cohereError) {
          console.log("Error using Cohere API for field extraction:", cohereError);
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

  return {
    propertyText,
    setPropertyText,
    isProcessing,
    fetchCohereApiKey,
    extractPropertyDetails
  };
};
