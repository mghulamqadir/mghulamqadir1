import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { ArchitectureDiagram } from "@/components/diagrams/architecture-diagram";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject, getProjects } from "@/lib/data/public";

export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const title = project.seo_title ?? project.title;
  const description = project.seo_description ?? project.short_description;
  const image = project.cover_image_url ?? project.images?.[0]?.secure_url;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const [project, allProjects] = await Promise.all([
    getProject(slug),
    getProjects(),
  ]);

  if (!project) notFound();

  // Find previous and next project for footer navigation
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex !== -1 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  // Validate external URL helper (http/https only)
  const isSafeUrl = (url?: string | null): url is string =>
    Boolean(url && (url.startsWith("https://") || url.startsWith("http://")));

  const tocItems = [
    { id: "overview", label: "Overview", show: !!project.overview },
    { id: "problem", label: "The Problem", show: !!project.problem },
    { id: "solution", label: "The Solution", show: !!project.solution },
    { id: "architecture", label: "System Architecture", show: !!project.architecture },
    { id: "challenges", label: "Engineering Challenges", show: !!project.challenges?.length },
    { id: "outcome", label: "Measured Outcome", show: !!project.outcome },
    { id: "technology", label: "Technology Stack", show: !!project.technologies?.length },
  ].filter((item) => item.show);

  return (
    <article className="py-16 md:py-24 lg:py-28">
      <Container>
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1 py-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to all projects</span>
          </Link>
        </div>

        {/* Case Study Header */}
        <header className="max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs mb-4">
            <span className="text-accent font-semibold">{project.category}</span>
            <span className="text-border-strong" aria-hidden="true">•</span>
            <span className="text-text-muted">{project.status}</span>
          </div>

          <h1 className="text-display text-text font-bold tracking-tight mb-5">
            {project.title}
          </h1>

          <p className="text-body-lg text-text-muted leading-relaxed max-w-3xl">
            {project.short_description}
          </p>

          {/* Metadata Meta Bar */}
          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-border py-5 font-mono text-xs">
            <div>
              <dt className="text-text-faint uppercase">Role</dt>
              <dd className="mt-1 text-text font-medium">{project.role}</dd>
            </div>
            <div>
              <dt className="text-text-faint uppercase">Organization</dt>
              <dd className="mt-1 text-text font-medium">{project.company}</dd>
            </div>
            <div>
              <dt className="text-text-faint uppercase">Category</dt>
              <dd className="mt-1 text-text font-medium">{project.category}</dd>
            </div>
            <div>
              <dt className="text-text-faint uppercase">Status</dt>
              <dd className="mt-1 text-emerald-400 font-medium">{project.status}</dd>
            </div>
          </dl>

          {/* Action CTAs */}
          {isSafeUrl(project.live_url) && (
            <div className="mt-6 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="md"
                href={project.live_url}
                external
              >
                <span>Visit live product</span>
                <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
            </div>
          )}
        </header>

        {/* Cover Image */}
        {project.cover_image_url && (
          <div className="relative mb-16 aspect-[16/9] max-h-[520px] w-full overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-2xl shadow-black/50">
            <Image
              src={project.cover_image_url}
              alt={`${project.title} cover preview`}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/30 via-transparent to-transparent" aria-hidden="true" />
          </div>
        )}

        {/* Main Content Layout (Sticky Mini TOC + Content Blocks) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Desktop Sticky Table of Contents (3 cols on lg) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
            <div className="p-5 rounded-2xl border border-border bg-surface text-xs font-mono">
              <span className="text-text-faint uppercase tracking-wider block mb-3 font-semibold">
                Table of Contents
              </span>
              <nav className="space-y-2">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-text-muted hover:text-accent transition-colors py-1 hover:translate-x-1 duration-150"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content Blocks (9 cols on lg) */}
          <div className="lg:col-span-9 max-w-3xl space-y-16">
            {project.overview && (
              <section id="overview" className="scroll-mt-24 space-y-4">
                <Eyebrow>Overview</Eyebrow>
                <h2 className="text-2xl font-bold tracking-tight text-text">Product Context</h2>
                <p className="whitespace-pre-line text-body-lg text-text-muted leading-relaxed">
                  {project.overview}
                </p>
              </section>
            )}

            {project.problem && (
              <section id="problem" className="scroll-mt-24 space-y-4">
                <Eyebrow>The Problem</Eyebrow>
                <h2 className="text-2xl font-bold tracking-tight text-text">Challenge &amp; Bottlenecks</h2>
                <p className="whitespace-pre-line text-body-lg text-text-muted leading-relaxed">
                  {project.problem}
                </p>
              </section>
            )}

            {project.solution && (
              <section id="solution" className="scroll-mt-24 space-y-4">
                <Eyebrow>The Solution</Eyebrow>
                <h2 className="text-2xl font-bold tracking-tight text-text">Engineering Architecture</h2>
                <p className="whitespace-pre-line text-body-lg text-text-muted leading-relaxed">
                  {project.solution}
                </p>
              </section>
            )}

            {project.architecture && (
              <section id="architecture" className="scroll-mt-24 space-y-4">
                <Eyebrow>Architecture</Eyebrow>
                <h2 className="text-2xl font-bold tracking-tight text-text">System Topology</h2>
                <ArchitectureDiagram value={project.architecture} />
              </section>
            )}

            {project.challenges && project.challenges.length > 0 && (
              <section id="challenges" className="scroll-mt-24 space-y-4">
                <Eyebrow>Challenges</Eyebrow>
                <h2 className="text-2xl font-bold tracking-tight text-text">Technical Hurdles &amp; Solutions</h2>
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  {project.challenges.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-surface p-5 text-sm text-text-muted leading-relaxed shadow-sm"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.outcome && (
              <section id="outcome" className="scroll-mt-24 space-y-4">
                <Eyebrow>Outcome</Eyebrow>
                <h2 className="text-2xl font-bold tracking-tight text-text">Measurable Results</h2>
                <div className="rounded-xl border border-border bg-surface p-6 font-mono text-sm text-text-muted">
                  <span className="text-accent font-semibold">Production Status: </span>
                  {project.outcome}
                </div>
              </section>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <section id="technology" className="scroll-mt-24 space-y-4">
                <Eyebrow>Technology</Eyebrow>
                <h2 className="text-2xl font-bold tracking-tight text-text">Stack &amp; Tooling</h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.technologies.map((tech) => (
                    <Badge key={tech.id ?? tech.name} variant="default" font="mono">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Previous / Next Project Footer Navigation */}
        <footer className="mt-24 pt-12 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col items-start p-6 rounded-2xl border border-border bg-surface hover:border-border-strong hover:bg-surface-2 transition-all"
            >
              <span className="font-mono text-xs text-text-faint flex items-center gap-1.5 mb-2">
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                Previous Project
              </span>
              <span className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                {prevProject.title}
              </span>
              <span className="text-xs text-text-muted mt-1 font-mono">
                {prevProject.category}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col items-end text-right p-6 rounded-2xl border border-border bg-surface hover:border-border-strong hover:bg-surface-2 transition-all sm:col-start-2"
            >
              <span className="font-mono text-xs text-text-faint flex items-center gap-1.5 mb-2">
                Next Project
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                {nextProject.title}
              </span>
              <span className="text-xs text-text-muted mt-1 font-mono">
                {nextProject.category}
              </span>
            </Link>
          )}
        </footer>
      </Container>
    </article>
  );
}
