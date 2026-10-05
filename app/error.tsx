"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client exceptions
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Container size="narrow">
        <div className="rounded-2xl border border-danger/30 bg-surface p-10 sm:p-14 text-center shadow-2xl shadow-black/50">
          <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger mx-auto mb-5">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-danger font-semibold px-3 py-1 rounded-full bg-surface-2 border border-danger/20 mb-4 inline-block">
            Runtime Error Caught
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text mb-4">
            Something went wrong.
          </h1>

          <p className="text-body-lg text-text-muted max-w-md mx-auto mb-8 leading-relaxed">
            An unexpected client-side exception occurred during execution. You can attempt to
            re-render this view or navigate back to the home page.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => reset()}>
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Try again</span>
            </Button>
            <Button variant="secondary" size="lg" href="/">
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Return home</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
