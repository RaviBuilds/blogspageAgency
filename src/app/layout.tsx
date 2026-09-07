import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { buildMetadata } from "@/lib/seo";
import { LOCALE, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // `metadataBase` is declared here, and only here: Next.js inherits it to
  // every child route's metadata, and `buildMetadata` itself never sets it.
  metadataBase: new URL(SITE_URL),
  ...buildMetadata({
    path: "/",
    // The assigned phrase is carried verbatim, in the map's own lowercase, the
    // way every other route's title carries its phrase (Requirement 12.5).
    // `titleAbsolute` means no template suffix is appended, so these 45
    // characters are the whole rendered title (Requirement 4.4).
    title: "Blogspage: ai automation agency & SaaS studio",
    description:
      "Blogspage builds production-grade SaaS, digital systems, and AI workflows for ambitious founders. We turn product ideas into scalable, revenue-ready platforms.",
    type: "website",
    titleAbsolute: true,
    keywordPhrase: "ai automation agency",
    // `keywords` carries near-zero SEO weight with modern crawlers, but the
    // original list is preserved here via `extra` rather than dropped, since
    // `BuildMetadataInput` has no dedicated field for it.
    extra: {
      keywords: [
        "SaaS agency",
        "AI automation",
        "digital systems",
        "AI workflows",
        "product engineering",
        "web development",
      ],
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the preloader boot script in (site)/layout.tsx
    // sets `data-preloader="skip"` on <html> during HTML parsing, before React
    // hydrates, so the hydrated DOM legitimately differs from the server HTML
    // on this one attribute. React can't know that mutation is ours, so the
    // warning is suppressed for <html>'s own attributes only (not children) —
    // the same pattern next-themes uses for its pre-hydration theme script.
    <html lang={LOCALE.html} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
