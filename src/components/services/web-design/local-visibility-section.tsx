import { WEB_DESIGN_LOCAL_VISIBILITY } from "@/lib/web-design-data";
import { LOCAL_PLAIN, NAP_FAN } from "@/lib/web-design-plain-language";
import { PILLAR_TONE } from "@/lib/web-design-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";

import { ExplainerChain } from "./visuals/explainer-chain";
import { LocalEcosystem, NapConsistency } from "./visuals/local-ecosystem";
import { ScopeNote, SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 6 — LOCAL VISIBILITY FOUNDATION (10%, part A).

   ## What changed and why

   Four narrow cards and a tinted alert box — the same shape as the branding
   section directly above it, so two consecutive sections about two unrelated
   subjects were visually identical.

   It is now an ecosystem: the business → website → Google → Maps → customer
   chain, drawn once, with the two artefacts the setup produces (the website's own
   NAP block, and the local result it resolves to) beneath it. The four setup items
   then read as the work that makes the chain connect, set as an indexed list on a
   hairline rather than as four containers.

   ## FINAL PASS — the section with the largest comprehension gap

   This section's copy is accurate and almost entirely unreadable to its audience.
   "NAP consistency", "indexation", "structured schema markup", "property
   ownership verification" — a dentist has no way in. The rebuild had given the
   section a good *shape* and left the vocabulary problem untouched.

   Three changes, all additive:

   1. **The chain became the explanation, not decoration.** It is real text in a
      real ordered list now (see `local-ecosystem.tsx` for why the previous
      `aria-hidden` treatment was the wrong call for this section specifically),
      with the technical name for each link kept as a subordinate annotation.

   2. **NAP consistency got its own diagram.** It is the section's most opaque
      phrase and the concept is a *shape* — the same three facts arriving at every
      destination unchanged — which a linear chain cannot state. It is drawn as a
      fan, and the diagram closes on the one line that explains it: "the same
      information everywhere".

   3. **Each setup item leads with what it is.** The plain-language name from
      `web-design-plain-language.ts` is the heading's dominant line; the deck's
      approved title stays inside the same `<h3>` beneath it, so the outline and
      the search phrases it carries are unchanged. `detail` — one ordinary
      sentence — sits above the deck's own description, which is also unchanged.

   Two of the four items also carry a chain of their own: the Google Business
   Profile item shows business → Search → Maps → customer, because "local pack
   visibility" is meaningless and the sequence is not.

   ## Keeping this out of SEO-service territory

   Deliberately restrained: no ranking graphs, no position numbers, no upward
   arrows, nothing that implies an ongoing ranking outcome. The boundary note
   stating what is not included is verbatim from the deck and given its own space
   rather than buried in a tinted box.
   ──────────────────────────────────────────────────────────────────────────── */

const CYAN = PILLAR_TONE.cyan;

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
            <p className={`${TYPE_MICRO} text-text-disabled`}>
              How a nearby customer actually finds you
            </p>
            <div className="mt-6">
              <LocalEcosystem />
            </div>
          </div>
        </ScrollReveal>

        {/* ── THE SETUP ────────────────────────────────────────────────────
            Two columns rather than four. At a quarter of the container the
            plain-language line and the deck's title could not both be set
            legibly, and the plain-language line is the reason this section was
            rebuilt — so the column count gave way, not the explanation. The
            entries stay on a shared hairline with no card surface, which keeps
            them subordinate to the diagram above: this is the 10% pillar and it
            must not out-weigh the 70%. */}
        <div className="mt-16 grid gap-x-12 lg:grid-cols-2">
          {items.map((item, index) => {
            const plain = LOCAL_PLAIN[item.id];

            return (
              <ScrollReveal key={item.id} delay={(index % 2) * 0.05}>
                <article className="border-t border-border py-8">
                  <span aria-hidden className="font-mono text-xs text-accent-cyan">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* DUAL-LAYER HEADING. Plain language dominant, the deck's
                      approved title inside the same heading element. */}
                  <h3 className="mt-3.5">
                    <span className="block text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
                      {plain?.plain ?? item.title}
                    </span>
                    {plain ? (
                      <span
                        className={`${TYPE_MICRO} mt-2.5 block text-text-disabled`}
                      >
                        {item.title}
                      </span>
                    ) : null}
                  </h3>

                  {plain?.detail ? (
                    <p className="mt-3.5 max-w-[52ch] text-sm leading-[1.7] text-foreground/75">
                      {plain.detail}
                    </p>
                  ) : null}

                  <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  {/* The item's own relationship, where it has one. */}
                  {plain?.chain ? (
                    <ExplainerChain
                      steps={plain.chain}
                      accent={CYAN}
                      className="mt-5"
                    />
                  ) : null}
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ── NAP CONSISTENCY ──────────────────────────────────────────────
            Given its own panel because it is the one idea in this section that a
            sentence cannot deliver. */}
        <ScrollReveal delay={0.06}>
          <div className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <p className={`${TYPE_MICRO} text-accent-cyan`}>
                  {NAP_FAN.label}
                </p>
                <p className="mt-5 max-w-[42ch] text-base leading-[1.7] text-foreground/80 sm:text-lg">
                  {NAP_FAN.rationale}
                </p>
              </div>
              <div className="mt-9 lg:col-span-7 lg:mt-0">
                <NapConsistency />
              </div>
            </div>
          </div>
        </ScrollReveal>

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
