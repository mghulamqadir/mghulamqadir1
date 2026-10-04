import { SettingsForm } from "@/components/admin/settings-form";
import { getProfile, getSettings } from "@/lib/repositories";
import { requireAdmin } from "@/lib/auth";
export default async function AdminSettingsPage() { const { user } = await requireAdmin(); const [profile, initial] = await Promise.all([getProfile(user.id), getSettings(["homepage", "seo", "contact", "resume"])]); initial.profile = profile ?? {}; return <div><p className="font-mono text-xs uppercase tracking-wider text-[#6c9cff]">Website</p><h1 className="mt-3 text-3xl font-bold">Settings</h1><p className="mt-3 text-[#a1a1aa]">Manage profile information and the shared public-site settings.</p><SettingsForm initial={initial} /></div>; }
