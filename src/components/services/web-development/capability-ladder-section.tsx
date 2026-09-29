import Link from "next/link";
import { Check } from "lucide-react";

import { WEB_DEVELOPMENT_CAPABILITY_LADDER } from "@/lib/web-development-data";
import { LADDER_WEIGHT, SYSTEM_TONE, alpha } from "@/lib/web-development-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { SectionHeading, ScopeNote } from "@/components/services/web-design/visuals/section-shell";
import { ProcessSpine } from "@/components/services/web-design/visuals/process-spine";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { RHYTHM_MOVEMENT } from "@/lib/section-rhythm";

/**
 * SECTION 03 — CAPABILITY LADDER ("What Are You Building?").
 *
 * ## What the final pass changed
 *
 * It was five rows divided by hairlines, each with a step indicator whose five
 * bars were drawn at the *same* five heights on every rung — so the silhouette
 * of level 1 and level 5 were identical and only the fill count differed. The
 * ascent the section is named for was not in the layout.
 *
 * It is now a climb up one spine: the same scroll-drawn `ProcessSpine` the Web
 * Design process section uses (imported, not re-implemented), a numbered node per
 * rung, and a staircase glyph whose *height and mass both grow* with the rung's
 * weight. A visitor scrolling past reads a rise before reading a word.
 *
 * Five rungs on a shared spine also stops this reading as five comparable
 * packages: a ladder has an order, a pricing grid does not.
 *
 * Copy is the deck's, verbatim: same five levels, audiences, item lists,
 * boundary notes and CTAs, in the same order. No price, no duration, no "most
 * popular" marker — none of which the deck contains.
 */
export function CapabilityLadderSection() {
  const { eyebrow, h2, lead, levels } = WEB_DEVELOPMENT_CAPABILITY_LADDER;

  return (
    <section id="capability-ladder" className={`${RHYTHM_MOVEMENT} scroll-mt-24 bg-background-subtle`}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="statement"
            accent="blue"
            measure="max-w-2xl"
          />
        </ScrollReveal>

        {/* ── THE CLIMB ────────────────────────────────────────────────────
            The spine sits behind the node column at every breakpoint, including
            mobile, where a left-aligned ladder is the form that actually works on
            a narrow measure. */}
        <div className="relative mt-16">
          <ProcessSpine className="bottom-10 left-[1.4375rem] top-10" />

          <ol className="relative flex flex-col">
            {levels.map((rung, i) => {
              const weight = LADDER_WEIGHT[rung.id] ?? i + 1;
              const last = i === levels.length - 1;
              const accent = last ? SYSTEM_TONE.violet : SYSTEM_TONE.blue;

              return (
                <li key={rung.id}>
                  <ScrollReveal delay={i * 0.04}>
                    <article className={`flex gap-5 sm:gap-8 ${last ? "pb-0" : "pb-12 sm:pb-14"}`}>
                      {/* NODE. Carries the rung number as real text, so the
                          sequence survives without the spine. */}
                      <span
                        className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border bg-card text-sm font-semibold tracking-tight shadow-[0_6px_16px_-10px_rgb(14_21_36/0.5)]"
                        style={{
                          borderColor: alpha(accent, 0.35),
                          color: accent,
                        }}
                      >
                        {i + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                          <div className="min-w-0">
                            <span className={`${TYPE_MICRO} block text-text-disabled`}>
                              {rung.level}
                            </span>
                            <h3 className="mt-2.5 text-2xl font-semibold leading-tight tracking-tighter text-foreground sm:text-3xl text-balance">
                              {rung.title}
                            </h3>
                            <p className="mt-3 max-w-[48ch] text-base leading-snug text-foreground/70 sm:text-lg">
                              {rung.audience}
                            </p>
                          </div>

                          <ComplexityStair weight={weight} total={levels.length} accent={accent} />
                        </div>

                        <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                          {rung.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 border-b border-border-subtle/70 pb-2 text-sm leading-snug text-foreground/80"
                            >
                              <Check
                                aria-hidden
                                className="mt-0.5 size-3.5 shrink-0"
                                style={{ color: accent }}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {rung.boundaryNote ? (
                          <ScopeNote className="mt-6 max-w-2xl" accent="cyan">
                            {rung.boundaryNote}
                          </ScopeNote>
                        ) : null}

                        {rung.ctaLabel && rung.ctaRoute ? (
                          <Link
                            href={rung.ctaRoute}
                            className="mt-6 inline-flex items-center text-sm font-semibold underline decoration-2 underline-offset-4 transition-colors"
                            style={{ color: accent, textDecorationColor: alpha(accent, 0.35) }}
                          >
                            {rung.ctaLabel}
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  </ScrollReveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * The rung's operational complexity, as a staircase.
 *
 * Both the number of filled steps *and* the height of the block grow with the
 * rung's weight, which is the fix: a glyph whose outline is identical on every
 * rung communicates nothing about ascent. Purely decorative — the rung's level
 * and title already carry the same information as text — so it is `aria-hidden`.
 *
 * The scale is the shared `LADDER_WEIGHT` table, not an invented percentage, and
 * it is never labelled with a number: it says "more moving parts", not "40%
 * more".
 */
function ComplexityStair({
  weight,
  total,
  accent,
}: {
  weight: number;
  total: number;
  accent: string;
}) {
  /* 30px at rung 1 up to 56px at rung 5 — enough rise to be read at a glance,
     not enough to turn a label into a chart. */
  const blockHeight = 26 + (weight / total) * 30;

  return (
    <span
      aria-hidden
      className="flex shrink-0 items-end gap-1"
      style={{ height: `${blockHeight}px` }}
    >
      {Array.from({ length: total }).map((_, step) => {
        const filled = step < weight;
        return (
          <span
            key={step}
            className="w-1.5 rounded-[0.125rem]"
            style={{
              height: `${28 + (step / (total - 1)) * 72}%`,
              backgroundColor: filled ? alpha(accent, 0.75 - step * 0.06) : undefined,
              border: filled ? undefined : "1px solid var(--border-subtle)",
            }}
          />
        );
      })}
    </span>
  );
}
