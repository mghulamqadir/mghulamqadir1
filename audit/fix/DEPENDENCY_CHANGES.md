# Dependency Changes

| Package | Previous Version | New Version | Reason |
| --- | --- | --- | --- |
| `vitest` | `^2.1.9` | `^3.2.6` | Upgraded to resolve Critical Supply Chain Vulnerability (GHSA-5xrq-8626-4rwp). |
| `@vitest/coverage-v8` | *None* | `^3.2.6` | Added to resolve missing coverage instrumentation when running `vitest --coverage`. |
| `framer-motion` | `^13.4.4` | *Removed* | Removed to resolve severe root bundle bloat (156 KB) and improve mobile performance scores. Replaced with Tailwind CSS transitions. |
