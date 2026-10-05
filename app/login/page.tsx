import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";
import { BrandMark } from "@/components/brand/brand-mark";

export const metadata: Metadata = {
  title: "CMS Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-2xl shadow-black/50">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-2 text-accent shadow-sm">
            <BrandMark size={44} />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-text">Portfolio CMS</h1>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to manage your portfolio content.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
