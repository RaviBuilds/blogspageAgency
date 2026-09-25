/**
 * Shared base-URL storage for the SEO check suite.
 *
 * The global-setup module writes the base URL here on boot; every test reads
 * it through `getBaseUrl()`. This avoids polluting `globalThis` and keeps
 * the dependency explicit.
 */

/**
 * The resolved URL is published through `process.env`, not module state.
 *
 * Vitest runs `globalSetup` in the main process and each test file in a
 * separate worker, so the two do not share a module registry: a module-level
 * variable written during setup is always empty by the time a test reads it.
 * `process.env` is copied into workers when they spawn, which happens after
 * global setup completes, so it is a channel both sides genuinely share.
 *
 * `SEO_BASE_URL` is the same variable the suite already documents for pointing
 * the checks at a preview deployment, so this reuses one mechanism instead of
 * introducing a second.
 */
const ENV_KEY = "SEO_BASE_URL";

/** In-process cache, so a test file reads the value only once. */
let _baseUrl = "";

export function setBaseUrl(url: string): void {
  _baseUrl = url;
  process.env[ENV_KEY] = url;
}

export function getBaseUrl(): string {
  if (!_baseUrl) {
    _baseUrl = (process.env[ENV_KEY] ?? "").replace(/\/$/, "");
  }
  if (!_baseUrl) {
    throw new Error(
      "[seo-suite] Base URL not set. Did global-setup run successfully?"
    );
  }
  return _baseUrl;
}
