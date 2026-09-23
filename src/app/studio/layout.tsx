import type { Metadata } from "next";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";

export { viewport };

/**
 * `next-sanity/studio`'s default metadata already sets `robots: "noindex"`,
 * but Requirement 3.7 wants an explicit `{ index: false, follow: false }`
 * object so every nested `/studio` path inherits a directive that also
 * blocks link-following, not just indexing. `robots.txt` alone (see
 * `src/app/robots.ts`) only tells crawlers not to fetch `/studio` — it
 * cannot produce a `noindex` directive for a page that does get fetched.
 */
export const metadata: Metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-dvh overflow-hidden">{children}</div>;
}
