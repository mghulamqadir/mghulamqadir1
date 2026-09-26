import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { ProjectForm } from "@/components/admin/project-form";
export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) { const { supabase } = await requireAdmin(); const { data } = await supabase.from("projects").select("*").eq("id", (await params).id).single(); if (!data) notFound(); return <div><h1 className="text-3xl font-bold">Edit project</h1><div className="mt-8 rounded-2xl border border-white/10 bg-[#0f1012] p-6 md:p-8"><ProjectForm project={data} /></div></div>; }
