import React, { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProjectFilter } from "@/components/portfolio/project-filter";
import { getProjects } from "@/lib/data/public";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Production systems, AI/RAG architectures, and scalable web platforms engineered by Ghulam Qadir.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="py-16 md:py-24 lg:py-28">
      <Container>
        <div className="max-w-3xl mb-12 md:mb-16">
          <Eyebrow className="mb-3">Selected Work</Eyebrow>
          <h1 className="text-display text-text font-semibold tracking-tight">
            Production applications, backend systems, and AI products.
          </h1>
          <p className="mt-5 text-body-lg text-text-muted leading-relaxed">
            Case studies detailing architectural trade-offs, defensive validation pipelines,
            and measured outcomes across SaaS platforms and AI integrations.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-64 flex items-center justify-center font-mono text-xs text-text-faint">
              Loading projects…
            </div>
          }
        >
          <ProjectFilter projects={projects} />
        </Suspense>
      </Container>
    </div>
  );
}
