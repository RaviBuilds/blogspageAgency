import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { WEB_DEVELOPMENT_CAPABILITIES } from "@/lib/web-development-data";
import { CAPABILITY_GROUP_ACCENT, SYSTEM_TONE, alpha } from "@/lib/web-development-visual-system";
import { SectionHeading } from "@/components/services/web-design/visuals/section-shell";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { RHYTHM_MOVEMENT } from "@/lib/section-rhythm";

/**
 * SECTION 06 — WHAT WE CAN CONNECT & BUILD.
 *
 * Organized by business job (Capture → Transact → Operate → Connect → Extend),
 * never by programming language, per canonical spec §12.
 *
 * ## What the final pass changed
 *
 * Five bordered cards in a five-column grid: at `lg` each card was ~180px wide
 * with its own border, its own padding and its own surface, holding six list
 * items — twenty-six short strings inside five competing containers, which is the
 * densest and least scannable arrangement available.
 *
 * It is now **one** instrument: a single panel divided by hairlines into five
 * columns, so the five jobs read as stages of one capability set rather than five
 * products. Each column keeps its accent as a rule above its name instead of as a
 * border around a box, which is what recovers the horizontal room the items
 * needed.
 *
 * The group order carries meaning — it follows the same path the hero diagram
 * draws (a customer is captured, transacts, is operated on, is connected out, and
 * the system is extended) — so the columns are numbered.
 *
 * Copy is the deck's, verbatim: same five groups, same items, same notes.
 */
export function CapabilitiesSection() {
  const { eyebrow, h2, lead, groups, aiLinkContext, aiLinkLabel, aiLinkRoute } =
    WEB_DEVELOPMENT_CAPABILITIES;

  return (
    <section id="capabilities" className={`${RHYTHM_MOVEMENT} scroll-mt-24 bg-background-subtle`}>
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

        <ScrollReveal delay={0.06}>
          <div className="mt-14 overflow-hidden rounded-2xl border border-border-subtle bg-card">
            <div className="grid divide-y divide-border-subtle lg:grid-cols-5 lg:divide-x lg:divide-y-0">
              {groups.map((group, i) => {
                const accentKey = CAPABILITY_GROUP_ACCENT[group.id] ?? "blue";
                const accent = SYSTEM_TONE[accentKey];

                return (
                  <div key={group.id} className="flex flex-col p-5 sm:p-6">
                    {/* The accent is a rule above the name rather than a border
                        around a box — same colour coding, none of the containment. */}
                    <span
                      aria-hidden
                      className="mb-4 block h-0.5 w-8 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    <h3 className="flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.12em]">
                      <span
                        aria-hidden
                        className="text-[0.625rem] font-medium tabular-nums"
                        style={{ color: alpha(accent, 0.65) }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ color: accent }}>{group.title}</span>
                    </h3>

                    <ul className="mt-4 flex-1 space-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="text-[0.8125rem] leading-snug text-foreground/80 sm:text-sm"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>

                    {group.note ? (
                      <p className="mt-5 border-t border-border-subtle pt-3 text-xs leading-relaxed text-text-disabled">
                        {group.note}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ── ONE CONTEXTUAL HAND-OFF ─────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <p className="mt-8 max-w-2xl border-l-2 border-accent-violet/40 pl-5 text-sm leading-relaxed text-text-subtle">
            {aiLinkContext}{" "}
            <Link
              href={aiLinkRoute}
              className="group inline-flex items-center gap-1 font-semibold text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {aiLinkLabel}
              <ArrowRight
                aria-hidden
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            .
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
