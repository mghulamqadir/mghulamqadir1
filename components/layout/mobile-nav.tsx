"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={toggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="p-2 text-[#a1a1aa] hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b8cff] transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] bg-[#09090b]/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 shadow-2xl z-50 flex flex-col gap-6"
          >
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={`flex items-center justify-between text-lg py-2.5 px-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "text-[#5b8cff] bg-white/[0.04]"
                        : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <ArrowRight className="w-4 h-4 text-[#5b8cff]" />}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-4 py-2">
                <a
                  href="https://github.com/mghulamqadir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
                >
                  <GitHubIcon className="w-4 h-4" />
                  GitHub
                </a>
                <span className="text-white/20">•</span>
                <a
                  href="https://linkedin.com/in/mghulamqadir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>

              <Button
                variant="accent"
                size="md"
                href="/contact"
                className="w-full mt-2"
                onClick={close}
              >
                <FileText className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
