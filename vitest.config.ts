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
    globals: false,
    watch: false,
  },
});
