import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/lib/types";
import { formatExperienceDateRange } from "@/lib/utils";

export function ExperiencePreview({ experiences }: { experiences: Experience[] }) {
  if (!experiences.length) return null;

  return (
    <section className="relative py-20 md:py-28">
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <Eyebrow>Career Trajectory</Eyebrow>
            <h2 className="text-heading-2 text-text font-semibold tracking-tight">
              Professional experience
            </h2>
            <p className="text-body-lg text-text-muted leading-relaxed">
              A track record of backend architecture, AI pipeline development, and SaaS systems.
            </p>
          </div>
          <Button variant="secondary" size="md" href="/experience" className="shrink-0 text-xs font-mono">
            <span>View full experience</span>
            <ArrowUpRight className="ml-1 h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
          </Button>
        </div>

        <div className="border-t border-border">
          {experiences.slice(0, 3).map((item) => (
            <article
              key={item.id}
              className="grid grid-cols-1 items-start gap-6 border-b border-border py-8 transition-colors hover:bg-surface/40 md:grid-cols-12 px-2 rounded-lg"
            >
              <div className="md:col-span-3 flex flex-col gap-1">
                <span className="font-mono text-xs font-semibold text-accent">
                  {formatExperienceDateRange(item.start_date, item.end_date, item.current_role)}
                </span>
                <span className="text-xs text-text-faint">{item.location}</span>
              </div>

              <div className="md:col-span-6">
                <h3 className="text-lg font-bold tracking-tight text-text">
                  {item.company}
                </h3>
                <p className="font-mono text-sm text-text-muted mt-0.5">
                  {item.role}
                </p>
                {item.description && (
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                {item.technologies?.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
