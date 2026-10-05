import React from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-bg-elevated/60 border-t border-border">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[320px] bg-accent/10 rounded-full blur-[120px]"
        aria-hidden="true"
      />

      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-2 border border-border text-xs font-mono text-accent mb-6 font-medium">
            <span>Direct Collaboration</span>
          </div>

          <h2 className="text-display text-text font-semibold tracking-tight mb-5">
            Let&apos;s build something resilient.
          </h2>

          <p className="text-body-lg text-text-muted leading-relaxed mb-8 max-w-xl">
            Whether you&apos;re architecting a high-throughput API, building an intelligent AI/RAG
            pipeline, or scaling a SaaS platform, I&apos;d love to connect.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              href="/contact"
              className="w-full sm:w-auto min-h-[48px] px-7 text-sm font-semibold"
            >
              <span>Get in touch</span>
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="mailto:mohammadghulam.qadir@gmail.com"
              external
              className="w-full sm:w-auto min-h-[48px] px-6 text-sm font-medium"
            >
              <Mail className="w-4 h-4 mr-2 text-text-muted" aria-hidden="true" />
              <span>Email directly</span>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs font-mono text-text-faint">
            <span>Response within 24 hours</span>
            <span aria-hidden="true">•</span>
            <span className="text-text-muted">mohammadghulam.qadir@gmail.com</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
