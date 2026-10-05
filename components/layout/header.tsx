"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border group-hover:border-accent/50 flex items-center justify-center font-mono font-bold text-xs text-text transition-colors shadow-sm">
            GQ
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-text group-hover:text-accent transition-colors">
              Ghulam Qadir
            </span>
            <span className="font-mono text-[10px] text-text-muted hidden sm:inline-block">
              Backend & AI Engineer
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-text bg-surface-2 font-semibold"
                    : "text-text-muted hover:text-text hover:bg-surface/60"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/mghulamqadir"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2 text-text-muted hover:text-text rounded-lg hover:bg-surface-2 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <GitHubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/mghulamqadir"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2 text-text-muted hover:text-text rounded-lg hover:bg-surface-2 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>

          <div className="h-4 w-px bg-border mx-1" aria-hidden="true" />

          <Button
            variant="primary"
            size="sm"
            href="/contact"
            className="text-xs font-semibold px-4 min-h-[38px]"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-accent-ink" aria-hidden="true" />
          </Button>
        </div>

        {/* Mobile Nav Button */}
        <MobileNav />
      </div>
    </header>
  );
}
