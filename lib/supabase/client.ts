import { createBrowserClient } from "@supabase/ssr";
import { env, hasSupabase } from "@/lib/env";

export function createClient() {
  if (!hasSupabase()) return null;
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}
