import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, Terminal, Bot } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/components/portfolio/brand-config";
import { getExperiences, getTechnologies } from "@/lib/data/public";
import { formatExperienceDateRange } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Ghulam Qadir, Backend-Focused Full Stack Engineer building production AI/RAG systems and resilient web platforms.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [experiences, technologies] = await Promise.all([
    getExperiences(),
    getTechnologies(),
  ]);

  // Group technologies by category
  const techByCategory = technologies.reduce<Record<string, typeof technologies>>((acc, tech) => {
    (acc[tech.category] ??= []).push(tech);
    return acc;
  }, {});

  return (
    <div className="py-16 md:py-24 lg:py-28">
      <Container>
        {/* Hero Section: Bio + Portrait Variant */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20 md:mb-28">
          {/* Bio Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 max-w-2xl">
            <Eyebrow>About Ghulam Qadir</Eyebrow>
            <h1 className="text-display text-text font-semibold tracking-tight">
              Building reliable systems behind modern digital products.
            </h1>
            <p className="text-body-lg text-text-muted leading-relaxed">
              I am a Backend-Focused Full Stack Engineer based in Lahore, Pakistan. Over the past several
              years, I have designed and deployed high-throughput APIs, sequential AI/RAG pipelines,
              payment architectures via Stripe Connect, and scalable web platforms.
            </p>
            <p className="text-body-lg text-text-muted leading-relaxed">
              My engineering philosophy revolves around defensiveness and clarity: strict Zod contract
              validation at every ingress, deterministic database transactions, and end-to-end
              observability so systems stay resilient under production load.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="primary" size="lg" href="/contact">
                <span>Start a conversation</span>
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
              <Button variant="secondary" size="lg" href="/projects">
                <span>View case studies</span>
              </Button>
            </div>
          </div>

          {/* Portrait Variant (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[360px] aspect-[3/4] rounded-2xl p-1 bg-surface border border-border shadow-xl shadow-black/50">
              <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-bg-elevated">
                <Image
                  src={BRAND_CONFIG.portrait.src}
                  alt={BRAND_CONFIG.portrait.alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, 360px"
                  className="object-cover rounded-[14px]"
                  style={{ objectPosition: "50% 20%" }}
                  quality={85}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
              <div
                className="pointer-events-none absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-accent/15 blur-2xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Pillars / Current Focus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 md:mb-28">
          <div className="rounded-2xl border border-border bg-surface p-7 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-accent mb-5">
              <Terminal className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-text tracking-tight mb-2">Backend Architecture</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Clean layered domain services, deterministic rate limiting, authenticated sessions,
              and low-latency REST endpoints.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-7 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-accent mb-5">
              <Bot className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-text tracking-tight mb-2">AI &amp; RAG Systems</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Multi-stage sequential LLM processing pipelines with contextual vector retrieval and
              retry fallback resilience.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-7 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-accent mb-5">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-text tracking-tight mb-2">Production Security</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Cryptographically signed Cloudinary uploads, role-based authorization guards, and strict
              schema parsing.
            </p>
          </div>
        </div>

        {/* Skills Grouped by Category */}
        <section className="mb-20 md:mb-28 rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-sm">
          <Eyebrow className="mb-3">Technical Capabilities</Eyebrow>
          <h2 className="text-heading-2 text-text font-semibold tracking-tight mb-8">
            Skills &amp; Technologies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(techByCategory).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((tech) => (
                    <Badge key={tech.id ?? tech.name} variant="default" font="mono">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline Section */}
        <section className="border-t border-border pt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <Eyebrow className="mb-2">Career Trajectory</Eyebrow>
              <h2 className="text-heading-2 text-text font-semibold tracking-tight">
                Work History
              </h2>
            </div>
            <Link
              href="/experience"
              className="font-mono text-xs text-accent hover:text-accent-strong flex items-center gap-1 transition-colors"
            >
              <span>View full timeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-6">
            {experiences.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 sm:grid-cols-12 rounded-xl border border-border bg-surface p-6 sm:p-7 hover:border-border-strong transition-colors"
              >
                <div className="sm:col-span-4 flex flex-col gap-1">
                  <span className="font-mono text-xs font-semibold text-accent">
                    {formatExperienceDateRange(item.start_date, item.end_date, item.current_role)}
                  </span>
                  <span className="text-xs text-text-faint">{item.location}</span>
                </div>

                <div className="sm:col-span-8">
                  <h3 className="text-lg font-bold text-text">
                    {item.role} <span className="text-text-muted font-normal">at</span> {item.company}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      {item.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-text-faint">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
