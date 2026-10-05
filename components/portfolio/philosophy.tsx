import React from "react";
import { ShieldCheck, Activity, Lock, RefreshCw, GitBranch, Zap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export function EngineeringPhilosophy() {
  const principles = [
    {
      title: "Reliability & Resilience",
      icon: RefreshCw,
      description:
        "Building systems that absorb API rate limits, network timeouts, and malformed payloads gracefully using exponential backoff, circuit breaking, and deterministic fallbacks.",
    },
    {
      title: "Defensive Data Validation",
      icon: ShieldCheck,
      description:
        "Validating every boundary with strict Zod schemas and database constraints before processing, eliminating silent type drift and corrupted records.",
    },
    {
      title: "Observability & Telemetry",
      icon: Activity,
      description:
        "Instrumenting structured logs, audit trails, and stage-by-stage pipeline timing so production anomalies are diagnosed in minutes rather than guessed.",
    },
    {
      title: "Production Security",
      icon: Lock,
      description:
        "Enforcing cryptographically signed uploads, scoped API credentials, role-based mutation guards, and secure session management.",
    },
    {
      title: "Layered Domain Architecture",
      icon: GitBranch,
      description:
        "Structuring modular services where persistence, external integrations, and core domain business logic remain isolated, testable, and maintainable.",
    },
    {
      title: "Performance & Index Discipline",
      icon: Zap,
      description:
        "Optimizing query execution with intentional compound indexes, static generation, lean client bundles, and zero-overhead serialization.",
    },
  ];

  return (
    <section className="py-24 md:py-36 relative bg-bg-elevated/40 border-y border-border">
      <Container>
        {/* Editorial Pull-Quote Block */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <Eyebrow className="mb-4">Engineering Philosophy</Eyebrow>
          <blockquote className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-text leading-[1.2] tracking-tight">
            &ldquo;I care deeply about what happens after the feature ships.&rdquo;
          </blockquote>
          <p className="mt-6 text-body-lg text-text-muted leading-relaxed max-w-2xl">
            Writing code is only the initial step. Long-term production success is defined by uptime,
            zero data loss, maintainable contracts, and whether an engineer six months from now can
            confidently inspect and extend the codebase.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 sm:p-7 rounded-2xl border border-border bg-surface hover:border-border-strong hover:bg-surface-2 transition-all duration-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-accent mb-5">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-text tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
