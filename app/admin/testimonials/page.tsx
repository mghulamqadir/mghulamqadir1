import { ContentManager } from "@/components/admin/content-manager";
import { listResource } from "@/lib/repositories";
import { requireAdmin } from "@/lib/auth";
export default async function AdminTestimonialsPage() { await requireAdmin(); return <ContentManager resource="testimonials" title="Testimonials" initialItems={await listResource("testimonials")} />; }
