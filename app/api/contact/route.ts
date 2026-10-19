import { after, NextResponse } from "next/server";
import { deliverContactMessage } from "@/lib/email/deliver-contact-message";
import { env } from "@/lib/env";
import { insertMessage } from "@/lib/repositories";
import { isRateLimited } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations";
import { getClientIpFromHeaders } from "@/lib/logging/request-tracker";

const RATE_LIMIT_MS = 30_000;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const ip = getClientIpFromHeaders(request.headers);
  if (isRateLimited(ip, RATE_LIMIT_MS)) return NextResponse.json({ error: "Please wait before sending another message." }, { status: 429 });
  const rawBody = await request.json().catch(() => null);
  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }
  if (rawBody.website) {
    return NextResponse.json({ error: "Spam verification failed. Please leave the website field blank." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const message = firstIssue?.message || "Please check the form and try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  let id: string;
  try { id = await insertMessage({ name: parsed.data.name, email: parsed.data.email, subject: parsed.data.subject, message: parsed.data.message }); } catch (error) { console.error("Contact submission persistence failed", { message: error instanceof Error ? error.message : "unknown" }); return NextResponse.json({ error: "Unable to save your message right now." }, { status: 503 }); }
  if (env.BREVO_API_KEY && env.BREVO_SENDER_EMAIL && env.BREVO_SENDER_NAME && env.CONTACT_TO_EMAIL) {
    const message = { name: parsed.data.name, email: parsed.data.email, subject: parsed.data.subject, message: parsed.data.message };
    after(() => deliverContactMessage(id, message));
  }
  return NextResponse.json({ ok: true, id, delivery: "pending" }, { status: 202 });
}
