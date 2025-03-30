
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { property } = await req.json();
    
    if (!property) {
      return new Response(
        JSON.stringify({ error: "Property data is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Generating blog post for property:", property.title);

    try {
      // Try to use Anthropic API if available
      if (ANTHROPIC_API_KEY) {
        // Call the Anthropic API
        const response = await fetch(ANTHROPIC_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 1000,
            system: `You are a real estate marketing expert who specializes in creating SEO-optimized blog content. 
You're writing an article about a below-market property to generate interest.

Important guidelines:
- Do NOT include the exact address - use general location only (city/neighborhood)
- Focus on the value proposition (${property.belowMarket}% below market)
- Highlight key features: ${property.beds} bedrooms, ${property.baths} bathrooms, ${property.sqft} square feet
- Create an engaging title that mentions "below market opportunity"
- Write in a professional but conversational tone
- Include 3-5 paragraphs of content
- Finish with a call to action to join the waitlist to see the property
- Format the content properly with HTML tags like <h2> and <p> but do NOT include these tags in your response
- Total length should be 300-500 words`,
            messages: [
              { 
                role: "user", 
                content: `Please write an SEO-optimized blog post about this property:
- Title: ${property.title}
- Price: $${property.price}
- Market Price: $${property.marketPrice}
- Below Market: ${property.belowMarket}%
- Location: ${property.location}
- Beds: ${property.beds}
- Baths: ${property.baths}
- Square Feet: ${property.sqft}
- Description: ${property.description || "A great investment opportunity below market value."}

The blog post should highlight the below-market opportunity without revealing the exact address.
Do NOT include HTML tags like <h1>, <h2>, <p> etc. in your response. Write clean text only.`
              }
            ]
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error("Anthropic API error:", data);
          throw new Error("Failed to generate content from Anthropic API");
        }
        
        // Extract the generated content
        const generatedText = data.content?.[0]?.text || "Failed to generate content";
        
        // Parse out a good title from the generated text
        let title = "Below Market Property Opportunity";
        const titleMatch = generatedText.match(/^(.+?)(?:\n|$)/);
        
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        }
        
        // Get the content without the title
        let content = generatedText;
        if (titleMatch) {
          content = generatedText.substring(titleMatch[0].length).trim();
        }
        
        // Extract a short excerpt
        const excerpt = content.substring(0, 150) + "...";
        
        // Return the generated content, title and excerpt
        return new Response(
          JSON.stringify({ 
            content: content,
            title: title,
            excerpt: excerpt 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        throw new Error("Anthropic API key not available");
      }
    } catch (anthropicError) {
      console.log("Falling back to static content generation due to:", anthropicError.message);
      
      // Fallback content generation when Anthropic API fails
      const formattedPrice = property.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
      const formattedMarketPrice = property.marketPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
      
      const title = `Incredible Value: ${property.belowMarket}% Below Market in ${property.location}`;
      
      const content = `
Incredible Value: ${property.belowMarket}% Below Market in ${property.location}

We're excited to present an exceptional investment opportunity in ${property.location}. This ${property.beds}-bedroom, ${property.baths}-bathroom property with ${property.sqft} square feet of living space is currently available at ${formattedPrice}, which is ${property.belowMarket}% below the estimated market value of ${formattedMarketPrice}!

Property Highlights
This spacious home features ${property.beds} comfortable bedrooms and ${property.baths} well-appointed bathrooms. With ${property.sqft} square feet of living space, there's plenty of room for family and entertaining. Located in the desirable area of ${property.location}, this property combines value with an excellent location.

Amazing Value Opportunity
Priced at just ${formattedPrice}, this property represents an incredible ${property.belowMarket}% discount from its estimated market value of ${formattedMarketPrice}. Whether you're looking for a primary residence, a rental property, or an investment opportunity, the significant below-market pricing makes this an option worth serious consideration.

Why Below Market?
${property.description || "The seller is motivated and needs to close quickly, creating this rare below-market opportunity for savvy buyers. Properties like this don't stay available for long, especially with such attractive pricing."}

Take Action Now
To schedule a viewing or learn more about this below-market property, join our waitlist today. Our below-market properties typically sell quickly, so don't miss your chance to secure this exceptional value opportunity in ${property.location}.`;
      
      const excerpt = `Discover an exceptional investment opportunity in ${property.location}. This ${property.beds}-bedroom, ${property.baths}-bathroom property is available at ${property.belowMarket}% below market value. Don't miss this rare chance to secure...`;

      return new Response(
        JSON.stringify({ 
          content,
          title,
          excerpt 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in generate-property-blog function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
