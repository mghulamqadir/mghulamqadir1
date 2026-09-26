import { ContentManager } from "@/components/admin/content-manager";
import { requireAdmin } from "@/lib/supabase/auth";
export default async function AdminExperiencePage() { const { supabase } = await requireAdmin(); const { data } = await supabase.from("experiences").select("*").order("sort_order"); return <ContentManager resource="experiences" title="Experience" initialItems={(data ?? []) as Array<Record<string, unknown>>} />; }
