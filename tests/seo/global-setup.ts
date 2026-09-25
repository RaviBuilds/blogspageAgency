/**
 * Vitest globalSetup for the SEO check suite.
 *
 * On setup:
 * - If `SEO_BASE_URL` is set, use it (supports running against a preview deploy).
 * - Otherwise spawn `next start -p 3100`, poll until it answers or 90s elapse.
 *
 * On teardown:
 * - Kill the child process if one was spawned.
 *
 * Requirement 13.8: the suite evaluates a production build served at a
 * configurable base URL that defaults to the locally served production build.
 */

import { spawn, type ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";

import { setBaseUrl } from "./base-url";

let child: ChildProcess | null = null;

const PORT = 3100;
const POLL_INTERVAL_MS = 200;
const POLL_TIMEOUT_MS = 90_000;
const LOCAL_BASE_URL = `http://localhost:${PORT}`;

async function pollUntilReady(
  url: string,
  timeoutMs: number,
  intervalMs: number
): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(2_000),
      });
      if (res.ok || res.status === 200) {
        return;
      }
    } catch {
      // Server not ready yet — wait and retry.
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(
    `[seo-suite] Server at ${url} did not respond within ${timeoutMs / 1000}s. ` +
      `Ensure 'next build' succeeded before running 'seo:check'.`
  );
}

export async function setup(): Promise<void> {
  const envBaseUrl = process.env.SEO_BASE_URL;

  if (envBaseUrl) {
    // Use externally provided URL (e.g. preview deployment).
    setBaseUrl(envBaseUrl.replace(/\/$/, ""));
    return;
  }

  /* Spawn `next start` on the configured port.
   *
   * Runs Next's own bin script with the *current* Node executable rather than
   * going through an `npx` shim. Two reasons, both platform bugs this used to
   * hit on Windows:
   *
   * - `spawn("npx", ...)` fails with `ENOENT`, because `spawn` does not resolve
   *   PATHEXT and the installed shim is `npx.cmd`.
   * - `spawn("npx.cmd", ...)` then fails with `EINVAL`: since the fix for
   *   CVE-2024-27980, Node refuses to spawn `.bat`/`.cmd` files without
   *   `shell: true`, and enabling a shell would hand this argument list to a
   *   command interpreter for no benefit.
   *
   * `process.execPath` sidesteps both and also guarantees the server runs on
   * the same Node version as the suite. */
  const nextBin = fileURLToPath(
    new URL("../../node_modules/next/dist/bin/next", import.meta.url),
  );

  child = spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], {
    stdio: "pipe",
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "production" },
    detached: false,
  });

  // Forward stderr for debugging (non-blocking).
  child.stderr?.on("data", (data: Buffer) => {
    const line = data.toString().trim();
    if (line) {
      process.stderr.write(`[next-start] ${line}\n`);
    }
  });

  child.stdout?.on("data", (data: Buffer) => {
    const line = data.toString().trim();
    if (line) {
      process.stderr.write(`[next-start] ${line}\n`);
    }
  });

  // Wait until the server is ready.
  await pollUntilReady(LOCAL_BASE_URL, POLL_TIMEOUT_MS, POLL_INTERVAL_MS);
  setBaseUrl(LOCAL_BASE_URL);
}

export async function teardown(): Promise<void> {
  if (child) {
    child.kill("SIGTERM");

    // Wait for the process to exit gracefully (up to 5s).
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        child?.kill("SIGKILL");
        resolve();
      }, 5_000);

      child?.on("exit", () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    child = null;
  }
}
