import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  const leadProject = projects[0];
  const secondaryProjects = projects.slice(1, 4);

  return (
    <section id="featured-work" className="relative py-20 md:py-28">
      <Container>
        {/* Section Heading */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <Eyebrow>Selected Case Studies</Eyebrow>
            <h2 className="text-heading-2 text-text font-semibold tracking-tight">
              Production systems built with care.
            </h2>
            <p className="text-body-lg text-text-muted leading-relaxed">
              In-depth engineering write-ups documenting architectural decisions, data validation,
              and measurable outcomes.
            </p>
          </div>
          <Button variant="secondary" size="md" href="/projects" className="shrink-0 text-xs font-mono">
            <span>View all projects</span>
            <ArrowUpRight className="ml-1 h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
          </Button>
        </div>

        {/* ONE Large Flagship Lead Card */}
        {leadProject && (
          <Link
            href={`/projects/${leadProject.slug}`}
            className="group block mb-10 rounded-2xl border-signature-gradient bg-surface overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(242,184,100,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Read case study for ${leadProject.title}: ${leadProject.short_description}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
              {/* Left Column: Metadata & Overview */}
              <div className="lg:col-span-7 flex flex-col items-start gap-5">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="text-accent font-bold">01 / FEATURED LEAD</span>
                  <span className="text-border-strong" aria-hidden="true">•</span>
                  <span className="text-text-muted">{leadProject.category}</span>
                  <span className="text-border-strong" aria-hidden="true">•</span>
                  <span className="text-text-faint">{leadProject.company}</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text group-hover:text-accent transition-colors">
                    {leadProject.title}
                  </h3>
                  <p className="mt-2 text-xs font-mono uppercase text-text-faint">
                    Role: <span className="text-text-muted">{leadProject.role}</span>
                  </p>
                  <p className="mt-4 text-body-lg text-text-muted leading-relaxed">
                    {leadProject.short_description}
                  </p>
                </div>

                {leadProject.outcome && (
                  <div className="p-3.5 rounded-lg bg-surface-2 border border-border text-xs text-text-muted w-full font-mono">
                    <span className="text-accent font-semibold">Outcome: </span>
                    {leadProject.outcome}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {leadProject.technologies?.slice(0, 4).map((tech) => (
                    <Badge key={tech.id ?? tech.name} variant="default" font="mono">
                      {tech.name}
                    </Badge>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-accent group-hover:text-accent-strong transition-colors">
                  <span>Read full case study</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>

              {/* Right Column: Visual Cover */}
              <div className="lg:col-span-5 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[340px] rounded-xl overflow-hidden bg-surface-2 border border-border">
                {leadProject.cover_image_url ? (
                  <Image
                    src={leadProject.cover_image_url}
                    alt={`${leadProject.title} preview cover`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-text-faint font-mono text-xs">
                    <span className="text-accent font-bold text-sm mb-1">{leadProject.title}</span>
                    <span>System Architecture Overview</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" aria-hidden="true" />
              </div>
            </div>
          </Link>
        )}

        {/* 2-3 Secondary Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryProjects.map((project, idx) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex flex-col justify-between rounded-2xl bg-surface border border-border p-6 sm:p-7 transition-all duration-200 hover:border-border-strong hover:bg-surface-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Read case study for ${project.title}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                  <span className="text-text-faint font-bold">
                    {String(idx + 2).padStart(2, "0")}
                  </span>
                  <span className="text-text-muted bg-surface-2 px-2.5 py-0.5 rounded border border-border">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-text group-hover:text-accent transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs font-mono text-text-faint mb-3">
                  {project.company} • {project.role}
                </p>

                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  {project.short_description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border mb-4">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span
                      key={tech.id ?? tech.name}
                      className="text-[11px] font-mono text-text-muted bg-surface-2 px-2 py-0.5 rounded border border-border"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-text group-hover:text-accent transition-colors">
                  <span>Explore case study</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
