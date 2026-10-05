import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { env } from "@/lib/env";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#07080B",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "Ghulam Qadir — Backend-Focused Full Stack Engineer",
    template: "%s | Ghulam Qadir",
  },
  description:
    "Backend-Focused Full Stack Engineer building production systems, AI/RAG pipelines, and scalable web platforms. Node.js, AI, PostgreSQL, Next.js.",
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL as string),
  keywords: [
    "Backend Engineer",
    "Node.js",
    "AI Engineer",
    "RAG",
    "PostgreSQL",
    "Next.js",
    "Full Stack Developer",
    "Ghulam Qadir",
  ],
  authors: [{ name: "Ghulam Qadir" }],
  creator: "Ghulam Qadir",
  openGraph: { type: "website", title: "Ghulam Qadir — Backend-Focused Full Stack Engineer", description: "Backend systems, AI/RAG pipelines, and production SaaS applications.", siteName: "Ghulam Qadir" },
  twitter: { card: "summary_large_image", title: "Ghulam Qadir — Backend-Focused Full Stack Engineer", description: "Backend systems, AI/RAG pipelines, and production SaaS applications." },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-bg text-text selection:bg-accent/30 selection:text-text font-sans">
        <div className="film-grain" aria-hidden="true" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:text-accent-ink focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>
        <SeoJsonLd />
        <Header />
        <main id="main-content" className="flex-1 flex flex-col relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
