import { buildContactEmail, type ContactEmail } from "@/lib/email/contact-message";
import { env } from "@/lib/env";
import { updateMessage } from "@/lib/repositories/messages";

export const BREVO_TIMEOUT_MS = 8_000;

export async function deliverContactMessage(id: string, message: Omit<ContactEmail, "receivedAt">): Promise<void> {
  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL || !env.BREVO_SENDER_NAME || !env.CONTACT_TO_EMAIL) return;

  const template = buildContactEmail({ ...message, receivedAt: new Date().toISOString() });
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME },
        to: [{ email: env.CONTACT_TO_EMAIL }],
        replyTo: { email: message.email, name: message.name },
        subject: `Portfolio Contact — ${message.subject}`,
        ...template,
      }),
      signal: AbortSignal.timeout(BREVO_TIMEOUT_MS),
    });
    const result = await response.json().catch(() => null) as { messageId?: string } | null;
    if (!response.ok) throw new Error(`Brevo returned ${response.status}`);
    await updateMessage(id, { email_status: "sent", brevo_message_id: result?.messageId ?? null });
  } catch (error) {
    console.error("Contact email delivery failed", {
      id,
      message: error instanceof Error ? error.message : "unknown",
    });
    try {
      await updateMessage(id, { email_status: "failed" });
    } catch (updateError) {
      console.error("Contact email status update failed", {
        id,
        message: updateError instanceof Error ? updateError.message : "unknown",
      });
    }
  }
}
