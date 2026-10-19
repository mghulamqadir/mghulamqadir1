import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Unit tests must not depend on a developer's uncommitted .env file.
    env: { NEXT_PUBLIC_SITE_URL: "https://portfolio.test" },
  },
});
