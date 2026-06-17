import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import ChatWidget from "@/components/chat-widget";
import { Preloader } from "@/components/ui/preloader";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
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
  metadataBase: new URL("https://blogspage.com"),
  title: {
    default: "Blogspage | AI Automation & SaaS Agency",
    template: "%s | Blogspage",
  },
  description:
    "Blogspage builds production-grade SaaS, digital systems, and AI workflows for ambitious founders. We turn bold product ideas into scalable, revenue-ready platforms.",
  keywords: [
    "SaaS agency",
    "AI automation",
    "digital systems",
    "AI workflows",
    "product engineering",
    "web development",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blogspage.com",
    siteName: "Blogspage",
    title: "Blogspage | AI Automation & SaaS Agency",
    description:
      "We build production-grade SaaS, digital systems, and AI workflows for ambitious founders. Turn bold product ideas into scalable, revenue-ready platforms.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Blogspage | AI Automation & SaaS Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogspage | AI Automation & SaaS Agency",
    description:
      "We build production-grade SaaS, digital systems, and AI workflows for ambitious founders.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Preloader />
        <CustomCursor />
        <SmoothScrollProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatWidget />
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
