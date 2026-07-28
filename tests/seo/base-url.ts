/**
 * Shared base-URL storage for the SEO check suite.
 *
 * The global-setup module writes the base URL here on boot; every test reads
 * it through `getBaseUrl()`. This avoids polluting `globalThis` and keeps
 * the dependency explicit.
 */

let _baseUrl = "";

export function setBaseUrl(url: string): void {
  _baseUrl = url;
}

export function getBaseUrl(): string {
  if (!_baseUrl) {
    throw new Error(
      "[seo-suite] Base URL not set. Did global-setup run successfully?"
    );
  }
  return _baseUrl;
}
