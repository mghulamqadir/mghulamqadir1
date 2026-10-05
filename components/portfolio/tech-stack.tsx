import React from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Technology } from "@/lib/types";

export function TechStack({ technologies }: { technologies: Technology[] }) {
  const groups = technologies.reduce<Record<string, Technology[]>>((result, technology) => {
    (result[technology.category] ??= []).push(technology);
    return result;
  }, {});

  if (!Object.keys(groups).length) return null;

  return (
    <section className="relative border-y border-border bg-bg-elevated/40 py-20 md:py-28">
      <Container>
        <div className="mb-14 max-w-2xl space-y-3">
          <Eyebrow>Technical Practice</Eyebrow>
          <h2 className="text-heading-2 text-text font-semibold tracking-tight">
            Tools &amp; technologies
          </h2>
          <p className="text-body-lg text-text-muted leading-relaxed">
            Technologies selected for dependable delivery, explicit contracts, and maintainable production systems.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groups).map(([category, items]) => (
            <div
              key={category}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item.id ?? item.name}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-text hover:border-border-strong transition-colors"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
