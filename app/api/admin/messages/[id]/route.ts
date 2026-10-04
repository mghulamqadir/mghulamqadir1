import { NextResponse } from "next/server";
import { z } from "zod";
import { audit, deleteMessage, updateMessage } from "@/lib/repositories";
import { requireAdminApi } from "@/lib/api-auth";
const statusSchema = z.object({ status: z.enum(["unread", "read", "archived"]) }).strict();
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const auth = await requireAdminApi(request); if ("response" in auth) return auth.response; const parsed = statusSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 }); const { id } = await params; await updateMessage(id, parsed.data); await audit(auth.user.id, "message.updated", "contact_submissions", id); return NextResponse.json({ ok: true }); }
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) { const auth = await requireAdminApi(request); if ("response" in auth) return auth.response; const { id } = await params; await deleteMessage(id); await audit(auth.user.id, "message.deleted", "contact_submissions", id); return NextResponse.json({ ok: true }); }
