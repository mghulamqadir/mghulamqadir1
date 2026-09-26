import { MessagesManager } from "@/components/admin/messages-manager";
import { requireAdmin } from "@/lib/supabase/auth";
export default async function AdminMessagesPage() { const { supabase } = await requireAdmin(); const { data } = await supabase.from("contact_submissions").select("id,name,email,subject,message,status,email_status,brevo_message_id,created_at").order("created_at", { ascending: false }); return <MessagesManager initialMessages={data ?? []} />; }
