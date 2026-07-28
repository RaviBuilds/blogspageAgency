import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * SEO check-suite configuration.
 *
 * Separate from the unit/property test harness because:
 * - Tests fetch real HTTP from a served production build, not render React.
 * - No jsdom environment — DOM parsing is done explicitly where needed.
 * - Global setup spawns `next start` (or reads SEO_BASE_URL) before tests run.
 * - Concurrency is capped at 6 to avoid overwhelming the local server.
 *
 * Requirement 13.8: runs as a single non-watch execution via `seo:check`,
 * evaluates the production build at a configurable base URL, and terminates
 * within 10 minutes.
 */
export default defineConfig({
  resolve: {
    alias: {
      // Mirrors the `@/*` -> `./src/*` mapping in tsconfig.json.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Boot the server (or read SEO_BASE_URL) before tests start.
    globalSetup: ["./tests/seo/global-setup.ts"],

    // Only include SEO suite test files.
    include: ["tests/seo/**/*.{test,spec}.{ts,tsx}"],

    // No jsdom — tests fetch real HTTP, not render components.
    environment: "node",

    // Cap concurrency at 6 workers so we don't overwhelm the server.
    maxWorkers: 6,

    // Generous timeout per test file: route-level tests iterate many routes.
    testTimeout: 120_000,

    // Non-watch mode (also enforced by the npm script using `vitest run`).
    watch: false,

    globals: false,
  },
});
