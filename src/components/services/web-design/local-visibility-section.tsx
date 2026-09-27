import { WEB_DESIGN_LOCAL_VISIBILITY } from "@/lib/web-design-data";
import { ScrollReveal } from "@/components/home/scroll-reveal";

import { LocalEcosystem } from "./visuals/local-ecosystem";
import { ScopeNote, SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 6 — LOCAL VISIBILITY FOUNDATION (10%, part A).

   ## What changed and why

   Four narrow cards and a tinted alert box — the same shape as the branding
   section directly above it, so two consecutive sections about two unrelated
   subjects were visually identical.

   It is now an ecosystem: the business → website → Google → local discovery →
   customer chain, drawn once, with the two artefacts the setup produces (the
   website's own NAP block, and the local result it resolves to) beneath it. The
   four setup items then read as the work that makes the chain connect, set as an
   indexed list on a hairline rather than as four containers.

   ## Keeping this out of SEO-service territory

   Deliberately restrained: no ranking graphs, no position numbers, no upward
   arrows, nothing that implies an ongoing ranking outcome. The artwork shows a
   *configured* local presence, which is exactly the scope the copy claims, and the
   boundary note stating what is not included is verbatim from the deck and given
   its own space rather than buried in a tinted box.
   ──────────────────────────────────────────────────────────────────────────── */

export function LocalVisibilitySection() {
  const { eyebrow, h2, lead, items, boundaryNote } = WEB_DESIGN_LOCAL_VISIBILITY;

  return (
    <section className="relative overflow-hidden border-t border-border-subtle bg-background-subtle/60 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="section"
            accent="cyan"
            measure="max-w-2xl"
          />
        </ScrollReveal>

        {/* ── THE DIAGRAM ──────────────────────────────────────────────── */}
        <ScrollReveal delay={0.08}>
          <div className="mt-16 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10">
            <LocalEcosystem />
          </div>
        </ScrollReveal>

        {/* ── THE SETUP ────────────────────────────────────────────────────
            Four entries on a shared hairline. On `lg` they run as a four-column
            index, which keeps them subordinate to the diagram above — this is the
            10% pillar and it should not out-weigh the 70%. */}
        <div className="mt-16 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.05}>
              <article className="border-t border-border py-7">
                <span
                  aria-hidden
                  className="font-mono text-xs text-accent-cyan"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.06}>
          <ScopeNote
            title={boundaryNote.title}
            accent="cyan"
            className="mt-12 max-w-3xl"
          >
            {boundaryNote.text}
          </ScopeNote>
        </ScrollReveal>
      </div>
    </section>
  );
}
