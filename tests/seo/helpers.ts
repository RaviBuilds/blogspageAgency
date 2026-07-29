/**
 * Shared helpers for the SEO check suite.
 *
 * - `Violation` — the structured failure record (Requirement 13.7).
 * - `fetchWithTimeout` — fetch wrapper using `AbortSignal.timeout(30_000)`;
 *   on timeout it throws `TimeoutViolationError` which callers catch and push
 *   as a Violation rather than aborting the whole suite (Requirement 13.10).
 * - `getBaseUrl` — re-exported from base-url.ts for ergonomics.
 */

export { getBaseUrl } from "./base-url";

// ---------------------------------------------------------------------------
// Violation type
// ---------------------------------------------------------------------------

/**
 * A structured assertion failure (Requirement 13.7):
 * target, assertion name, expected, observed.
 */
export type Violation = {
  /** Route path or file path under test. */
  target: string;
  /** Named assertion, e.g. "canonical-self-reference". */
  assertion: string;
  /** What the assertion expected. */
  expected: string;
  /** What was actually observed. */
  observed: string;
};

// ---------------------------------------------------------------------------
// Timeout error
// ---------------------------------------------------------------------------

export class TimeoutViolationError extends Error {
  constructor(
    public readonly url: string,
    public readonly timeoutMs: number
  ) {
    super(
      `Fetch to ${url} exceeded the ${timeoutMs}ms timeout (Requirement 13.10)`
    );
    this.name = "TimeoutViolationError";
  }
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Fetch a URL with an abort-signal timeout.
 *
 * On timeout (AbortError / TimeoutError), throws `TimeoutViolationError`
 * rather than a generic network error. Callers in the test loop catch it and
 * record a `Violation`, then continue iterating (Requirement 13.10).
 */
export async function fetchWithTimeout(
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "manual",
    });
    return response;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" ||
        error.name === "TimeoutError" ||
        (error as NodeJS.ErrnoException).code === "ABORT_ERR")
    ) {
      throw new TimeoutViolationError(url, timeoutMs);
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Concurrency limiter
// ---------------------------------------------------------------------------

/**
 * Run async tasks with a concurrency cap.
 *
 * The SEO suite caps at 6 concurrent fetches so the local Next.js server
 * isn't overwhelmed during the check run.
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

/** Default concurrency cap for the SEO check suite. */
export const CONCURRENCY_CAP = 6;
