
export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string; // optional, "Name <email@domain.com>" or just email
}

export interface SendEmailResult {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

/**
 * Sends an email by calling the Supabase Edge Function "send-email".
 * 
 * @param payload - The email data (to, subject, html, text, etc.)
 * @returns An object with success, data, and optional error properties.
 */
export async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  try {
    const res = await fetch('/functions/v1/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Add auth headers if needed in the future
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Failed to send email',
        status: res.status,
        data,
      };
    }

    return {
      success: true,
      data,
      status: res.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error sending email',
    };
  }
}
