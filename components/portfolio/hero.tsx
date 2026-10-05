import React from "react";
import Image from "next/image";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { BRAND_CONFIG } from "./brand-config";

export function Hero() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-32 overflow-hidden hero-gold-glow">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy, Identity, CTAs, Proof Strip (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 max-w-2xl">
            {/* 1. Role line & Geographic meta */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="text-accent font-semibold tracking-wide uppercase">
                {BRAND_CONFIG.role}
              </span>
              <span className="text-border-strong" aria-hidden="true">•</span>
              <span className="text-text-muted">
                {BRAND_CONFIG.location} ({BRAND_CONFIG.timezone})
              </span>
            </div>

            {/* 2. Main Headline (LCP Candidate: No opacity-0 animations) */}
            <h1 className="text-display text-text font-semibold tracking-tight">
              Backend systems built for{" "}
              <span className="text-signature-gradient font-bold">production</span>{" "}
              resilience.
            </h1>

            {/* 3. Supporting sentence (<= 24 words from existing copy) */}
            <p className="text-body-lg text-text-muted leading-relaxed max-w-xl">
              {BRAND_CONFIG.bioSentence}
            </p>

            {/* 4. Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                href="#featured-work"
                className="w-full sm:w-auto group min-h-[48px] px-6 text-sm font-semibold"
              >
                <span>View projects</span>
                <ArrowRight
                  className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/contact"
                className="w-full sm:w-auto min-h-[48px] px-6 text-sm font-medium"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-text-muted" aria-hidden="true" />
                <span>Get in touch</span>
              </Button>
            </div>

            {/* 5. Proof Strip (from verified fallback data) */}
            <div className="pt-6 mt-2 border-t border-border w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-text-muted">
              <div className="flex flex-col gap-1">
                <span className="text-text font-semibold text-sm">4 Flagship Projects</span>
                <span className="text-text-faint">AI & Distributed Systems</span>
              </div>
              <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-border sm:pl-4 pt-2 sm:pt-0">
                <span className="text-text font-semibold text-sm">Core Stack</span>
                <span className="text-text-faint">Node.js • AI/RAG • Postgres</span>
              </div>
              <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-border sm:pl-4 pt-2 sm:pt-0">
                <span className="text-text font-semibold text-sm">Experience</span>
                <span className="text-text-faint">Zweidevs • Cinqdev • StepInn</span>
              </div>
            </div>
          </div>

          {/* Right Column: The Portrait Frame (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[420px] lg:max-w-[460px] aspect-[3/4] max-h-[620px] rounded-2xl p-1 bg-surface border border-border shadow-[0_0_50px_rgba(242,184,100,0.12)] transition-all duration-300">
              {/* Outer soft edge vignette / blend */}
              <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-bg-elevated">
                <Image
                  src={BRAND_CONFIG.portrait.src}
                  alt={BRAND_CONFIG.portrait.alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 420px, 460px"
                  className="object-cover rounded-[14px] transition-transform duration-700 hover:scale-[1.01]"
                  style={{ objectPosition: "50% 20%" }}
                  quality={85}
                />
                {/* Soft gradient mask blending outer lower edge into --bg */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-40"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-[14px] border border-white/[0.06]"
                  aria-hidden="true"
                />
              </div>

              {/* Ambient moonlit gold backlight */}
              <div
                className="pointer-events-none absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-accent/15 blur-3xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
