import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { audit, saveSettings } from "@/lib/repositories";
import { requireAdminApi } from "@/lib/api-auth";
const text = (max: number) => z.string().trim().max(max).optional();
const url = z.union([z.literal(""), z.string().url().max(500).refine((value) => /^https?:\/\//.test(value))]).optional();
const schema = z.object({ profile: z.object({ full_name: text(160), headline: text(180), short_bio: text(500), long_bio: text(10000), location: text(160), email: z.union([z.literal(""), z.string().email()]).optional(), availability_status: text(120) }).strict(), homepage: z.object({ hero_eyebrow: text(180), hero_title: text(240), hero_description: text(1000) }).strict(), seo: z.object({ title: text(120), description: text(300) }).strict(), contact: z.object({ email: z.union([z.literal(""), z.string().email()]).optional() }).strict(), resume: z.object({ secure_url: url, public_id: text(500) }).strict() }).strict();
export async function PUT(request: Request) { const auth = await requireAdminApi(request); if ("response" in auth) return auth.response; const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid settings" }, { status: 400 }); const { profile, ...settings } = parsed.data; await saveSettings(auth.user.id, profile, settings); await audit(auth.user.id, "settings.updated", "site_settings"); revalidatePath("/"); revalidatePath("/about"); return NextResponse.json({ ok: true }); }
