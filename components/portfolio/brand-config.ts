/**
 * Central configuration for brand imagery and owner constants.
 * Sourced in one place so the picture or copy can be swapped without touching components.
 */
export const BRAND_CONFIG = {
  name: "Ghulam Qadir",
  role: "Backend-Focused Full Stack Engineer",
  location: "Lahore, Pakistan",
  timezone: "UTC+5",
  headline: "Backend-Focused Full Stack Engineer",
  headlineWord1: "Backend-Focused",
  headlineWord2: "Full Stack",
  headlineWord3: "Engineer",
  portrait: {
    src: "/images/portrait.webp",
    fallbackSrc: "/images/portrait.jpg",
    width: 768,
    height: 1024,
    alt: "Portrait of Ghulam Qadir with a moonlit mountain temple scene blended into his silhouette",
  },
  bioSentence:
    "I engineer reliable backend systems, intelligent AI/RAG pipelines, and high-performance SaaS applications designed for production resilience.",
};
