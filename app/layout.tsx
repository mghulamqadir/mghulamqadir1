import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SeoJsonLd } from "@/components/seo-json-ld";

export const metadata: Metadata = {
  title: {
    default: "Ghulam Qadir — Backend-Focused Full Stack Engineer",
    template: "%s | Ghulam Qadir",
  },
  description:
    "Backend-Focused Full Stack Engineer building production systems, AI/RAG pipelines, and scalable web platforms. Node.js, AI, PostgreSQL, Next.js.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mghulamqadir.dev"),
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
      className="h-full antialiased dark"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#09090b] text-[#fafafa] bg-grid-pattern selection:bg-[#5b8cff]/30 selection:text-white">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#5b8cff] focus:px-4 focus:py-2">Skip to content</a>
        <SeoJsonLd />
        <Header />
        <main id="main-content" className="flex-1 flex flex-col relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
