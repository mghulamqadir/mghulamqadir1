import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { audit, saveSettings } from "@/lib/repositories";
import { requireAdminApi } from "@/lib/api-auth";
import { siteSettingsSchema } from "@/lib/schema";
export async function PUT(request: Request) { const auth = await requireAdminApi(request); if ("response" in auth) return auth.response; const parsed = siteSettingsSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid settings" }, { status: 400 }); const { profile, ...settings } = parsed.data; await saveSettings(auth.user.id, profile, settings); await audit(auth.user.id, "settings.updated", "site_settings"); revalidatePath("/"); revalidatePath("/about"); return NextResponse.json({ ok: true }); }
