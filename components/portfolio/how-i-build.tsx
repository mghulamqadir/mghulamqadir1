import React from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HeroSystemDiagram } from "@/components/diagrams/hero-system-diagram";
import { CheckCircle2 } from "lucide-react";

export function HowIBuild() {
  const principles = [
    "Strict contract validation with Zod at every public boundary",
    "Staged AI execution with deterministic retry queues and telemetry",
    "Zero-compromise database indexing and data integrity constraints",
  ];

  return (
    <section className="py-20 md:py-28 relative bg-bg-elevated/40 border-y border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Explanatory Narrative Column */}
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            <Eyebrow>How I Build</Eyebrow>
            <h2 className="text-heading-2 text-text font-semibold tracking-tight">
              Predictable systems from ingress to persistence.
            </h2>
            <p className="text-body-lg text-text-muted leading-relaxed">
              Every architecture I design begins with defensive contracts, explicit state
              transitions, and granular observability. Whether processing asynchronous creator payouts
              or streaming context-aware AI responses, the system is engineered to fail safely and
              recover transparently.
            </p>

            <div className="space-y-3 pt-3 mt-1 border-t border-border w-full">
              {principles.map((p, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-text-muted">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Topology Diagram Column */}
          <div className="lg:col-span-7 w-full">
            <HeroSystemDiagram />
          </div>
        </div>
      </Container>
    </section>
  );
}
