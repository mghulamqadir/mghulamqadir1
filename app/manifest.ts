import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ghulam Qadir — Backend-Focused Full Stack Engineer",
    short_name: "Ghulam Qadir",
    description:
      "Backend-Focused Full Stack Engineer specializing in Node.js, AI/RAG architectures, and distributed systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#07080B",
    theme_color: "#07080B",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
