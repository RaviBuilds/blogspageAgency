import { WEB_DESIGN_PROBLEMS } from "@/lib/web-design-data";
import { PROBLEM_MOTIFS } from "@/lib/web-design-visual-system";
import { ScrollReveal } from "@/components/home/scroll-reveal";

import { FAILURE_MOTIFS } from "./visuals/failure-states";
import { SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 2 — PROBLEM DIAGNOSIS.

   ## What changed and why

   Three equal cards, each an icon in a tinted square above a title and a
   paragraph. Structurally identical to the four card grids that followed it, so
   the page's first argument looked like its reference material.

   It is now a diagnosis: three editorial rows, each pairing the problem's copy
   with a drawing of the actual failure (`visuals/failure-states.tsx`). The rows
   alternate sides on `lg`, so the eye crosses the page rather than running down a
   column, and a hairline separates them the way a print diagnosis separates
   findings.

   ## Order of reading

   On mobile the artwork renders *before* the copy (`order-first`), because the
   section's job is to make the failure legible before the paragraph is read. On
   `lg` the alternation takes over and order is spatial rather than sequential.

   ## SSR

   Every title and description is a plain server-rendered text node inside
   `ScrollReveal`, which drives its reveal through `animate` behind the
   `useMotionReady` gate — so the served HTML carries readable copy with no inline
   opacity. The artwork is `aria-hidden` and carries no meaning of its own.
   ──────────────────────────────────────────────────────────────────────────── */

export function BusinessProblemSection() {
  const { eyebrow, h2, lead, cards } = WEB_DESIGN_PROBLEMS;

  return (
    <section className="relative overflow-hidden border-t border-border-subtle bg-background-subtle/70 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="statement"
            accent="cyan"
            measure="max-w-2xl"
          />
        </ScrollReveal>

        {/* THE FINDINGS. */}
        <div className="mt-20 flex flex-col">
          {cards.map((card, index) => {
            const motif = PROBLEM_MOTIFS[card.id];
            const Artwork = motif ? FAILURE_MOTIFS[motif] : null;
            const flipped = index % 2 === 1;

            return (
              <ScrollReveal key={card.id} delay={index * 0.06}>
                <article
                  className={`grid items-center gap-10 border-t border-border py-12 lg:grid-cols-12 lg:gap-16 lg:py-16 ${
                    index === 0 ? "border-t-0 pt-0" : ""
                  }`}
                >
                  {/* ── COPY ─────────────────────────────────────────── */}
                  <div
                    className={`lg:col-span-7 ${flipped ? "lg:order-2 lg:col-start-6" : ""}`}
                  >
                    {/* The finding index. Set large and quiet — it gives the
                        section a rhythm without competing with the title. */}
                    <span
                      aria-hidden
                      className="block text-5xl font-semibold leading-none tracking-tight text-border-strong sm:text-6xl"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="mt-6 max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[1.75rem]">
                      {card.title}
                    </h3>

                    <p className="mt-4 max-w-[56ch] text-base leading-[1.7] text-muted-foreground">
                      {card.description}
                    </p>
                  </div>

                  {/* ── ARTWORK ──────────────────────────────────────── */}
                  <div
                    aria-hidden
                    className={`order-first lg:order-none lg:col-span-5 ${
                      flipped ? "lg:order-1 lg:col-start-1" : ""
                    }`}
                  >
                    {Artwork ? <Artwork /> : null}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
