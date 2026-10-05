"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

interface ProjectFilterProps {
  projects: Project[];
}

export function ProjectFilter({ projects }: ProjectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  // Derive unique categories from projects data
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter(
      (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [projects, activeCategory]);

  const handleSelectCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    const queryString = params.toString();
    router.push(queryString ? `/projects?${queryString}` : "/projects", {
      scroll: false,
    });
  };

  const leadProject = filteredProjects[0];
  const secondaryProjects = filteredProjects.slice(1);

  return (
    <div className="space-y-10">
      {/* Filter Chips Bar */}
      <div
        role="toolbar"
        aria-label="Filter projects by category"
        className="flex flex-wrap items-center gap-2.5 pb-2 border-b border-border"
      >
        <span className="text-xs font-mono text-text-faint mr-2 uppercase tracking-wider">
          Filter:
        </span>
        {categories.map((category) => {
          const isActive =
            category.toLowerCase() === activeCategory.toLowerCase();
          const label = category === "all" ? "All Projects" : category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleSelectCategory(category)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 min-h-[38px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? "bg-accent text-accent-ink font-semibold shadow-sm"
                  : "bg-surface-2 text-text-muted border border-border hover:border-border-strong hover:text-text"
              }`}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center max-w-lg mx-auto flex flex-col items-center gap-4">
          <p className="text-text-muted text-sm">
            No projects found in category &ldquo;{activeCategory}&rdquo;.
          </p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleSelectCategory("all")}
          >
            <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
            Reset all filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Flagship Lead Card */}
          {leadProject && (
            <Link
              href={`/projects/${leadProject.slug}`}
              className="group block rounded-2xl border-signature-gradient bg-surface overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(242,184,100,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Read case study for ${leadProject.title}: ${leadProject.short_description}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
                <div className="lg:col-span-7 flex flex-col items-start gap-5">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <span className="text-accent font-bold">01 / LEAD PROJECT</span>
                    <span className="text-border-strong" aria-hidden="true">•</span>
                    <span className="text-text-muted">{leadProject.category}</span>
                    <span className="text-border-strong" aria-hidden="true">•</span>
                    <span className="text-text-faint">{leadProject.company}</span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text group-hover:text-accent transition-colors">
                      {leadProject.title}
                    </h2>
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
                    {leadProject.technologies?.slice(0, 5).map((tech) => (
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

                <div className="lg:col-span-5 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[320px] rounded-xl overflow-hidden bg-surface-2 border border-border">
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

          {/* Secondary Projects Grid */}
          {secondaryProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      )}
    </div>
  );
}
