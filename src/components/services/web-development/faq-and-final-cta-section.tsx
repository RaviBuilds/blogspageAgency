import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  WEB_DEVELOPMENT_FAQS,
  WEB_DEVELOPMENT_FAQS_HEADING,
  WEB_DEVELOPMENT_FINAL_CTA,
} from "@/lib/web-development-data";
import { BRAND_TEXT_GRADIENT_ISLAND, TYPE_DISPLAY, TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SectionSeam } from "@/components/home/section-seam";
import { FaqAccordion } from "@/components/services/web-design/faq-accordion";
import { SectionHeading } from "@/components/services/web-design/visuals/section-shell";

import { WebDevelopmentChatTrigger } from "./web-development-chat-trigger";

/**
 * SECTION 09 + 10 — RIGHT-SIZING + FAQ, then FINAL CTA.
 *
 * Two sibling sections rather than one, because they are two beats: a quiet
 * reference register, then the page's closing statement. Structured identically
 * to the Web Design page's own pair, and reusing the same primitives verbatim —
 * `FaqAccordion` (native `<details>`, so every answer ships in the HTML and is
 * crawlable as text as well as in the FAQPage schema), `SectionSeam`, and the
 * `open-ai-chat` CTA mechanism. Only the copy deck, the heading accent and the
 * CTA labels are this page's own.
 *
 * ## What the final pass changed
 *
 * The FAQ column now carries one contextual hand-off — the reciprocal of the link
 * the Web Design FAQ points back here — for the visitor whose questions are about
 * building a product rather than a business system.
 *
 * The closing band gains the page's only link to the contact route, as a quiet
 * third path under the two approved buttons. Both of those buttons open the AI
 * consultant, which stays the primary mechanism; someone who would rather write
 * the requirement down previously had no path from this page at all.
 */

/** Where the closing headline's meaningful phrase begins. */
const CTA_BRAND_PHRASE = "Become a Working System?";

/**
 * Split a headline into its neutral head and its brand-emphasised tail. Returns
 * the whole string as the head when the phrase is absent, so a re-approved
 * headline degrades to plain ink rather than a mis-painted sweep.
 */
function splitOnPhrase(text: string, phrase: string): [string, string | null] {
  const at = text.indexOf(phrase);
  if (at < 0) return [text, null];
  return [text.slice(0, at), text.slice(at)];
}

export function FaqAndFinalCtaSection() {
  const {
    eyebrow,
    h2,
    lead: faqLead,
    crossLinkContext,
    crossLinkLabel,
    crossLinkRoute,
  } = WEB_DEVELOPMENT_FAQS_HEADING;
  const {
    h3,
    lead,
    buttonLabel,
    secondaryLabel,
    microcopy,
    contactContext,
    contactLabel,
    contactRoute,
  } = WEB_DEVELOPMENT_FINAL_CTA;
  const [ctaHead, ctaTail] = splitOnPhrase(h3, CTA_BRAND_PHRASE);

  return (
    <>
      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-background py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* The header holds the left axis while the list scrolls past it on
                wide viewports — the reference register this section keeps. */}
            <div className="lg:col-span-4">
              <ScrollReveal>
                <SectionHeading
                  eyebrow={eyebrow}
                  title={h2}
                  lead={faqLead}
                  register="quiet"
                  accent="blue"
                  measure="max-w-md"
                />
              </ScrollReveal>

              <ScrollReveal delay={0.06}>
                <p className="mt-6 max-w-md border-l-2 border-accent-violet/40 pl-4 text-sm leading-relaxed text-text-subtle">
                  {crossLinkContext}{" "}
                  <Link
                    href={crossLinkRoute}
                    className="group inline-flex items-center gap-1 font-semibold text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {crossLinkLabel}
                    <ArrowRight
                      aria-hidden
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                  .
                </p>
              </ScrollReveal>
            </div>

            <div className="mt-12 lg:col-span-8 lg:mt-0">
              <ScrollReveal delay={0.06}>
                <FaqAccordion items={WEB_DEVELOPMENT_FAQS} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="dark relative overflow-hidden bg-background py-28 sm:py-36 lg:py-44">
        <SectionSeam edge="top" neighbour="page" depth="lg" />

        {/* The page's closing atmosphere: the full approved arc, cyan through
            blue to violet, wider than any earlier wash because nothing
            follows it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 110%, rgba(130, 143, 255, 0.20), transparent 68%), radial-gradient(45% 45% at 12% 8%, rgba(103, 232, 249, 0.12), transparent 70%), radial-gradient(45% 45% at 88% 12%, rgba(167, 139, 250, 0.14), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #EEF1F6 1px, transparent 1px), linear-gradient(to bottom, #EEF1F6 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(60% 70% at 50% 100%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(60% 70% at 50% 100%, black, transparent 78%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal>
              <span className={`${TYPE_MICRO} inline-flex items-center gap-2.5 text-accent-cyan`}>
                <span aria-hidden className="h-px w-8 bg-accent-cyan/40" />
                NEXT STEPS
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              {/* The copy deck defines this as an h3 and it stays an h3: the
                  display tier is a visual register, not a promotion. */}
              <h3 className={`mt-8 ${TYPE_DISPLAY} text-surface-dark-foreground`}>
                {ctaHead}
                {ctaTail ? (
                  <span className="hero-brand-word" style={BRAND_TEXT_GRADIENT_ISLAND}>
                    {ctaTail}
                  </span>
                ) : null}
              </h3>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.7] text-white/60 sm:text-lg">
                {lead}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.18}>
              <div className="mt-12 flex flex-col items-center gap-5">
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <WebDevelopmentChatTrigger label={buttonLabel} variant="card" showSparkle />
                  <WebDevelopmentChatTrigger label={secondaryLabel} variant="outline" />
                </div>
                <p className="text-xs text-white/55">{microcopy}</p>
                <p className="text-sm text-white/60">
                  {contactContext}{" "}
                  <Link
                    href={contactRoute}
                    className="group inline-flex items-center gap-1 font-semibold text-surface-dark-foreground underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-accent-cyan"
                  >
                    {contactLabel}
                    <ArrowRight
                      aria-hidden
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
