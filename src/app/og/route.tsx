/**
 * Social preview image route (Requirements 4.7, 4.9).
 *
 * `ogImageUrl` in `src/lib/seo.ts` is the only caller. It builds
 * `/og?title=...&eyebrow=...`; this route renders that into a 1200x630
 * image with `ImageResponse` from `next/og`.
 *
 * Generation is raced against an 1800 ms timer inside a `try/catch`. Either
 * the timeout or a thrown error redirects (302) to the committed static
 * fallback `/og-default.png` (task 6.1), so a slow or failing generation
 * degrades the preview image, never the page.
 *
 * Font note: the design calls for a font subset committed under
 * `src/app/og/fonts/`, loaded locally so generation never depends on a
 * remote fetch. No such subset is available in this repository (no font
 * package dependency, no cached `next/font` output, and no font binary
 * that is clearly safe to redistribute), and fetching one from Google Fonts
 * at request time would reintroduce the exact remote dependency the design
 * warns is the usual cause of blowing the timeout budget. So this route
 * omits the `fonts` option entirely and lets `ImageResponse` fall back to
 * its built-in sans-serif, which still satisfies "never fetched remotely."
 * If a locally-committed font subset is added later under
 * `src/app/og/fonts/`, wire it through the `fonts` option here.
 */
import { ImageResponse } from "next/og";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;
const TIMEOUT_MS = 1800;
const DEFAULT_TITLE = "Blogspage";

const TIMEOUT = Symbol("og-timeout");

function fallbackRedirect(request: Request): Response {
  return Response.redirect(new URL("/og-default.png", request.url), 302);
}

export async function GET(request: Request): Promise<Response> {
  let title = DEFAULT_TITLE;
  let eyebrow = "";

  try {
    const { searchParams } = new URL(request.url);
    const rawTitle = (searchParams.get("title") ?? "").trim();
    title = rawTitle === "" ? DEFAULT_TITLE : rawTitle;
    eyebrow = (searchParams.get("eyebrow") ?? "").trim();
  } catch {
    // Malformed request URL: render with the defaults rather than 500.
  }

  try {
    const result = await Promise.race([
      generateImage(title, eyebrow),
      new Promise<typeof TIMEOUT>((resolve) =>
        setTimeout(() => resolve(TIMEOUT), TIMEOUT_MS),
      ),
    ]);

    if (result === TIMEOUT) {
      return fallbackRedirect(request);
    }

    return result;
  } catch {
    return fallbackRedirect(request);
  }
}

async function generateImage(
  title: string,
  eyebrow: string,
): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(circle at 80% 15%, rgba(99, 102, 241, 0.35), rgba(99, 102, 241, 0) 60%)",
          fontFamily:
            '"Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: 2,
              color: "#a1a1aa",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#f5f5f7",
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 26,
            fontWeight: 400,
            color: "#71717a",
          }}
        >
          blogspage.com
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    },
  );
}
