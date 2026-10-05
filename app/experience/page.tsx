import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { getExperiences } from "@/lib/data/public";
import { formatExperienceDateRange } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional track record and engineering contributions across backend systems, AI/RAG architectures, and SaaS products.",
  alternates: { canonical: "/experience" },
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="py-16 md:py-24 lg:py-28">
      <Container size="narrow">
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20">
          <Eyebrow className="mb-3">Career History</Eyebrow>
          <h1 className="text-display text-text font-semibold tracking-tight">
            Professional Experience
          </h1>
          <p className="mt-4 text-body-lg text-text-muted leading-relaxed">
            A chronological timeline of production engineering roles, technical ownership,
            and software delivery across SaaS platforms and AI pipelines.
          </p>
        </div>

        {/* Vertical Timeline with 1px Spine */}
        <div className="relative pl-6 sm:pl-8 border-l border-border space-y-12 sm:space-y-16">
          {experiences.map((item) => (
            <article key={item.id} className="relative group">
              {/* Timeline Indicator Dot */}
              {item.current_role ? (
                <span
                  className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-accent/20 shadow-sm"
                  aria-label="Current role indicator"
                />
              ) : (
                <span
                  className="absolute -left-[29px] sm:-left-[37px] top-2 w-2.5 h-2.5 rounded-full bg-border-strong border-2 border-bg"
                  aria-hidden="true"
                />
              )}

              {/* Role Header */}
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <span className="font-semibold text-accent">
                    {formatExperienceDateRange(item.start_date, item.end_date, item.current_role)}
                  </span>
                  <span className="text-border-strong" aria-hidden="true">•</span>
                  <span className="text-text-faint">{item.location}</span>
                  {item.current_role && (
                    <span className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-medium">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-bold tracking-tight text-text">
                    {item.company}
                  </h2>
                </div>

                <p className="font-mono text-sm text-text-muted font-medium">
                  {item.role}
                </p>
              </div>

              {/* Role Description */}
              {item.description && (
                <p className="text-sm text-text-muted leading-relaxed mb-5 max-w-2xl">
                  {item.description}
                </p>
              )}

              {/* Highlights */}
              {item.highlights && item.highlights.length > 0 && (
                <div className="space-y-2 mb-6 p-4 rounded-xl bg-surface border border-border shadow-sm">
                  <span className="text-xs font-mono uppercase text-text-faint font-semibold block mb-2">
                    Key Contributions:
                  </span>
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-text-muted">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technologies */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="default" font="mono">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
