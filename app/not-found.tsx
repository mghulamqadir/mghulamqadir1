import React from "react";
import { Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Container size="narrow">
        <div className="relative rounded-2xl border border-border bg-surface p-10 sm:p-14 text-center shadow-2xl shadow-black/50 overflow-hidden">
          {/* Decorative watermark 404 */}
          <div
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-[140px] font-mono font-black text-white/[0.02] select-none"
            aria-hidden="true"
          >
            404
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full bg-surface-2 border border-border mb-4">
              Error 404 • Resource Not Found
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text mb-4">
              This page does not exist.
            </h1>

            <p className="text-body-lg text-text-muted max-w-md mx-auto mb-8 leading-relaxed">
              The page you are looking for may have been relocated, unlisted, or does not exist in
              the production route tree.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="primary" size="lg" href="/">
                <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Return to homepage</span>
              </Button>
              <Button variant="secondary" size="lg" href="/projects">
                <span>View projects</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
