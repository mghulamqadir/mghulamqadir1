import React from "react";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-bg-elevated/40 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-border">
          <div className="flex flex-col gap-2 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text tracking-tight">Ghulam Qadir</span>
              <span className="text-border-strong" aria-hidden="true">•</span>
              <span className="text-xs font-mono text-text-muted">Lahore, PK</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Backend-Focused Full Stack Engineer specializing in Node.js, AI/RAG architectures, and production distributed systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/mghulamqadir"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors min-h-[44px] py-2"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-text-faint" aria-hidden="true" />
            </a>
            <a
              href="https://linkedin.com/in/mghulamqadir"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors min-h-[44px] py-2"
            >
              <LinkedInIcon className="w-4 h-4" />
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3 text-text-faint" aria-hidden="true" />
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors min-h-[44px] py-2"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>Email</span>
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-faint font-mono">
          <p>© {currentYear} Ghulam Qadir. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
              Systems operational
            </span>
            <span aria-hidden="true">•</span>
            <Link href="/login" className="hover:text-text transition-colors">
              CMS Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
