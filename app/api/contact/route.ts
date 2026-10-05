import { NextResponse } from "next/server";
import { buildContactEmail } from "@/lib/email/contact-message";
import { env } from "@/lib/env";
import { insertMessage, updateMessage } from "@/lib/repositories";
import { isRateLimited } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations";

const RATE_LIMIT_MS = 30_000;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? "unknown";
  if (isRateLimited(ip, RATE_LIMIT_MS)) return NextResponse.json({ error: "Please wait before sending another message." }, { status: 429 });
  const rawBody = await request.json().catch(() => null);
  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }
  if (rawBody.website) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const message = firstIssue?.message || "Please check the form and try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  let id: string;
  try { id = await insertMessage({ name: parsed.data.name, email: parsed.data.email, subject: parsed.data.subject, message: parsed.data.message }); } catch (error) { console.error("Contact submission persistence failed", { message: error instanceof Error ? error.message : "unknown" }); return NextResponse.json({ error: "Unable to save your message right now." }, { status: 503 }); }
  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) return NextResponse.json({ ok: true, id, delivery: "pending" }, { status: 202 });
  const template = buildContactEmail({ ...parsed.data, receivedAt: new Date().toISOString() });
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { accept: "application/json", "api-key": env.BREVO_API_KEY, "content-type": "application/json" }, body: JSON.stringify({ sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME }, to: [{ email: env.CONTACT_TO_EMAIL }], replyTo: { email: parsed.data.email, name: parsed.data.name }, subject: `Portfolio Contact — ${parsed.data.subject}`, ...template }) });
    const result = await response.json().catch(() => null) as { messageId?: string } | null;
    if (!response.ok) { await updateMessage(id, { email_status: "failed" }); return NextResponse.json({ ok: true, id, delivery: "failed" }, { status: 202 }); }
    await updateMessage(id, { email_status: "sent", brevo_message_id: result?.messageId ?? null });
    return NextResponse.json({ ok: true, id });
  } catch {
    await updateMessage(id, { email_status: "failed" });
    return NextResponse.json({ ok: true, id, delivery: "failed" }, { status: 202 });
  }
}
