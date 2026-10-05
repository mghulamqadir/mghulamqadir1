import React from "react";
import { Server, Bot, Database, CreditCard, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";

export function Expertise() {
  const capabilities = [
    {
      title: "Backend Architecture & Distributed APIs",
      icon: Server,
      featured: true,
      colSpan: "md:col-span-2",
      description:
        "High-throughput RESTful services, strict schema validation, role-based authorization, rate-limiting guards, and clean layered domain architecture.",
      highlights: [
        "Layered service and repository architecture with zero DB leak in presentations",
        "Deterministic rate-limiting & session-based JWT authentication",
        "Deterministic error handling with strict status codes and RFC7807 problem details",
      ],
      tags: ["Node.js", "Express", "TypeScript", "Next.js", "Zod", "REST"],
    },
    {
      title: "AI Orchestration & RAG Pipelines",
      icon: Bot,
      featured: true,
      colSpan: "md:col-span-2",
      description:
        "Multi-stage sequential LLM processing workflows, semantic vector retrieval, structured JSON extractions, and context-passing retry mechanisms.",
      highlights: [
        "Sequential event processing pipelines with incremental state persistence",
        "Vector search & semantic grounding using LLM APIs",
        "Defensive retry queues handling model drift and provider rate limits",
      ],
      tags: ["AI / RAG", "Perplexity API", "Vector Embeddings", "Context Pipelines"],
    },
    {
      title: "Data Engineering & Persistence",
      icon: Database,
      colSpan: "md:col-span-1",
      description:
        "Production database schema design, index optimization, document collections, and relational migration pipelines.",
      highlights: [
        "Compound indexing & TTL lifecycle policies",
        "Clean migration paths between SQL and document stores",
      ],
      tags: ["PostgreSQL", "MongoDB Atlas", "Supabase", "Mongoose"],
    },
    {
      title: "Billing & Financial Infrastructure",
      icon: CreditCard,
      colSpan: "md:col-span-1",
      description:
        "Robust subscription lifecycles, marketplace split payouts via Stripe Connect, and idempotent webhook processors.",
      highlights: [
        "Idempotent webhook handling with signature verification",
        "Multi-party vendor payouts and subscription management",
      ],
      tags: ["Stripe", "Stripe Connect", "Webhooks", "Billing"],
    },
  ];

  return (
    <section className="py-20 md:py-28 relative">
      <Container>
        <div className="flex flex-col gap-3 max-w-2xl mb-12 md:mb-16">
          <Eyebrow>Core Capabilities</Eyebrow>
          <h2 className="text-heading-2 text-text font-semibold tracking-tight">
            Engineering depth across the production lifecycle.
          </h2>
          <p className="text-body-lg text-text-muted leading-relaxed">
            From database schemas and API orchestration to AI pipelines and payment workflows, I build systems engineered for correctness, maintainability, and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                  item.featured
                    ? "bg-surface border border-border hover:border-accent/30 shadow-lg shadow-black/20"
                    : "bg-surface border border-border hover:border-border-strong"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-accent">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    {item.featured && (
                      <span className="text-[11px] font-mono text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full font-medium">
                        Core Strength
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-text tracking-tight mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-border mb-6">
                    {item.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-text-faint">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="default" font="mono">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
