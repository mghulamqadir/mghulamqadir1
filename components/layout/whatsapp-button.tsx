"use client";

import { MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

const WHATSAPP_URL = "https://wa.me/923057705617";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname === "/login") return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ghulam Qadir on WhatsApp"
      className="group fixed bottom-5 right-4 z-40 flex min-h-12 items-center gap-3 rounded-full border border-border-strong bg-bg-elevated/95 px-3.5 py-2.5 text-text shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_24px_var(--accent-glow)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:bottom-6 sm:right-6 sm:px-4"
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success ring-1 ring-success/30 transition-colors group-hover:bg-success/20">
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <Phone className="absolute h-2.5 w-2.5" aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-elevated bg-success" aria-hidden="true" />
      </span>
      <span className="hidden pr-1 sm:block">
        <span className="block text-xs font-semibold leading-tight">Chat on WhatsApp</span>
        <span className="mt-0.5 block font-mono text-[10px] leading-tight text-text-muted">Direct message</span>
      </span>
    </a>
  );
}
