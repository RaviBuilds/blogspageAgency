import { WEB_DESIGN_PROCESS } from "@/lib/web-design-data";
import { PROCESS_ARTIFACTS } from "@/lib/web-design-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";

import { STAGE_ARTIFACTS } from "./visuals/process-artifacts";
import { ProcessSpine } from "./visuals/process-spine";
import { SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 9 — PROCESS. The journey.

   ## What changed and why

   A `lg:grid-cols-5` of five cards. Five equal boxes side by side is the one
   arrangement that cannot express sequence — nothing in it said stage 3 comes
   after stage 2, and at one-fifth of the container each card's copy was squeezed
   to `text-xs`.

   It is now a journey down a single spine. One vertical line, drawn by scroll
   progress (`ProcessSpine`), with a numbered node per stage. Each stage pairs its
   copy with an artefact that shows the work *at that stage* — a node tree, then a
   greybox, then a designed UI, then a reviewed UI, then a live browser window. The
   artwork alone narrates idea → structure → design → refinement → live website,
   which is the section's claim.

   ## Why the artefacts evolve rather than illustrate

   Five unrelated illustrations would decorate five stages. Five states of the same
   page proves they are stages of one process. That is also why the deliverable line
   is kept: it is the stage's output, and it now sits directly under the artefact
   that shows it.

   Copy is untouched: same five step numbers, titles, descriptions and deliverables.
   ──────────────────────────────────────────────────────────────────────────── */

export function ProcessSection() {
  const { eyebrow, h2, lead, steps } = WEB_DESIGN_PROCESS;

  return (
    <section className="relative overflow-hidden border-t border-border-subtle bg-background-subtle/60 py-24 sm:py-28 lg:py-32">
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

        {/* ── THE JOURNEY ──────────────────────────────────────────────────
            The spine sits behind the node column at every breakpoint — including
            mobile, where a left-aligned timeline is the form that actually works
            on a narrow measure. */}
        <div className="relative mt-16">
          <ProcessSpine className="bottom-8 left-[1.4375rem] top-8" />

          <ol className="relative flex flex-col">
            {steps.map((item, index) => {
              const artifact = PROCESS_ARTIFACTS[item.step];
              const Artwork = artifact ? STAGE_ARTIFACTS[artifact] : null;
              const last = index === steps.length - 1;

              return (
                <li key={item.step}>
                  <ScrollReveal delay={index * 0.04}>
                    <article
                      className={`flex gap-6 sm:gap-8 ${last ? "pb-0" : "pb-14 sm:pb-16"}`}
                    >
                      {/* NODE. Carries the stage number as real text, so the
                          sequence survives without the artwork. */}
                      <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold tracking-tight text-accent-blue shadow-[0_6px_16px_-10px_rgb(14_21_36/0.5)]">
                        {item.step}
                      </span>

                      <div className="min-w-0 flex-1 lg:grid lg:grid-cols-12 lg:gap-10">
                        {/* COPY. */}
                        <div className="lg:col-span-7">
                          <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
                            {item.title}
                          </h3>

                          <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {item.description}
                          </p>

                          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className={`${TYPE_MICRO} text-text-disabled`}>
                              Deliverable
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {item.deliverable}
                            </span>
                          </div>
                        </div>

                        {/* ARTEFACT. */}
                        <div
                          aria-hidden
                          className="mt-7 lg:col-span-5 lg:mt-0"
                        >
                          {Artwork ? <Artwork /> : null}
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
