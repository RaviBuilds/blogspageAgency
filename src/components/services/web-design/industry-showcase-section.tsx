import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import { WEB_DESIGN_INDUSTRY_ROUTER } from "@/lib/web-design-data";
import { INDUSTRY_GOAL } from "@/lib/web-design-plain-language";
import { industryVisual } from "@/lib/web-design-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";

import { BrowserChrome, alpha } from "./visuals/frames";
import { SiteMock } from "./visuals/site-mock";
import { SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 8 — INDUSTRY SHOWCASE. The gallery.

   ## What changed and why

   Ten identical cards — focus label, name, description, a bordered footer link.
   A section whose entire argument is "we do not use one website style for every
   business" was rendering ten copies of one card, which argued the opposite as
   plainly as a layout can.

   Every tile now carries an actual website preview for its vertical, drawn by
   `SiteMock` from the archetype and accent in `web-design-visual-system.ts`. A
   clinic leads with an enquiry rail, a hotel with a room band and a date row, a
   SaaS product with an inked data panel and pricing tiers, a blog with a reading
   column and a sidebar. The previews differ *structurally*, not just in hue, which
   is what makes the claim legible.

   ## FINAL PASS — the structural difference is now also stated

   Ten structurally distinct previews prove the claim to anyone who studies them.
   Most visitors will not: they scan ten browser frames, register "ten templates",
   and move on. The difference was visible and unexplained.

   Each tile now carries its vertical's commercial goal as three beats — Trust →
   Treatments → Enquiry, Rooms → Availability → Booking, Products → Discovery →
   Purchase — from `INDUSTRY_GOAL`. It is real text directly beneath the preview,
   so the preview above it is read as the shape that goal produces rather than as a
   colourway.

   The beats are deliberately static. Ten animated chains on one viewport is the
   "constant motion" the brief rules out, and the relationship here is short enough
   that three words and two chevrons state it without being drawn.

   ## Why the previews are drawn rather than photographed

   Ten screenshots would be ten images on one viewport, and they would either be
   other people's websites or invented ones. Drawing them costs nothing to load,
   keeps every tile unmistakably part of the Blogspage AI visual language, and
   makes no claim to be a delivered project — the delivered projects are in the
   proof section, with real screenshots, where evidence belongs.

   ## Colour

   This is the section that carries the page's colour, and it stays on the approved
   cyan → blue → violet arc plus two sober neutrals. See the table's own note on
   why the arc is deliberately narrow.

   Each tile is a single anchor, so the whole tile is the target — no nested link,
   no duplicate route, and the focus ring lands on the tile.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * The vertical's commercial goal, as three beats on one line.
 *
 * Real text — this is the tile's explanation, not its decoration. The chevrons
 * between the beats are `aria-hidden`, because the reading order already carries
 * the sequence.
 */
function GoalBeats({
  beats,
  accent,
}: {
  beats: readonly [string, string, string];
  accent: string;
}) {
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium tracking-tight text-foreground/70">
      {beats.map((beat, i) => (
        <span key={beat} className="inline-flex items-center gap-1.5">
          <span>{beat}</span>
          {i < beats.length - 1 ? (
            <ChevronRight
              aria-hidden
              className="size-3 shrink-0"
              style={{ color: alpha(accent, 0.75) }}
            />
          ) : null}
        </span>
      ))}
    </p>
  );
}

export function IndustryShowcaseSection() {
  const { eyebrow, h2, lead, supportingCopy, industries } =
    WEB_DESIGN_INDUSTRY_ROUTER;

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-28 lg:py-36">
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

        {/* ── THE GALLERY ──────────────────────────────────────────────── */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item, index) => {
            const visual = industryVisual(item.id);
            const beats = INDUSTRY_GOAL[item.id];

            return (
              <ScrollReveal key={item.id} delay={(index % 3) * 0.05}>
                <Link
                  href={item.route}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card outline-none transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_28px_60px_-40px_rgb(14_21_36/0.45)] focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {/* THE PREVIEW. Fixed aspect so the ten tiles align, with the
                      accent wash behind the frame giving each vertical its own
                      light before the frame is even read. */}
                  <div
                    aria-hidden
                    className="relative overflow-hidden border-b border-border-subtle p-4 pb-0"
                    style={{ backgroundColor: visual.wash }}
                  >
                    <div
                      className="overflow-hidden rounded-t-lg border border-b-0 border-border bg-card shadow-[0_14px_30px_-22px_rgb(14_21_36/0.5)] transition-transform duration-500 group-hover:-translate-y-0.5"
                      style={{
                        borderColor: alpha(visual.accent, 0.18),
                      }}
                    >
                      <BrowserChrome tone={visual.inked ? "ink" : "paper"} />
                      <div className="h-[132px] sm:h-[146px]">
                        <SiteMock
                          archetype={visual.archetype}
                          accent={visual.accent}
                        />
                      </div>
                    </div>
                  </div>

                  {/* THE COPY. */}
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className={TYPE_MICRO}
                      style={{ color: visual.accent }}
                    >
                      {item.focus}
                    </span>

                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                      {item.name}
                    </h3>

                    {/* WHAT THE LAYOUT ABOVE IS SHAPED AROUND. */}
                    {beats ? (
                      <div className="mt-3.5 border-y border-border-subtle py-3">
                        <GoalBeats beats={beats} accent={visual.accent} />
                      </div>
                    ) : null}

                    <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    {/* The affordance. Real text, so the destination is
                        announced; the arrow is decoration on top of it. */}
                    <span className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-semibold text-primary">
                      <span>Explore {item.name} Blueprint</span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.06}>
          <p className="mt-14 max-w-2xl text-sm leading-relaxed text-text-subtle">
            {supportingCopy}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
