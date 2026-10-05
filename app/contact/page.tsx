import React from "react";
import { Mail, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ContactForm } from "@/components/portfolio/contact-form";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ghulam Qadir for backend engineering roles, AI architecture contracts, and technical advisory.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Narrative & Direct Details Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start gap-6">
            <Eyebrow>Start a Conversation</Eyebrow>
            <h1 className="text-display text-text font-semibold tracking-tight">
              Have a backend or AI challenge worth discussing?
            </h1>
            <p className="text-body-lg text-text-muted leading-relaxed">
              Whether you are architecting a high-throughput API, building a multi-stage RAG
              pipeline, or evaluating technical feasibility for an upcoming product launch,
              send a message and let&apos;s connect.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-4 w-full pt-4 border-t border-border">
              <a
                href="mailto:mohammadghulam.qadir@gmail.com"
                className="flex items-center gap-3.5 p-4 rounded-xl border border-border bg-surface hover:border-border-strong hover:bg-surface-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-text-faint uppercase">Direct Email</span>
                  <span className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
                    mohammadghulam.qadir@gmail.com
                  </span>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface text-xs font-mono">
                  <Clock className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-text-faint">Response Time</span>
                    <span className="text-text font-medium">&lt; 24 Hours</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface text-xs font-mono">
                  <MapPin className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-text-faint">Location</span>
                    <span className="text-text font-medium">Lahore, PK (UTC+5)</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://github.com/mghulamqadir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-between p-3 rounded-lg border border-border bg-surface-2 hover:border-border-strong text-xs font-mono text-text-muted hover:text-text transition-colors"
                  aria-label="GitHub Profile"
                >
                  <span className="flex items-center gap-2">
                    <GitHubIcon className="w-4 h-4" />
                    GitHub
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-text-faint" aria-hidden="true" />
                </a>

                <a
                  href="https://linkedin.com/in/mghulamqadir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-between p-3 rounded-lg border border-border bg-surface-2 hover:border-border-strong text-xs font-mono text-text-muted hover:text-text transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <span className="flex items-center gap-2">
                    <LinkedInIcon className="w-4 h-4" />
                    LinkedIn
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-text-faint" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Card Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 md:p-10 shadow-xl shadow-black/40">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-text">Send a Message</h2>
                <p className="mt-1.5 text-sm text-text-muted">
                  Fill in your details below. All fields marked with an asterisk are required.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
