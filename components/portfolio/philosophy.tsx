import React from "react";
import { ShieldCheck, Activity, Terminal, Lock, RefreshCw, GitBranch } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export function EngineeringPhilosophy() {
  const principles = [
    {
      title: "Reliability & Resilience",
      icon: RefreshCw,
      description:
        "Building systems that handle network degradation, third-party API rate limits, and corrupted inputs gracefully using exponential retries and fallback states.",
    },
    {
      title: "Defensive Data Validation",
      icon: ShieldCheck,
      description:
        "Validating every boundary with strict Zod schemas and PostgreSQL constraints before processing, ensuring zero silent bugs or schema drifts.",
    },
    {
      title: "Observability & Tracing",
      icon: Activity,
      description:
        "Instrumenting structured logging, audit trails, and stage-by-stage pipeline timing so problems are diagnosed in seconds rather than guessed.",
    },
    {
      title: "Production Security",
      icon: Lock,
      description:
        "Enforcing Row Level Security (RLS), scoped API credentials, cryptographically signed uploads, and strict role authorization on all mutations.",
    },
    {
      title: "Clean Domain Architecture",
      icon: GitBranch,
      description:
        "Structuring modular services where database logic, external SDK calls, and business rules remain decoupled, testable, and maintainable.",
    },
    {
      title: "Performance & Efficiency",
      icon: Terminal,
      description:
        "Optimizing relational queries with proper indices, concurrent batch processing, edge-caching static assets, and minimizing serialization overhead.",
    },
  ];

  return (
    <section className="py-20 md:py-28 relative bg-[#0c0d10] border-y border-white/[0.06]">
      <Container>
        <div className="flex flex-col gap-4 max-w-3xl mb-16">
          <Eyebrow>Engineering Philosophy</Eyebrow>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            I care about what happens <br className="hidden sm:inline" />
            <span className="text-[#6c9cff]">after the feature ships.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed">
            Shipping code is only step one. Production success is determined by uptime, data integrity, security, and whether another engineer can read and extend the system six months later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-white/[0.08] bg-[#121316] hover:border-white/20 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-[#16171a] border border-white/10 flex items-center justify-center text-[#5b8cff] mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">
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
