
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string; // optional, falls back to default sender
}

const DEFAULT_FROM = {
  name: "Realer Estate",
  email: "no-reply@realerestate.app"
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.subject || (!payload.html && !payload.text)) {
      return new Response(
        JSON.stringify({ error: "Missing required email fields (to, subject, html or text)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize recipient(s)
    const recipients = Array.isArray(payload.to)
      ? payload.to.map(email => ({ email }))
      : [{ email: payload.to }];

    // Parse sender details
    let from = DEFAULT_FROM;
    if (payload.from) {
      // Try to parse "Name <email@domain.com>" format
      const match = /^(.+)\s+<(.+@.+\..+)>$/.exec(payload.from);
      if (match) {
        from = {
          name: match[1].trim(),
          email: match[2].trim()
        };
      } else if (/^[^@]+@[^@]+\.[^@]+$/.test(payload.from)) {
        from = {
          name: "Realer Estate",
          email: payload.from.trim()
        };
      }
    }

    // Compose Brevo payload
    const brevoPayload = {
      sender: from,
      to: recipients,
      subject: payload.subject,
      htmlContent: payload.html,
      textContent: payload.text
    };

    // Send via Brevo API
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        ...corsHeaders,
      },
      body: JSON.stringify(brevoPayload)
    });

    const brevoData = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error("Brevo error:", brevoData);
      return new Response(
        JSON.stringify({ error: brevoData.message || "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: brevoData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
