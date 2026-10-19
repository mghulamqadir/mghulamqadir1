import { env } from "@/lib/env";

export function SeoJsonLd() { const value = { "@context": "https://schema.org", "@graph": [{ "@type": "Person", name: "Ghulam Qadir", jobTitle: "Backend-Focused Full Stack Engineer", url: env.NEXT_PUBLIC_SITE_URL, sameAs: ["https://github.com/mghulamqadir", "https://linkedin.com/in/mghulamqadir"] }, { "@type": "WebSite", name: "Ghulam Qadir", url: env.NEXT_PUBLIC_SITE_URL }] }; return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }} />; }
