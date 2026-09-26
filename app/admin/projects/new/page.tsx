import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function NewProjectPage() {
  await requireAdmin();
  return <div><p className="font-mono text-xs uppercase tracking-wider text-[#6c9cff]">Content</p><h1 className="mt-3 text-3xl font-bold">New project</h1><p className="mt-3 max-w-2xl text-[#a1a1aa]">Create a draft first, then add its case study, technology, and media.</p><div className="mt-9"><ProjectForm /></div></div>;
}
