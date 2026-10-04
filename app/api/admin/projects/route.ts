import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { audit, createProject } from "@/lib/repositories";
import { requireAdminApi } from "@/lib/api-auth";
import { projectSchema } from "@/lib/validations";
export async function POST(request: Request) { const auth = await requireAdminApi(request); if ("response" in auth) return auth.response; const parsed = projectSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid project data" }, { status: 400 }); try { const data = await createProject(parsed.data); await audit(auth.user.id, "project.created", "projects", data.id); revalidatePath("/"); revalidatePath("/projects"); return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 }); } catch { return NextResponse.json({ error: "Unable to create project. The slug may already exist." }, { status: 400 }); } }
