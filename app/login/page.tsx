import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function LoginPage() { return <div className="flex min-h-[70vh] items-center justify-center px-6"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1012] p-8"><div className="mb-8 text-center"><div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#16171a] font-mono font-bold">GQ</div><h1 className="mt-5 text-2xl font-bold">Portfolio CMS</h1><p className="mt-2 text-sm text-[#71717a]">Sign in to manage your content.</p></div><LoginForm /></div></div>; }
