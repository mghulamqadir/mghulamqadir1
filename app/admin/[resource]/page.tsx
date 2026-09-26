import { notFound } from "next/navigation";
import { ContentManager } from "@/components/admin/content-manager";
import { contentLabels, isContentResource } from "@/lib/admin-content";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function ContentPage({ params }: { params: Promise<{ resource: string }> }) { const { resource } = await params; if (!isContentResource(resource)) notFound(); const { supabase } = await requireAdmin(); const { data } = await supabase.from(resource).select("*").order("sort_order"); return <ContentManager resource={resource} title={contentLabels[resource]} initialItems={(data ?? []) as Array<Record<string, unknown>>} />; }
