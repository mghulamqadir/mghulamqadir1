import React from "react";
import { ArrowUpRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="relative py-20 md:py-28">
      <Container>
        <div className="mb-14 max-w-2xl space-y-3">
          <Eyebrow>Endorsements</Eyebrow>
          <h2 className="text-heading-2 text-text font-semibold tracking-tight">
            What collaborators say
          </h2>
          <p className="text-body-lg text-text-muted leading-relaxed">
            Feedback from team leads and engineering partners on production deliverables.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-7 shadow-sm transition-all duration-200 hover:border-border-strong hover:bg-surface-2"
            >
              <div>
                <Quote className="mb-4 h-5 w-5 text-accent opacity-80" aria-hidden="true" />
                <p className="mb-6 text-sm italic leading-relaxed text-text-muted">
                  &ldquo;{item.testimonial}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-text">
                    {item.name}
                  </h3>
                  <p className="font-mono text-xs text-text-faint">
                    {[item.job_title, item.company].filter(Boolean).join(" • ")}
                  </p>
                </div>
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded p-1.5 text-text-faint hover:text-text focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={`Open ${item.name}'s verified source`}
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
