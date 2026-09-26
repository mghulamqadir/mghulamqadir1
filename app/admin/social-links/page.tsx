import { ContentManager } from "@/components/admin/content-manager";
import { requireAdmin } from "@/lib/supabase/auth";
export default async function AdminSocialLinksPage() { const { supabase } = await requireAdmin(); const { data } = await supabase.from("social_links").select("*").order("sort_order"); return <ContentManager resource="social_links" title="Social links" initialItems={(data ?? []) as Array<Record<string, unknown>>} />; }
