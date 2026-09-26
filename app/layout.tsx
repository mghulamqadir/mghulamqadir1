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
  metadataBase: new URL("https://mghulamqadir.dev"),
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
  alternates: { canonical: "/" },
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
        <SeoJsonLd />
        <Header />
        <main className="flex-1 flex flex-col relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
