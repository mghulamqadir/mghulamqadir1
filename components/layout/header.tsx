import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b8cff] rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[#16171a] border border-white/10 group-hover:border-[#5b8cff]/50 flex items-center justify-center font-mono font-bold text-xs text-white transition-colors">
            GQ
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-[#fafafa] group-hover:text-white transition-colors">
              Ghulam Qadir
            </span>
            <span className="font-mono text-[10px] text-[#71717a] hidden sm:inline-block">
              Backend & AI Engineer
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#a1a1aa] hover:text-[#fafafa] px-3.5 py-1.5 rounded-lg transition-colors hover:bg-white/[0.04]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/mghulamqadir"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="p-2 text-[#a1a1aa] hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <GitHubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/mghulamqadir"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="p-2 text-[#a1a1aa] hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <Button
            variant="secondary"
            size="sm"
            href="/contact"
            className="text-xs font-mono"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#5b8cff]" />
          </Button>
        </div>

        {/* Mobile Nav Button */}
        <MobileNav />
      </div>
    </header>
  );
}
