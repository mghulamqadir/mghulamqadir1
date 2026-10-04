import { NextResponse } from "next/server";
import { audit, createResource } from "@/lib/repositories";
import { requireAdminApi } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";
import { contentSchemas, isContentResource } from "@/lib/content/content-config";

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) { const auth = await requireAdminApi(request); if ("response" in auth) return auth.response; const { resource } = await params; if (!isContentResource(resource)) return NextResponse.json({ error: "Unknown content resource" }, { status: 404 }); const parsed = contentSchemas[resource].safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid content data" }, { status: 400 }); const data = await createResource(resource, parsed.data); await audit(auth.user.id, `${resource}.created`, resource, data.id); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/experience"); return NextResponse.json(data, { status: 201 }); }
