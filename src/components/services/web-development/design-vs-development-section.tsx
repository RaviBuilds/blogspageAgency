import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { WEB_DEVELOPMENT_DESIGN_VS_DEV } from "@/lib/web-development-data";
import { SYSTEM_TONE, alpha } from "@/lib/web-development-visual-system";
import { SectionHeading } from "@/components/services/web-design/visuals/section-shell";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { RHYTHM_SECTION } from "@/lib/section-rhythm";

import { BoundaryStack } from "./visuals/boundary-stack";

/**
 * SECTION 02 — DESIGN VS DEVELOPMENT.
 *
 * Still deliberately short per canonical spec §7 — one clean boundary and
 * exactly one contextual link back to Web Design. Nothing from that page is
 * summarised here.
 *
 * ## What the final pass changed
 *
 * The section stated a boundary and then showed one side of it: a flat wrap of
 * ten pills. A boundary needs two sides and an edge to be legible, so it now
 * reads as a two-column ownership split (Web Design owns / Web Development owns)
 * beside `BoundaryStack`, which draws the same idea as one object: a page surface,
 * a labelled seam, and the system that runs underneath when someone acts on it.
 *
 * Copy is unchanged apart from the two side labels and the one-sentence boundary
 * note now held in the copy deck. The design-side labels name scope the Web
 * Design page already owns rather than introducing new claims.
 */
export function DesignVsDevelopmentSection() {
  const {
    eyebrow,
    h2,
    lead,
    designOwns,
    designOwnsLabel,
    developmentOwns,
    developmentOwnsLabel,
    boundaryNote,
    designLinkContext,
    designLinkRoute,
    designLinkLabel,
  } = WEB_DEVELOPMENT_DESIGN_VS_DEV;

  return (
    <section id="design-vs-development" className={`${RHYTHM_SECTION} scroll-mt-24 bg-background`}>
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

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ── THE OWNERSHIP SPLIT ──────────────────────────────────────
              Two columns, each a real list. The design side is quieter than the
              development side on purpose: this is the development page, and the
              design side is here to mark the boundary, not to compete with it. */}
          <div className="lg:col-span-7">
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
              <OwnershipColumn
                label={designOwnsLabel}
                items={designOwns}
                accent={SYSTEM_TONE.cyan}
                emphasis={false}
              />
              <OwnershipColumn
                label={developmentOwnsLabel}
                items={developmentOwns}
                accent={SYSTEM_TONE.blue}
                emphasis
              />
            </div>

            <p className="mt-10 max-w-[56ch] text-base leading-[1.7] text-foreground/75">
              {boundaryNote}
            </p>

            <p className="mt-6 max-w-2xl border-l-2 border-accent-blue/40 pl-5 text-sm leading-relaxed text-text-subtle">
              {designLinkContext}{" "}
              <Link
                href={designLinkRoute}
                className="group inline-flex items-center gap-1 font-semibold text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
              >
                {designLinkLabel}
                <ArrowRight
                  aria-hidden
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </p>
          </div>

          {/* ── THE SAME IDEA, DRAWN ONCE ────────────────────────────────── */}
          <ScrollReveal delay={0.08} className="lg:col-span-5">
            <BoundaryStack />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/**
 * One side of the boundary: a small accent label and its scope list.
 *
 * `emphasis` is the only difference between the two columns — full-strength ink
 * and a heavier marker for the side this page owns, muted for the side it links
 * to. Same component, so the two lists cannot drift into different typography.
 */
function OwnershipColumn({
  label,
  items,
  accent,
  emphasis,
}: {
  label: string;
  items: readonly { id: string; label: string }[];
  accent: string;
  emphasis: boolean;
}) {
  return (
    <div>
      <p className="flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
        <span
          aria-hidden
          className="h-px w-6 shrink-0"
          style={{ backgroundColor: alpha(accent, 0.5) }}
        />
        {label}
      </p>
      <ul className="mt-5 flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
        {items.map((item) => (
          <li
            key={item.id}
            className={
              emphasis
                ? "py-2.5 text-sm font-medium tracking-tight text-foreground"
                : "py-2.5 text-sm tracking-tight text-muted-foreground"
            }
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
