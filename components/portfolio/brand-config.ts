/**
 * Central configuration for brand imagery and owner constants.
 * Sourced in one place so the picture or copy can be swapped without touching components.
 */
export const BRAND_CONFIG = {
  name: "Ghulam Qadir",
  role: "Full Stack Engineer",
  location: "Lahore, Pakistan",
  timezone: "UTC+5",
  headline: "Full Stack Engineer",
  headlineWord1: "Full Stack",
  headlineWord2: "Engineer",
  portrait: {
    src: "/images/portrait.webp",
    fallbackSrc: "/images/portrait.jpg",
    width: 768,
    height: 1024,
    alt: "Portrait of Ghulam Qadir with a moonlit mountain temple scene blended into his silhouette",
  },
  resume: {
    href: "/resume/ghulam-qadir-resume.pdf",
    filename: "Ghulam-Qadir-Resume.pdf",
  },
  bioSentence:
    "I engineer reliable backend systems, intelligent AI/RAG pipelines, and high-performance SaaS applications designed for production resilience.",
};
