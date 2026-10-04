import { MessagesManager } from "@/components/admin/messages-manager";
import { listMessages } from "@/lib/repositories";
import { requireAdmin } from "@/lib/auth";
export default async function AdminMessagesPage() { await requireAdmin(); return <MessagesManager initialMessages={await listMessages()} />; }
