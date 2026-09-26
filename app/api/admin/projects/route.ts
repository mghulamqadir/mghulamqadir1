import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { projectSchema } from "@/lib/validations";
export async function POST(request: Request) { const { supabase, user } = await requireAdmin(); const parsed = projectSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid project data" }, { status: 400 }); const { data, error } = await supabase.from("projects").insert(parsed.data).select("id,slug").single(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); await supabase.from("audit_logs").insert({ user_id: user.id, action: "project.created", entity: "projects", entity_id: data.id }); revalidatePath("/"); revalidatePath("/projects"); return NextResponse.json(data, { status: 201 }); }
