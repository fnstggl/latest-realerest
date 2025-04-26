
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from './formSchema';
import { supabase } from '@/integrations/supabase/client';
import { GlowEffect } from '@/components/ui/glow-effect';

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

    setIsProcessing(true);

    try {
      // Track what we've successfully extracted to minimize API usage
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

      // More flexible address extraction with broader patterns
      const addressPattern = /(?:^|\s)(\d+\s+[A-Za-z0-9\s.,'-]+(?:,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}|,\s*[A-Za-z\s]+,\s*[A-Z]{2}|,\s*[A-Z]{2}\s*\d{5}))/i;
      const addressMatch = normalizedText.match(addressPattern);
      
      if (addressMatch) {
        const fullAddressText = addressMatch[1].trim();
        
        // Extract street address, city, state, zip from the full address
        // Handle various formats with more flexibility
        const addressParts = fullAddressText.split(',').map(part => part.trim());
        
        if (addressParts.length >= 1) {
          // Street address is always the first part
          form.setValue('address', addressParts[0]);
          extracted.address = true;
          
          // Try to extract city, state, zip based on common patterns
          if (addressParts.length >= 2) {
            const lastPart = addressParts[addressParts.length - 1];
            // Check for state and zip in last part
            const stateZipPattern = /([A-Z]{2})\s*(\d{5})/i;
            const stateZipMatch = lastPart.match(stateZipPattern);
            
            if (stateZipMatch) {
              form.setValue('state', stateZipMatch[1].toUpperCase());
              form.setValue('zipCode', stateZipMatch[2]);
              extracted.state = true;
              extracted.zip = true;
              
              // If we have more than 2 parts, the second-to-last is likely the city
              if (addressParts.length >= 3) {
                form.setValue('city', addressParts[addressParts.length - 2]);
                extracted.city = true;
              }
            } else {
              // If no zip, see if we can extract just state
              const statePattern = /\b([A-Z]{2})\b/i;
              const stateMatch = lastPart.match(statePattern);
              
              if (stateMatch) {
                form.setValue('state', stateMatch[1].toUpperCase());
                extracted.state = true;
                
                // Try to find city
                if (addressParts.length >= 3) {
                  const cityCandidate = addressParts[addressParts.length - 2];
                  form.setValue('city', cityCandidate);
                  extracted.city = true;
                }
              } else if (addressParts.length === 2) {
                // If only 2 parts and no state/zip pattern, assume second part is city
                form.setValue('city', addressParts[1]);
                extracted.city = true;
              }
            }
          }
        }
      }
      
      // More flexible beds extraction with various formats
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
      
      // More flexible baths extraction with various formats
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
      
      // More flexible square footage extraction
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
      
      // Improved property type detection with more variations
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
      
      // Extract asking price with more flexibility
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
          // Handle K notation (e.g., 670K = 670000)
          if (price.toLowerCase().endsWith('k')) {
            price = (parseFloat(price.toLowerCase().replace('k', '')) * 1000).toString();
          }
          form.setValue('price', price);
          extracted.price = true;
          
          // Set market price slightly higher by default
          const marketPrice = Math.round(parseFloat(price) * 1.1);
          form.setValue('marketPrice', String(marketPrice));
          extracted.marketPrice = true;
          break;
        }
      }
      
      // Extract ARV (After Repair Value) with more flexibility
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
            // If range is provided, use average
            let arvLow = arvMatch[1].replace(/,/g, '');
            let arvHigh = arvMatch[2].replace(/,/g, '');
            
            // Handle K notation
            if (arvLow.toLowerCase().endsWith('k')) {
              arvLow = (parseFloat(arvLow.toLowerCase().replace('k', '')) * 1000).toString();
            }
            if (arvHigh.toLowerCase().endsWith('k')) {
              arvHigh = (parseFloat(arvHigh.toLowerCase().replace('k', '')) * 1000).toString();
            }
            
            const arvAvg = Math.round((parseFloat(arvLow) + parseFloat(arvHigh)) / 2);
            arvValue = String(arvAvg);
          } else {
            // Single value
            let arv = arvMatch[1].replace(/,/g, '');
            // Handle K notation
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
      
      // Extract rehab estimate with more flexibility
      const rehabPatterns = [
        /(?:Rehab|Renovation|Repair|Repairs)\s*(?:Cost|Estimate|Budget)?[:;]?\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
        /(?:Rehab|REHAB)[:;]\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i,
        /(?:Rehab|REHAB)\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?K?)/i
      ];
      
      for (const pattern of rehabPatterns) {
        const rehabMatch = normalizedText.match(pattern);
        if (rehabMatch) {
          let rehab = rehabMatch[1].replace(/,/g, '');
          // Handle K notation
          if (rehab.toLowerCase().endsWith('k')) {
            rehab = (parseFloat(rehab.toLowerCase().replace('k', '')) * 1000).toString();
          }
          form.setValue('estimatedRehab', rehab);
          extracted.rehab = true;
          break;
        }
      }
      
      // Generate a description without the address
      const address = form.getValues('address') || '';
      const city = form.getValues('city') || '';
      const state = form.getValues('state') || '';
      const zipCode = form.getValues('zipCode') || '';
      
      let description = normalizedText;
      
      // Remove the address from the description if we found one
      if (extracted.address && address) {
        description = description.replace(address, '');
      }
      
      // Remove city/state/zip if we found them
      if (extracted.city && city) {
        description = description.replace(new RegExp(city, 'gi'), '');
      }
      if (extracted.state && state) {
        description = description.replace(new RegExp(state, 'gi'), '');
      }
      if (extracted.zip && zipCode) {
        description = description.replace(zipCode, '');
      }
      
      // Clean up the description
      description = description
        .replace(/\s+/g, ' ')
        .replace(/,\s*,/g, ',')
        .replace(/\s+\./g, '.')
        .trim();
      
      if (description) {
        form.setValue('description', description);
      }

      // Use Cohere API as a last resort for missing fields
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
              model: 'command-light',  // Using a lighter model to save credits
              prompt: `Extract ONLY the following missing information from this real estate listing text: ${missingFields.map(([field]) => field).join(", ")}. Format as JSON with ONLY these fields.\n\nText: ${normalizedText}\n\nJSON:`,
              max_tokens: 150,  // Reduced token count to minimize usage
              temperature: 0.1,  // Lower temperature for more deterministic output
            })
          });

          if (response.ok) {
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
                  
                  // Set market price if we don't have it yet
                  if (!extracted.marketPrice) {
                    const marketPrice = Math.round(parseFloat(price) * 1.1);
                    form.setValue('marketPrice', String(marketPrice));
                  }
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
              // Continue with what we have from regex
            }
          }
        } catch (cohereError) {
          console.log("Error using Cohere API:", cohereError);
          // Continue with what we have from regex
        }
      }
      
      // Calculate estimated rehab costs if we have ARV and price but no rehab
      const arv = form.getValues('afterRepairValue');
      const price = form.getValues('price');
      if (!extracted.rehab && arv && price) {
        const estimatedRehab = Math.round((parseFloat(arv) - parseFloat(price)) * 0.7);
        if (estimatedRehab > 0) {
          form.setValue('estimatedRehab', String(estimatedRehab));
        }
      }

      // Check if we extracted anything
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

  return (
    <div className="mb-12 relative">
      <div className="bg-slate-50/50 backdrop-blur-sm rounded-xl p-8 relative overflow-hidden">
        {/* Glow Effect */}
        <GlowEffect
          colors={['#0892D0', '#2563eb', '#3b82f6', '#60a5fa']}
          mode="flowHorizontal"
          blur="soft"
          scale={1.05}
          duration={8}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">AI Autofill</h3>
          <p className="text-sm text-gray-600 mb-6">
            Paste your property details here and Realer Estate will automatically sort it for you
          </p>
          
          <div className="relative">
            <Textarea 
              value={propertyText}
              onChange={(e) => setPropertyText(e.target.value)}
              placeholder="Paste property details here... (e.g. '123 Main St, Portland, OR 97204 • 3 Beds / 2 Baths • 1,800 SqFt • Asking: $450,000 • ARV: $500,000')"
              className="min-h-[120px] bg-white/80 backdrop-blur-sm border-gray-300 hover:border-gray-400 focus:border-gray-500"
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
      </div>
    </div>
  );
};

export default AIPropertyExtractor;
