import { WEB_DESIGN_BRANDING } from "@/lib/web-design-data";
import { ScrollReveal } from "@/components/home/scroll-reveal";

import { BRAND_ARTWORK } from "./visuals/brand-board";
import { ScopeNote, SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 5 — BRAND PRESENTATION (20%).

   ## What changed and why

   Four narrow cards in a `lg:grid-cols-4`, each a violet dot above a title and
   `text-xs` copy, followed by a tinted alert box. A section about visual craft
   that showed none of it, in the page's smallest body size.

   It is now a brand board: one bordered sheet divided into four regions, each
   region pairing its element's copy with a real artefact — a live type specimen,
   the actual token palette with its values, the Blogspage AI mark on paper and on
   ink, and four page fragments resolving to one component system. Same four
   titles, same four descriptions, same order.

   ## Why it is a board and not four cards with pictures in them

   The deliverable being described is a *system*: the point is that these four
   things agree with each other. Four separate cards is the one layout that cannot
   express agreement. A single sheet with internal dividers can, and it is also
   the form the real artefact takes.

   ## Holding the 20%

   The section is deliberately quieter than section 4: no display-scale heading,
   no full-bleed centrepiece, `section` register rather than `statement`. Branding
   is the supporting pillar and the page's visual hierarchy has to keep saying so.
   ──────────────────────────────────────────────────────────────────────────── */

export function BrandingPillarSection() {
  const { eyebrow, h2, lead, elements, boundaryNote } = WEB_DESIGN_BRANDING;

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-28 lg:py-32">
      {/* A violet wash anchored to the left edge — the pillar's accent, used as
          atmosphere exactly once so the section has its own tonal identity
          without a second gradient competing inside the board. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/2"
        style={{
          background:
            "radial-gradient(60% 55% at 0% 40%, rgba(124, 58, 237, 0.10), transparent 72%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="section"
            accent="violet"
            measure="max-w-2xl"
          />
        </ScrollReveal>

        {/* ── THE BOARD ────────────────────────────────────────────────────
            One sheet. `divide-*` supplies the internal rules, so the four
            regions read as parts of a single document rather than as tiles. */}
        <ScrollReveal delay={0.08}>
          <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_34px_80px_-52px_rgb(14_21_36/0.34)]">
            <div className="grid divide-y divide-border-subtle lg:grid-cols-2 lg:divide-y-0">
              {[0, 1].map((row) => (
                <div
                  key={row}
                  className={`grid divide-y divide-border-subtle ${row === 0 ? "lg:border-r lg:border-border-subtle" : ""}`}
                >
                  {elements.slice(row * 2, row * 2 + 2).map((item, i) => {
                    const Artwork = BRAND_ARTWORK[item.id];
                    const index = row * 2 + i;

                    return (
                      <article key={item.id} className="p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="font-mono text-xs text-text-disabled"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            aria-hidden
                            className="h-px w-6 bg-accent-violet/40"
                          />
                        </div>

                        <h3 className="mt-3.5 text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
                          {item.title}
                        </h3>

                        <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>

                        {/* THE ARTEFACT. */}
                        {Artwork ? (
                          <div
                            aria-hidden
                            className="mt-6 rounded-xl border border-border-subtle bg-background-subtle/60 p-4 sm:p-5"
                          >
                            <Artwork />
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── SCOPE BOUNDARY ──────────────────────────────────────────────
            The same margin-note treatment used by the local-visibility and proof
            boundaries, so the page's three scope statements are recognisably one
            kind of thing. Copy is verbatim from the deck. */}
        <ScrollReveal delay={0.06}>
          <ScopeNote
            title={boundaryNote.title}
            accent="violet"
            className="mt-12 max-w-3xl"
          >
            {boundaryNote.text}
          </ScopeNote>
        </ScrollReveal>
      </div>
    </section>
  );
}
