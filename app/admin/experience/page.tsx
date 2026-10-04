import { ContentManager } from "@/components/admin/content-manager";
import { listResource } from "@/lib/repositories";
import { requireAdmin } from "@/lib/auth";
export default async function AdminExperiencePage() { await requireAdmin(); return <ContentManager resource="experiences" title="Experience" initialItems={await listResource("experiences")} />; }
