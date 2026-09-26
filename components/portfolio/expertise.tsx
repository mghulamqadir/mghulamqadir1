import React from "react";
import { Server, Bot, Layers, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Surface } from "@/components/ui/surface";

export function Expertise() {
  const pillars = [
    {
      title: "Backend Systems",
      icon: Server,
      description:
        "High-throughput RESTful APIs, secure authentication systems, relational database architecture, payment webhooks, and third-party integrations.",
      highlights: [
        "Relational schema modeling (PostgreSQL / Supabase)",
        "Stripe & Stripe Connect checkout and subscription lifecycles",
        "Deterministic rate-limiting & session authorization",
        "Clean layered domain architecture",
      ],
      techBadge: "Node.js • Express • PostgreSQL",
    },
    {
      title: "AI Engineering & RAG",
      icon: Bot,
      description:
        "Multi-stage AI processing pipelines, structured information extraction, Perplexity and OpenAI integration, and contextual vector search systems.",
      highlights: [
        "Multi-stage sequential event extraction pipelines",
        "Schema validation & null normalization via Zod",
        "Context passing & fallback retry resilience",
        "Vector indexing & semantic retrieval workflows",
      ],
      techBadge: "RAG • LLM APIs • Vector Search",
    },
    {
      title: "Product Engineering",
      icon: Layers,
      description:
        "Full-stack web applications merging robust backend foundations with responsive, accessible, and high-performance user interfaces.",
      highlights: [
        "Next.js App Router & React Server Components",
        "Role-based multi-tenant user access control",
        "Transactional email workflows (Brevo)",
        "End-to-end type safety across client & server",
      ],
      techBadge: "Next.js • React • Tailwind CSS",
    },
  ];

  return (
    <section className="py-20 md:py-28 relative">
      <Container>
        <div className="flex flex-col gap-4 max-w-2xl mb-12 md:mb-16">
          <Eyebrow>What I Build</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineering depth across the entire application lifecycle.
          </h2>
          <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed">
            From database schemas and API orchestration to AI pipelines and frontend execution, I build systems engineered for correctness, maintainability, and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Surface
                key={pillar.title}
                elevation="flat"
                className="flex flex-col justify-between group hover:border-[#5b8cff]/30 transition-all duration-300"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#5b8cff] group-hover:scale-105 transition-transform mb-6">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-[#a1a1aa] leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-white/[0.06] mb-6">
                    {pillar.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#71717a]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5b8cff] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-[#71717a]">
                  <span>{pillar.techBadge}</span>
                </div>
              </Surface>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
