import { WEB_DESIGN_PILLAR } from "@/lib/web-design-data";
import { DESIGN_GOAL_CHAIN } from "@/lib/web-design-plain-language";
import { PILLAR_TONE } from "@/lib/web-design-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";

import { WebDesignChatTrigger } from "./web-design-chat-trigger";
import { DesignShowcase } from "./visuals/design-showcase";
import { ExplainerChain } from "./visuals/explainer-chain";
import { SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 4 — CORE WEB DESIGN (70%). The commercial heart of the page.

   ## What changed and why

   Six identical cards in a `sm:grid-cols-2 lg:grid-cols-3`, visually
   indistinguishable from the launch-infrastructure grid three sections later.
   The page's main service had no more visual weight than its supporting ones,
   which is the opposite of what the 70/20/10 model claims.

   The rebuild puts a design file on the page. `DesignShowcase` is the section's
   centrepiece: three artboards (desktop / tablet / mobile) on an annotated canvas
   with a component-state strip — a design studio showing how the work is actually
   decided. It spans the full container and breaks the page's rhythm deliberately,
   because this is the section a visitor is here for.

   The six capabilities become supporting information *around* that centrepiece: a
   two-column editorial index with hairline separators, numbered, tag above title.
   Same six titles, same six descriptions, same order, no cards.

   ## FINAL PASS — the reasoning comes before the artboards

   A designer looks at three artboards and reads craft. A gym owner looks at three
   artboards and reads decoration, because nothing on screen said what the
   artboards are *for*. The section was showing its output and withholding its
   argument.

   `DESIGN_GOAL_CHAIN` now sits between the header and the centrepiece, in that
   order deliberately:

       your business goal → your customer's experience
                          → the website design → they contact you

   Once that chain has been read, the artboards stop being interface screenshots
   and become evidence of the third step — which is the section's actual claim:
   we do not make screens look beautiful, we design the experience around the
   business. The chain's technical annotations (UX strategy, Figma UI system,
   conversion path) keep the methodology legible to a technical reader without
   making a business owner decode anything.

   ## The anchor

   `id="design-scope"` is preserved: the hero's secondary CTA targets it and that
   contract is not visual.
   ──────────────────────────────────────────────────────────────────────────── */

export function WebDesignPillarSection() {
  const { eyebrow, h2, lead, capabilities, ctaLabel } = WEB_DESIGN_PILLAR;

  return (
    <section
      id="design-scope"
      className="relative scroll-mt-24 overflow-hidden border-t border-border-subtle bg-background-subtle/60 py-24 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="statement"
            accent="blue"
            measure="max-w-xl"
          />
        </ScrollReveal>

        {/* ── THE ARGUMENT ─────────────────────────────────────────────────
            Real text in a real ordered list — the chain is the section's
            explanation, not its decoration, so it is not `aria-hidden` and it
            does not depend on JavaScript to be readable. Only the rules and
            chevrons between the nodes animate. */}
        <ScrollReveal delay={0.05}>
          <div className="mt-12 border-y border-border py-8 sm:mt-14">
            <p className={`${TYPE_MICRO} text-text-disabled`}>
              How a design decision gets made
            </p>
            <ExplainerChain
              steps={DESIGN_GOAL_CHAIN}
              accent={PILLAR_TONE.blue}
              size="feature"
              className="mt-5"
            />
          </div>
        </ScrollReveal>

        {/* ── THE CENTREPIECE ──────────────────────────────────────────────
            Now read as the third link of the chain above, rather than as a
            gallery of screens. */}
        <ScrollReveal delay={0.08}>
          <div aria-hidden className="mt-14 sm:mt-16">
            <DesignShowcase />
          </div>
        </ScrollReveal>

        {/* ── THE SCOPE INDEX ─────────────────────────────────────────────
            Two columns of editorial entries rather than six cards. The tag sits
            above the title as a category marker, and the hairline is the only
            container — which is what lets these read as the scope of one service
            instead of six separate offers. */}
        <div className="mt-20 grid gap-x-16 sm:mt-24 lg:grid-cols-2">
          {capabilities.map((item, index) => (
            <ScrollReveal key={item.id} delay={(index % 2) * 0.05}>
              <article className="border-t border-border py-8">
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="font-mono text-xs text-text-disabled"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`${TYPE_MICRO} text-accent-blue`}>
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-[1.375rem]">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* ── MID-PAGE CONVERSION ──────────────────────────────────────── */}
        <ScrollReveal delay={0.06}>
          <div className="mt-16 flex justify-start border-t border-border pt-10">
            <WebDesignChatTrigger
              label={ctaLabel}
              variant="outline"
              showSparkle
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
