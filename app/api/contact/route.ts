import { NextResponse } from "next/server";
import { buildContactEmail } from "@/lib/email/contact-message";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations";

const recent = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

async function getWriter() {
  const admin = createAdminClient();
  if (admin) return { client: admin, privileged: true };
  if (process.env.NODE_ENV === "production") return null;
  const client = await createClient();
  return client ? { client, privileged: false } : null;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  if (now - (recent.get(ip) ?? 0) < RATE_LIMIT_MS) return NextResponse.json({ error: "Please wait before sending another message." }, { status: 429 });
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.website) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  recent.set(ip, now);
  const writer = await getWriter();
  if (!writer) return NextResponse.json({ error: "Contact service is not configured securely yet." }, { status: 503 });
  const id = crypto.randomUUID();
  const { error: insertError } = await writer.client.from("contact_submissions").insert({ id, name: parsed.data.name, email: parsed.data.email, subject: parsed.data.subject, message: parsed.data.message });
  if (insertError) { console.error("Contact submission persistence failed", { code: insertError.code }); return NextResponse.json({ error: "Unable to save your message right now." }, { status: 503 }); }
  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) return NextResponse.json({ error: "Message saved, but email delivery is not configured." }, { status: 503 });
  const template = buildContactEmail({ ...parsed.data, receivedAt: new Date().toISOString() });
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { accept: "application/json", "api-key": env.BREVO_API_KEY, "content-type": "application/json" }, body: JSON.stringify({ sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME }, to: [{ email: env.CONTACT_TO_EMAIL }], replyTo: { email: parsed.data.email, name: parsed.data.name }, subject: `Portfolio Contact — ${parsed.data.subject}`, ...template }) });
    const result = await response.json().catch(() => null) as { messageId?: string } | null;
    if (!response.ok) { if (writer.privileged) await writer.client.from("contact_submissions").update({ email_status: "failed" }).eq("id", id); return NextResponse.json({ error: "Message saved, but email delivery failed." }, { status: 502 }); }
    if (writer.privileged) await writer.client.from("contact_submissions").update({ email_status: "sent", brevo_message_id: result?.messageId ?? null }).eq("id", id);
    return NextResponse.json({ ok: true, id });
  } catch {
    if (writer.privileged) await writer.client.from("contact_submissions").update({ email_status: "failed" }).eq("id", id);
    return NextResponse.json({ error: "Message saved, but email delivery failed." }, { status: 502 });
  }
}
