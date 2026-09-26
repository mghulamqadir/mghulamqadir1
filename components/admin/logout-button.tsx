"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export function LogoutButton() { const router = useRouter(); return <button onClick={async () => { await createClient()?.auth.signOut(); router.push("/login"); }} className="text-sm text-[#a1a1aa] hover:text-white">Logout</button>; }
