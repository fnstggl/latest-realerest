
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
    
    // Construct a prompt that instructs Claude to generate a blog post about the property
    const systemPrompt = `You are a real estate marketing expert who specializes in creating SEO-optimized blog content. 
You're writing an article about an below-market property to generate interest.

Important guidelines:
- Do NOT include the exact address - use general location only (city/neighborhood)
- Focus on the value proposition (${property.belowMarket}% below market)
- Highlight key features: ${property.beds} bedrooms, ${property.baths} bathrooms, ${property.sqft} square feet
- Create an engaging title that mentions "below market opportunity"
- Write in a professional but conversational tone
- Include 3-5 paragraphs of content
- Finish with a call to action to join the waitlist to see the property
- Format the content properly with HTML tags (<h2>, <p>, etc.)
- Total length should be 300-500 words`;

    const userPrompt = `Please write an SEO-optimized blog post about this property:
- Title: ${property.title}
- Price: $${property.price}
- Market Price: $${property.marketPrice}
- Below Market: ${property.belowMarket}%
- Location: ${property.location}
- Beds: ${property.beds}
- Baths: ${property.baths}
- Square Feet: ${property.sqft}
- Description: ${property.description || "A great investment opportunity below market value."}

The blog post should highlight the below-market opportunity without revealing the exact address.`;
    
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
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to generate blog post", details: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract the generated content
    const generatedText = data.content?.[0]?.text || "Failed to generate content";
    
    // Parse out a good title from the generated text
    let title = "Below Market Property Opportunity";
    const titleMatch = generatedText.match(/<h1[^>]*>(.*?)<\/h1>/i) || 
                      generatedText.match(/^#\s+(.*?)$/m) ||
                      generatedText.match(/^(.+?)(?:\n|$)/);
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    
    // Extract a short excerpt
    let excerpt = "";
    const contentWithoutTags = generatedText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    excerpt = contentWithoutTags.substring(0, 150) + "...";
    
    // Return the generated content, title and excerpt
    return new Response(
      JSON.stringify({ 
        content: generatedText,
        title: title,
        excerpt: excerpt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in generate-property-blog function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
