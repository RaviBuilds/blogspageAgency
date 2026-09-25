import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Unit and property test harness.
 *
 * Route-level checks that need a served production build live in the separate
 * `vitest.seo.config.ts` suite; everything here runs without a build.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Mirrors the `@/*` -> `./src/*` mapping in tsconfig.json.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    /*
     * `tests/seo/**` is owned by `vitest.seo.config.ts`, which boots a served
     * production build in `globalSetup`. Those specs cannot run here: this
     * harness starts no server, so every route fetch would fail.
     *
     * The exclusion was not needed until now only because `tests/seo/` held
     * helpers and no spec file, so the glob above matched nothing there.
     */
    exclude: ["**/node_modules/**", "**/dist/**", "tests/seo/**"],
    globals: false,
    watch: false,
  },
});
