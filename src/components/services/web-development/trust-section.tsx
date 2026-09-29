import { WEB_DEVELOPMENT_TRUST, WEB_DEVELOPMENT_STACK } from "@/lib/web-development-data";
import { TRUST_PILLAR_ACCENT, SYSTEM_TONE, alpha } from "@/lib/web-development-visual-system";
import { TENANTS } from "@/lib/web-development-plain-language";
import { TYPE_MICRO } from "@/lib/brand-type";
import { SectionHeading } from "@/components/services/web-design/visuals/section-shell";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { RHYTHM_MOVEMENT } from "@/lib/section-rhythm";

import { MultiTenant } from "./visuals/multi-tenant";

/**
 * SECTION 07 — BUILT TO RUN, OWN & EVOLVE.
 *
 * Four pillars (Security & Access, Performance & Reliability, Ownership &
 * Handover, Post-Launch Evolution), the multi-tenant motif that the ownership and
 * evolution language connects back to, and the technology stack as a closing
 * strip — never a standalone showcase and never a logo wall (canonical spec §14).
 *
 * ## What the final pass changed
 *
 * The pillars were four bordered cards inside a grid inside a section, and the
 * stack was nine columns of names joined by middots at two different column
 * counts. Both are now open blocks on the section's own surface with an accent
 * rule above each label: the same information, one fewer container, and the
 * pillar text gets the measure it needs.
 *
 * The stack strip is explicitly framed as a toolbox by the deck's own lead ("Not
 * every technology is used on every project"), which is kept adjacent to the
 * names rather than left at the top of the section where it could be skipped.
 *
 * Copy is the deck's, verbatim — no certification, no compliance claim, no uptime
 * figure, no guarantee. Ownership language stays conditional on the engagement,
 * exactly as written.
 */
export function TrustSection() {
  const { eyebrow, h2, lead, pillars } = WEB_DEVELOPMENT_TRUST;
  const stack = WEB_DEVELOPMENT_STACK;

  return (
    <section id="ownership" className={`${RHYTHM_MOVEMENT} scroll-mt-24 bg-background`}>
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
          {/* ── THE FOUR PILLARS ─────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {pillars.map((pillar, i) => {
                const accentKey = TRUST_PILLAR_ACCENT[pillar.id] ?? "blue";
                const accent = SYSTEM_TONE[accentKey];

                return (
                  <ScrollReveal key={pillar.id} delay={i * 0.05}>
                    <div>
                      <span
                        aria-hidden
                        className="block h-0.5 w-8 rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                      <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground sm:text-lg">
                        {pillar.title}
                      </h3>
                      <ul className="mt-3.5 flex flex-col divide-y divide-border-subtle border-t border-border-subtle">
                        {pillar.items.map((item) => (
                          <li
                            key={item}
                            className="py-2 text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* ── ONE PLATFORM, MULTIPLE BUSINESSES ────────────────────────── */}
          <ScrollReveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-2xl border border-border-subtle bg-card/50 p-6">
              <p className={`${TYPE_MICRO} text-text-disabled`}>
                One platform, multiple businesses
              </p>
              <div className="mt-6">
                <MultiTenant
                  platformLabel="Shared Platform"
                  tenants={TENANTS}
                  accent={SYSTEM_TONE.violet}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── THE STACK ─────────────────────────────────────────────────────
            A supporting strip, deliberately the quietest block in the section:
            small labels, no logos, no icons, and the "not every project uses
            every technology" framing kept beside the names. */}
        <ScrollReveal delay={0.12}>
          <div className="mt-20 border-t border-border-subtle pt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
              <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {stack.h2}
              </h3>
              <p className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                {stack.lead}
              </p>
            </div>

            <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {stack.groups.map((group) => {
                return (
                  <div key={group.id} className="border-t border-border-subtle pt-3">
                    <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-text-disabled">
                      {group.title}
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border px-2 py-0.5 text-xs font-medium text-foreground/75"
                          style={{
                            borderColor: alpha(SYSTEM_TONE.blue, 0.16),
                            backgroundColor: alpha(SYSTEM_TONE.blue, 0.04),
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
