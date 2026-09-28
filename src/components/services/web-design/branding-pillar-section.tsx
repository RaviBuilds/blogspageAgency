import { WEB_DESIGN_BRANDING } from "@/lib/web-design-data";
import { BRAND_SHEET } from "@/lib/web-design-plain-language";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

import { BRAND_ARTWORK, SpacingScale } from "./visuals/brand-board";
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
            One sheet, four regions, 2x2 from `lg`.

            The regions were previously built as two stacked columns, which put
            01 beside 03 in the top row and 02 beside 04 in the bottom one: the
            numbering ran down each column while the eye reads across. The
            numbers are the region's own index in the copy deck, so the layout
            has to follow them. A single grid in source order does that, and the
            internal rules are drawn per region rather than by `divide-*` so a
            2x2 can carry them (one right rule on the left column, one bottom
            rule under the first row). */}
        <ScrollReveal delay={0.08}>
          <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_34px_80px_-52px_rgb(14_21_36/0.34)]">
            {/* ── THE SHEET HEADER ────────────────────────────────────────
                What turns a container of four cards into a guideline artefact: a
                document header. Marker on the left, the section's whole argument
                in seven words in the middle, and the spacing ladder on the right
                as the sheet's own measure.

                The statement is about the *client's* brand, not ours, which is
                also the scope boundary the note below restates — this section
                applies a brand system to the web, it does not sell brand
                creation. */}
            <div className="flex flex-col gap-6 border-b border-border p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="min-w-0">
                <span className={`${TYPE_MICRO} text-accent-violet`}>
                  {BRAND_SHEET.label}
                </span>
                <p className="mt-3.5 max-w-[26ch] text-xl font-semibold leading-tight tracking-tighter text-foreground sm:text-2xl text-balance">
                  {BRAND_SHEET.statement}
                </p>
              </div>

              <div className="shrink-0 lg:w-56">
                <span
                  className={`${TYPE_MICRO} block text-text-disabled`}
                >
                  {BRAND_SHEET.spacingLabel}
                </span>
                <div aria-hidden className="mt-3">
                  <SpacingScale />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2">
              {elements.map((item, index) => {
                const Artwork = BRAND_ARTWORK[item.id];

                return (
                  <article
                    key={item.id}
                    className={cn(
                      "p-6 sm:p-8",
                      /* Stacked: a hairline between every region but the last. */
                      index < elements.length - 1 &&
                        "border-b border-border-subtle",
                      /* 2x2: rules only where two regions actually meet. */
                      index % 2 === 0 && "lg:border-r lg:border-border-subtle",
                      index < 2
                        ? "lg:border-b lg:border-border-subtle"
                        : "lg:border-b-0",
                    )}
                  >
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
