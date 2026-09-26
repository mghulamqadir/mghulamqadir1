import React from "react";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#09090b] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          <div className="flex flex-col gap-2 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-tight">Ghulam Qadir</span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono text-[#a1a1aa]">Lahore, PK</span>
            </div>
            <p className="text-sm text-[#71717a] leading-relaxed">
              Backend-Focused Full Stack Engineer specializing in Node.js, AI / RAG pipelines, and reliable SaaS architectures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/mghulamqadir"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-[#71717a]" />
            </a>
            <a
              href="https://linkedin.com/in/mghulamqadir"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3 text-[#71717a]" />
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#52525b] font-mono">
          <p>© {currentYear} Ghulam Qadir. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#71717a]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Systems operational
            </span>
            <span>•</span>
            <Link href="/login" className="hover:text-[#a1a1aa] transition-colors">
              CMS Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
