import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { HeroSystemDiagram } from "@/components/diagrams/hero-system-diagram";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-ambient-glow">
      <Container>
        <div className="flex flex-col items-start gap-6 max-w-3xl">
          {/* Eyebrow & Status */}
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="Available for select opportunities" available={true} />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#71717a]">
              <span>Lahore, Pakistan</span>
              <span>•</span>
              <span>UTC+5</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Backend-Focused <br />
            <span className="text-[#a1a1aa] font-normal">Full Stack Engineer.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#a1a1aa] max-w-2xl leading-relaxed">
            I engineer reliable backend systems, intelligent AI/RAG pipelines, and high-performance SaaS applications designed for production resilience.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="accent" size="lg" href="#featured-work">
              <span>View Selected Work</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="secondary" size="lg" href="/contact">
              <span>Start Conversation</span>
            </Button>
          </div>

          {/* Core Stack Pill Row */}
          <div className="pt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-[#71717a]">
            <span className="text-[#a1a1aa] font-medium">Core Stack:</span>
            <span className="text-[#fafafa]">Node.js</span>
            <span>•</span>
            <span className="text-[#fafafa]">AI / RAG</span>
            <span>•</span>
            <span className="text-[#fafafa]">PostgreSQL</span>
            <span>•</span>
            <span className="text-[#fafafa]">Next.js</span>
            <span>•</span>
            <span className="text-[#fafafa]">Docker</span>
          </div>
        </div>

        {/* Hero Visual System Diagram */}
        <div className="mt-12 lg:mt-16 w-full">
          <HeroSystemDiagram />
        </div>
      </Container>
    </section>
  );
}
