import { notFound } from "next/navigation";
import { findProject } from "@/lib/repositories";
import { requireAdmin } from "@/lib/auth";
import { ProjectForm } from "@/components/admin/project-form";
export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) { await requireAdmin(); const data = await findProject((await params).id); if (!data) notFound(); return <div><h1 className="text-3xl font-bold">Edit project</h1><div className="mt-8 rounded-2xl border border-white/10 bg-[#0f1012] p-6 md:p-8"><ProjectForm project={data as unknown as Record<string, unknown>} /></div></div>; }
