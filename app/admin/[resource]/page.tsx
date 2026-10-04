import { notFound } from "next/navigation";
import { ContentManager } from "@/components/admin/content-manager";
import { contentLabels, isContentResource } from "@/lib/content/content-config";
import { listResource } from "@/lib/repositories";
import { requireAdmin } from "@/lib/auth";

export default async function ContentPage({ params }: { params: Promise<{ resource: string }> }) { const { resource } = await params; if (!isContentResource(resource)) notFound(); await requireAdmin(); return <ContentManager resource={resource} title={contentLabels[resource]} initialItems={await listResource(resource)} />; }
