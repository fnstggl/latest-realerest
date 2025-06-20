
import { useState, useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from '../formSchema';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export const usePropertyExtractor = (form: UseFormReturn<z.infer<typeof formSchema>>) => {
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

      const addressPattern = /(?:^|\s)(\d+\s+[A-Za-z0-9\s.,'-]+(?:,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}|,\s*[A-Za-z\s]+,\s*[A-Z]{2}|,\s*[A-Z]{2}\s*\d{5}))/i;
      const addressMatch = normalizedText.match(addressPattern);
      
      if (addressMatch) {
        const fullAddressText = addressMatch[1].trim();
        
        const addressParts = fullAddressText.split(',').map(part => part.trim());
        
        if (addressParts.length >= 1) {
          form.setValue('address', addressParts[0]);
          extracted.address = true;
          
          if (addressParts.length >= 2) {
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
        'House': [
          /(?:Row\s*[Hh]ome|Single\s*Family|SFH|Detached|Town\s*[Hh]ome|Brick\s*Row\s*[Hh]ome)/i,
          /\b(?:house|home)\b/i
        ],
        'Multi-Family': [
          /(?:Multi[-\s]*Family|MFH|Duplex|Triplex|Quadplex|4-plex)/i
        ],
        'Condo': [
          /\b(?:Condo|Condominium)\b/i
        ],
        'Apartment': [
          /\b(?:Apartment|Apt)\b/i
        ],
        'Studio': [
          /\b(?:Studio)\b/i
        ],
        'Land': [
          /\b(?:Land|Lot|Vacant\s*Land)\b/i
        ]
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
          
          // Only set market price if specifically found in the text - don't auto-calculate
          const marketPricePatterns = [
            /(?:Market\s*Price|Market\s*Value|Appraised|Comps|Comparables|Comp)[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
            /(?:Market|Appraised|Comps|Comparables|Comp)\s*[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i
          ];
          
          let marketPriceFound = false;
          for (const mpPattern of marketPricePatterns) {
            const marketMatch = normalizedText.match(mpPattern);
            if (marketMatch) {
              let marketPrice = marketMatch[1].replace(/,/g, '');
              if (marketPrice.toLowerCase().endsWith('k')) {
                marketPrice = (parseFloat(marketPrice.toLowerCase().replace('k', '')) * 1000).toString();
              }
              form.setValue('marketPrice', marketPrice);
              extracted.marketPrice = true;
              marketPriceFound = true;
              break;
            }
          }
          
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

      const missingFields = Object.entries(extracted).filter(([_, value]) => !value);
      if (missingFields.length > 0 && apiKey) {
        console.log("Using Cohere API to extract missing fields:", missingFields.map(([field]) => field).join(", "));
        
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
                console.log("Extracted data from Cohere:", extractedData);
                
                if (!extracted.address && extractedData.address) {
                  form.setValue('address', extractedData.address);
                }
                if (!extracted.city && extractedData.city) {
                  form.setValue('city', extractedData.city);
                }
                if (!extracted.state && extractedData.state) {
                  form.setValue('state', extractedData.state);
                }
                if (!extracted.zip && extractedData.zip) {
                  form.setValue('zipCode', extractedData.zip);
                }
                if (!extracted.beds && extractedData.beds) {
                  form.setValue('beds', String(extractedData.beds));
                }
                if (!extracted.baths && extractedData.baths) {
                  form.setValue('baths', String(extractedData.baths));
                }
                if (!extracted.sqft && extractedData.sqft) {
                  form.setValue('sqft', String(extractedData.sqft).replace(/,/g, ''));
                }
                if (!extracted.propertyType && extractedData.propertyType) {
                  form.setValue('propertyType', extractedData.propertyType);
                }
                if (!extracted.price && extractedData.price) {
                  const price = String(extractedData.price).replace(/[$,]/g, '');
                  form.setValue('price', price);
                }
                if (!extracted.marketPrice && extractedData.marketPrice) {
                  form.setValue('marketPrice', String(extractedData.marketPrice).replace(/[$,]/g, ''));
                }
                if (!extracted.arv && extractedData.arv) {
                  form.setValue('afterRepairValue', String(extractedData.arv).replace(/[$,]/g, ''));
                }
                if (!extracted.rehab && extractedData.rehab) {
                  form.setValue('estimatedRehab', String(extractedData.rehab).replace(/[$,]/g, ''));
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
      
      // Remove auto-calculation of estimated rehab cost
      // Only set if explicitly found in the text or via the Cohere API

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
    extractPropertyDetails
  };
};
