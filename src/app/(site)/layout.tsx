import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { Preloader } from "@/components/ui/preloader";
import { ClientEnhancements } from "@/components/providers/client-enhancements";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationNode } from "@/lib/structured-data";

/*
 * Boot guard for the SSR'd preloader overlay. It executes during HTML
 * parsing — before the browser can paint the overlay markup that follows it —
 * and flags <html> with `data-preloader="skip"` whenever the overlay must not
 * play: a revisit within the session, prefers-reduced-motion, or (failsafe)
 * 3s after boot if hydration never landed, so broken or blocked JS can never
 * trap the page behind the "000" screen. globals.css turns the flag into
 * `display: none`. Storage access is guarded — private-mode quirks must not
 * throw here.
 */
const PRELOADER_BOOT_SCRIPT = `try{if(sessionStorage.getItem("blogspage-preloaded")||window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-preloader","skip")}}catch(e){};setTimeout(function(){document.documentElement.setAttribute("data-preloader","skip")},3000)`;

/*
 * No-JS fallback for the same failure: without scripting the counter can
 * never run or release, so the overlay is hidden outright and the page
 * content stays readable (crawlable render included). dangerouslySetInnerHTML
 * keeps React from hydrating inside <noscript>, whose content the HTML parser
 * treats as raw text whenever scripting is enabled.
 */
const PRELOADER_NOSCRIPT_STYLE =
  '<style>[data-preloader-overlay]{display:none!important}</style>';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SkipLink />
      <JsonLd nodes={[organizationNode()]} />
      <script dangerouslySetInnerHTML={{ __html: PRELOADER_BOOT_SCRIPT }} />
      <noscript dangerouslySetInnerHTML={{ __html: PRELOADER_NOSCRIPT_STYLE }} />
      <Preloader />
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ClientEnhancements />
    </>
  );
}
