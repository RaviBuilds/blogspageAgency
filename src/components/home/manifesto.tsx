import { BRAND_CHAPTER_ONE } from "@/lib/brand-story-data";
import { BRAND_TEXT_GRADIENT, TYPE_DISPLAY } from "@/lib/brand-type";
import { RHYTHM_CHAPTER } from "@/lib/section-rhythm";
import { SectionSeam } from "@/components/home/section-seam";

/* ─────────────────────────────────────────────────────────────────────────────
   MANIFESTO — the page's belief, stated once, immediately after the hero.

   ## Why this beat exists

   The homepage went from the hero straight into wayfinding: "where are you
   right now?" — a useful question, but a question. The page asked the visitor
   to locate themselves before it had said anything it believes. Premium
   editorial pages state a position first and route second.

   ## Why there is no new copy here

   The belief was already written, buried three sections down as the opening of
   BrandStory chapter 1:

     "Did you start your business for two years?"
     "Of course not."
     "Then you're building a brand."

   That is a manifesto, and it was being rendered at section-heading size in
   the middle of a teaching movement. This component does not rewrite it — it
   reads the same `BRAND_CHAPTER_ONE` fields and gives them the room they were
   always asking for. The lines were removed from chapter 1 in the same change,
   so nothing is duplicated and nothing was invented (see `brand-story.tsx`).

   ## Composition rules

   - No eyebrow. A belief does not need a label announcing the category it
     belongs to, and the eyebrow had already lost its signal from overuse.
   - No cards, no diagram, no CTA. Nothing to click and nothing to scan: the
     only thing on this surface is the sentence.
   - Three beats that step ACROSS the field, not down a column: the question
     inset one column from the left, the answer hard against that same edge at a
     fraction of the size, the resolution pushed two columns right. The page's
     dominant composition is a centered `max-w-2xl` block; the manifesto is the
     one place that deliberately refuses it.
   - `TYPE_DISPLAY` appears exactly once here and exactly once more in the
     FinalCTA — the page's two bookends, and the only type on the page that
     approaches the hero's H1. The answer and the resolution both sit far below
     it, because the *drop* between the three beats is what gives the block its
     shape. Making all three large would flatten it again.

   ## Spacing

   `RHYTHM_CHAPTER`, one of three uses on the page. This is the moment the page
   stops presenting and states a position, which is exactly what the top of the
   spacing scale is for.

   ## Motion

   The copy itself has none, deliberately. This sits directly below the hero, so
   it is on screen at first paint on most viewports — there is no scroll event to
   reveal it, and a fade here would only delay the page's first real sentence.
   Every word is a plain server-rendered text node; nothing here ships at
   `opacity: 0` and nothing waits on hydration to become readable.

   The one client island is the decorative `SectionSeam` that dissolves the hero
   boundary. It carries no text, is `aria-hidden`, and renders nothing at all
   under reduced motion — so the component's SSR guarantee is unchanged.
   ───────────────────────────────────────────────────────────────────────── */

export function Manifesto() {
  return (
    <section className={`relative bg-background ${RHYTHM_CHAPTER}`}>
      {/* THE HERO HANDOFF.

          The hero used to simply stop: a dark island ended, a hairline-free
          light section began, and the page's first real sentence arrived with no
          transition authored between the two. The seam paints the island's own
          tone bleeding down into this surface and clears as the section rises,
          so leaving the hero reads as a dissolve rather than a cut. Decorative,
          behind content, and fully absent under reduced motion. */}
      <SectionSeam edge="top" neighbour="island" depth="lg" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Asymmetric on a 12-column field, against the page's dominant
            centered composition. The statement is inset from the left edge and
            stops well short of the right, so the whitespace around it is
            composed rather than residual. */}
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-11 lg:col-start-2">
            {/* The opening rule. A single hairline growing out of the accent,
                sized to the type it introduces — the page's quietest possible
                way of saying "this is where the argument starts". */}
            <span
              aria-hidden
              className="block h-px w-16 bg-gradient-to-r from-primary/70 to-transparent"
            />

            {/* DISPLAY tier — one of the page's two bookends. */}
            <h2 className={`mt-10 max-w-[18ch] ${TYPE_DISPLAY}`}>
              {BRAND_CHAPTER_ONE.question}
            </h2>

            {/* The answer, deliberately small and set hard against the left of
                the measure. Two words after a display-scale question do not need
                to be loud; the drop in scale *is* the beat. */}
            <p className="mt-12 text-2xl font-medium tracking-tight text-text-subtle sm:text-3xl">
              {BRAND_CHAPTER_ONE.answer}
            </p>

            {/* The resolution, offset into the right of the field so the three
                beats step across the page instead of stacking in one column.
                One meaningful phrase carries the brand sweep — the house rule
                everywhere on this page — and it is the whole line here because
                the whole line is the meaningful phrase. */}
            <div className="mt-16 lg:grid lg:grid-cols-11">
              <p className="lg:col-span-8 lg:col-start-3">
                <span
                  className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-balance"
                  style={BRAND_TEXT_GRADIENT}
                >
                  {BRAND_CHAPTER_ONE.bridgeToBrand}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
