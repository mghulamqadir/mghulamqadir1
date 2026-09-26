import React from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-[#09090b] via-[#0e1014] to-[#09090b] border-t border-white/[0.08]">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#5b8cff]/10 rounded-full blur-[100px] pointer-events-none" />

      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16171a] border border-white/10 text-xs font-mono text-[#6c9cff] mb-6">
            <span>Engineering Consultation & Contracts</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Have a backend or AI challenge worth solving?
          </h2>

          <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed mb-8">
            Whether you&apos;re architecting a high-throughput API, building a reliable RAG pipeline, or scaling a SaaS platform, I&apos;d love to connect.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="accent" size="lg" href="/contact">
              <span>Start a conversation</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="mailto:mohammadghulam.qadir@gmail.com"
              external
            >
              <Mail className="w-4 h-4 mr-2 text-[#a1a1aa]" />
              <span>Email directly</span>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs font-mono text-[#71717a]">
            <span>Typical response: &lt; 24 hours</span>
            <span>•</span>
            <span className="text-[#a1a1aa]">mohammadghulam.qadir@gmail.com</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
