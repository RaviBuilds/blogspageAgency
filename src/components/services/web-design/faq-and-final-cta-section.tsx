import { WEB_DESIGN_FAQS, WEB_DESIGN_FINAL_CTA } from "@/lib/web-design-data";
import { TYPE_DISPLAY, TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SectionSeam } from "@/components/home/section-seam";

import { FaqAccordion } from "./faq-accordion";
import { WebDesignChatTrigger } from "./web-design-chat-trigger";
import { SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 11 — FAQ + FINAL CTA.

   Rendered as two sibling sections rather than one, because they are two beats: a
   quiet reference register, then the page's closing statement. Previously the CTA
   was a rounded card floating at the bottom of the FAQ section — the conclusion of
   a ten-section argument, presented as a widget.

   ## FAQ

   Left-aligned header on a two-column field, answers in a plain hairline list (see
   `faq-accordion.tsx` for why it is now native `<details>` and what that fixed).
   Nothing about the questions or answers changed.

   ## Final CTA

   Full-bleed dark band, the page's third and last dark surface, and the only place
   besides the hero that uses display-scale type. `TYPE_DISPLAY` is the homepage's
   bookend tier and it is used here for the same reason: this is where the page
   stops explaining and asks.

   The conversion mechanism is unchanged — `WebDesignChatTrigger` dispatching the
   existing `open-ai-chat` event. No form, no phone number, no calendar, no second
   path. The microcopy is the deck's.
   ──────────────────────────────────────────────────────────────────────────── */

export function FAQAndFinalCTASection() {
  const { h3, lead, buttonLabel, microcopy } = WEB_DESIGN_FINAL_CTA;

  return (
    <>
      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* The header holds the left axis and stays put while the list
                scrolls past it on wide viewports — the reference-material
                register the brief asks this section to keep. */}
            <div className="lg:col-span-4">
              <ScrollReveal>
                <SectionHeading
                  eyebrow="COMMON QUESTIONS"
                  title="Frequently Asked Questions About Our Web Design Services"
                  lead="Clear, transparent answers regarding inclusions, boundaries, pricing, and launch infrastructure."
                  register="quiet"
                  accent="cyan"
                  measure="max-w-md"
                />
              </ScrollReveal>
            </div>

            <div className="mt-12 lg:col-span-8 lg:mt-0">
              <ScrollReveal delay={0.06}>
                <FaqAccordion items={WEB_DESIGN_FAQS} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="dark relative overflow-hidden bg-background py-28 sm:py-36 lg:py-44">
        <SectionSeam edge="top" neighbour="page" depth="lg" />

        {/* The page's closing atmosphere: the full approved signal arc, cyan
            through blue to violet, wider and stronger than any earlier wash
            because nothing follows it. */}
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
            maskImage:
              "radial-gradient(60% 70% at 50% 100%, black, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(60% 70% at 50% 100%, black, transparent 78%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal>
              <span
                className={`${TYPE_MICRO} inline-flex items-center gap-2.5 text-accent-cyan`}
              >
                <span aria-hidden className="h-px w-8 bg-accent-cyan/40" />
                NEXT STEPS
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              {/* The copy deck defines this as an h3 and it stays an h3: the
                  display tier is a visual register, not a promotion. */}
              <h3
                className={`mt-8 ${TYPE_DISPLAY} text-surface-dark-foreground`}
              >
                {h3}
              </h3>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.7] text-white/60 sm:text-lg">
                {lead}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.18}>
              <div className="mt-12 flex flex-col items-center gap-4">
                <WebDesignChatTrigger
                  label={buttonLabel}
                  variant="card"
                  showSparkle
                />
                <p className="text-xs text-white/40">{microcopy}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
