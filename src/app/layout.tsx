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
    title: "Blogspage | AI Automation & SaaS Agency",
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
    <html lang={LOCALE.html} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
