import { WEB_DEVELOPMENT_PROCESS } from "@/lib/web-development-data";
import { PROCESS_PLAIN } from "@/lib/web-development-plain-language";
import { SYSTEM_TONE, alpha } from "@/lib/web-development-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { SectionHeading } from "@/components/services/web-design/visuals/section-shell";
import { ProcessSpine } from "@/components/services/web-design/visuals/process-spine";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { RHYTHM_MOVEMENT } from "@/lib/section-rhythm";

import { STAGE_ARTEFACTS } from "./visuals/process-artefacts";

/**
 * SECTION 08 — HOW WE BUILD.
 *
 * Five phases (Discover & Define → Architect → Build → Test & Validate → Launch
 * & Evolve), per canonical spec §15. No timeline, no duration, no turnaround
 * claim — the deck makes none and neither does this.
 *
 * ## What the final pass changed
 *
 * It was `lg:grid-cols-5` — five equal boxes side by side, which is the one
 * arrangement that cannot express sequence. Nothing in it said phase 3 follows
 * phase 2, and at a fifth of the container each phase's focus list was squeezed
 * to `text-xs`.
 *
 * It is now a journey down one spine, using the same `ProcessSpine` and the same
 * numbered-node form as the Web Design process section, so a visitor who has read
 * both pages recognises the shape. Each phase pairs its copy with the artefact the
 * phase produces — scope sheet, blueprint, increments, validation pass, live
 * system — so the artwork alone narrates requirement → structure → software →
 * verification → live system.
 *
 * Each phase also answers both questions the brief asks for, in a fixed order:
 * what happens (the action word, then the deck's focus list) and what you get
 * (the deck's output, labelled).
 *
 * Copy is the deck's, verbatim: same five steps, titles, focus lists and outputs.
 * The action word and one-line translation come from `PROCESS_PLAIN`.
 */
export function ProcessSection() {
  const { eyebrow, h2, lead, phases } = WEB_DEVELOPMENT_PROCESS;

  return (
    <section id="process" className={`${RHYTHM_MOVEMENT} scroll-mt-24 bg-background-subtle`}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="section"
            accent="blue"
            measure="max-w-2xl"
          />
        </ScrollReveal>

        <div className="relative mt-16">
          <ProcessSpine className="bottom-10 left-[1.4375rem] top-10" />

          <ol className="relative flex flex-col">
            {phases.map((phase, i) => {
              const plain = PROCESS_PLAIN[phase.step];
              const Artwork = STAGE_ARTEFACTS[phase.step];
              const last = i === phases.length - 1;
              const accent = last ? SYSTEM_TONE.cyan : SYSTEM_TONE.blue;

              return (
                <li key={phase.step}>
                  <ScrollReveal delay={i * 0.04}>
                    <article className={`flex gap-5 sm:gap-8 ${last ? "pb-0" : "pb-14 sm:pb-16"}`}>
                      {/* NODE — carries the phase number as real text, so the
                          sequence survives without the spine. */}
                      <span
                        className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border bg-card text-sm font-semibold tracking-tight tabular-nums shadow-[0_6px_16px_-10px_rgb(14_21_36/0.5)]"
                        style={{ borderColor: alpha(accent, 0.35), color: accent }}
                      >
                        {phase.step}
                      </span>

                      <div className="min-w-0 flex-1 lg:grid lg:grid-cols-12 lg:gap-10">
                        {/* ── WHAT HAPPENS ──────────────────────────────── */}
                        <div className="lg:col-span-8">
                          {/* Dual-layer heading: the action word leads, the
                              deck's own phase title sits inside the same heading
                              beneath it, so the outline keeps its phrases. */}
                          <h3>
                            <span className="block text-2xl font-semibold leading-tight tracking-tighter text-foreground sm:text-3xl">
                              {plain?.action ?? phase.title}
                            </span>
                            <span className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                              <span className={`${TYPE_MICRO}`} style={{ color: accent }}>
                                Phase {phase.step}
                              </span>
                              <span aria-hidden className="text-text-disabled">
                                ·
                              </span>
                              <span className="text-sm font-medium leading-snug tracking-tight text-text-subtle">
                                {phase.title}
                              </span>
                            </span>
                          </h3>

                          {plain?.plain ? (
                            <p className="mt-5 max-w-[46ch] text-lg font-medium leading-snug text-foreground/80 sm:text-xl">
                              {plain.plain}
                            </p>
                          ) : null}

                          <ul className="mt-5 flex flex-wrap gap-1.5">
                            {phase.focus.map((item) => (
                              <li
                                key={item}
                                className="rounded-full border border-border-subtle bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>

                          {/* ── WHAT YOU GET ────────────────────────────── */}
                          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className={`${TYPE_MICRO} text-text-disabled`}>
                              What you get
                            </span>
                            <span className="max-w-[48ch] text-sm font-medium leading-snug text-foreground">
                              {phase.output}
                            </span>
                          </div>
                        </div>

                        {/* ── THE ARTEFACT ──────────────────────────────── */}
                        <div className="mt-7 lg:col-span-4 lg:mt-0">
                          {Artwork ? <Artwork accent={accent} /> : null}
                        </div>
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
