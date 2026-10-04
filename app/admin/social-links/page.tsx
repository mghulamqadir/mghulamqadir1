import { ContentManager } from "@/components/admin/content-manager";
import { listResource } from "@/lib/repositories";
import { requireAdmin } from "@/lib/auth";
export default async function AdminSocialLinksPage() { await requireAdmin(); return <ContentManager resource="social_links" title="Social links" initialItems={await listResource("social_links")} />; }
