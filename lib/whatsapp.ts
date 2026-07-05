const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export interface SendTextResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendWhatsAppText(
  to: string,
  message: string
): Promise<SendTextResult> {
  try {
    const phone = to.replace(/\D/g, "");
    const fullPhone = phone.startsWith("91") ? phone : `91${phone}`;

    const res = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: fullPhone,
          type: "text",
          text: { body: message, preview_url: false },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data?.error?.message || "Send failed" };
    }
    return { success: true, messageId: data?.messages?.[0]?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  components: object[]
): Promise<SendTextResult> {
  try {
    const phone = to.replace(/\D/g, "");
    const fullPhone = phone.startsWith("91") ? phone : `91${phone}`;

    const res = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: fullPhone,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en_IN" },
            components,
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data?.error?.message || "Send failed" };
    }
    return { success: true, messageId: data?.messages?.[0]?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function sendWhatsAppMedia(
  to: string,
  mediaUrl: string,
  caption: string,
  mediaType: "image" | "document"
): Promise<SendTextResult> {
  try {
    const phone = to.replace(/\D/g, "");
    const fullPhone = phone.startsWith("91") ? phone : `91${phone}`;

    const res = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: fullPhone,
          type: mediaType,
          [mediaType]: { link: mediaUrl, caption },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data?.error?.message || "Send failed" };
    }
    return { success: true, messageId: data?.messages?.[0]?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function downloadWhatsAppMedia(
  mediaId: string
): Promise<{ url: string; mimeType: string } | null> {
  try {
    const res = await fetch(`${WHATSAPP_API_URL}/${mediaId}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });
    const data = await res.json();
    if (!res.ok || !data.url) return null;

    // Fetch the actual URL (which requires auth header)
    return { url: data.url, mimeType: data.mime_type };
  } catch {
    return null;
  }
}

export async function downloadMediaBuffer(
  mediaUrl: string
): Promise<Buffer | null> {
  try {
    const res = await fetch(mediaUrl, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer);
  } catch {
    return null;
  }
}

export function buildFollowUpMessage(
  name: string,
  loanType: string,
  followUpNumber: number
): string {
  const messages = [
    `Hi ${name}! 👋 This is Srivastava Associates. We tried reaching you regarding your *${loanType}* enquiry. Are you still interested? Please reply or call us at 8306445333. We're happy to help! 🏦`,
    `Hello ${name}! Following up on your *${loanType}* enquiry with Srivastava Associates. We have great loan options for you from 30+ banks & NBFCs. Please let us know if you'd like to proceed. Call: 8306445333`,
    `Dear ${name}, this is our final follow-up regarding your *${loanType}* enquiry. If you're still interested in a loan, please reply to this message or call us at 8306445333. We're here to make your dream possible! 🌟 — Srivastava Associates`,
  ];
  return messages[Math.min(followUpNumber - 1, 2)];
}

export function buildDocAckMessage(name: string, docLabel: string): string {
  return `✅ Hi ${name}! We've received your *${docLabel}*. Our team will verify it shortly.\n\nIf you have more documents to share, please send them here.\n\n— Srivastava Associates\n📞 8306445333`;
}
