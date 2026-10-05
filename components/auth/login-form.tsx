"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="space-y-2 text-sm">
        <label htmlFor="login-email" className="font-mono text-xs uppercase tracking-wider text-text font-medium block">
          Email address
        </label>
        <Input
          id="login-email"
          required
          type="email"
          name="email"
          autoComplete="email"
          placeholder="admin@example.com"
          error={!!error}
        />
      </div>

      <div className="space-y-2 text-sm">
        <label htmlFor="login-password" className="font-mono text-xs uppercase tracking-wider text-text font-medium block">
          Password
        </label>
        <Input
          id="login-password"
          required
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          error={!!error}
        />
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-2 p-3.5 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs font-mono"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="w-full min-h-[48px] text-sm font-semibold"
      >
        <span>{loading ? "Signing in…" : "Sign in to CMS"}</span>
      </Button>
    </form>
  );
}
