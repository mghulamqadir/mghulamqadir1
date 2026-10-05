"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
        }
        if (e.key === "Tab") {
          const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])'
          );
          if (focusable && focusable.length > 0) {
            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    }
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        onClick={toggle}
        aria-label={isOpen ? "Close menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        className="p-2 text-text-muted hover:text-text rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors relative z-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          className="fixed inset-x-0 top-[65px] bg-bg-elevated/95 backdrop-blur-xl border-b border-border px-6 py-8 shadow-2xl z-40 flex flex-col gap-6 animate-in slide-in-from-top-2 fade-in duration-200"
        >
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={`flex items-center justify-between text-base py-3 px-3.5 rounded-lg font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? "text-accent bg-surface-2 font-semibold"
                      : "text-text-muted hover:text-text hover:bg-surface/60"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {isActive && <ArrowRight className="w-4 h-4 text-accent" aria-hidden="true" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center gap-4 py-2">
              <a
                href="https://github.com/mghulamqadir"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors min-h-[44px] px-2"
              >
                <GitHubIcon className="w-4 h-4" />
                GitHub
              </a>
              <span className="text-border-strong" aria-hidden="true">•</span>
              <a
                href="https://linkedin.com/in/mghulamqadir"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors min-h-[44px] px-2"
              >
                <LinkedInIcon className="w-4 h-4" />
                LinkedIn
              </a>
            </div>

            <Button
              variant="primary"
              size="lg"
              href="/contact"
              className="w-full mt-2"
              onClick={close}
            >
              <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
              Get in Touch
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
