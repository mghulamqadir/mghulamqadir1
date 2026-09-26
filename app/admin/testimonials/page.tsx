import { ContentManager } from "@/components/admin/content-manager";
import { requireAdmin } from "@/lib/supabase/auth";
export default async function AdminTestimonialsPage() { const { supabase } = await requireAdmin(); const { data } = await supabase.from("testimonials").select("*").order("sort_order"); return <ContentManager resource="testimonials" title="Testimonials" initialItems={(data ?? []) as Array<Record<string, unknown>>} />; }
