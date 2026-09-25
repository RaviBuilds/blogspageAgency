import { BRAND_CHAPTER_ONE } from "@/lib/brand-story-data";
import { BRAND_TEXT_GRADIENT, TYPE_STATEMENT } from "@/lib/brand-type";

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
   - Left-aligned on a wide measure, against the page's dominant
     centered-`max-w-2xl` block. The manifesto should not look like the
     sections it precedes.
   - `TYPE_STATEMENT` appears exactly once here, and exactly once more in the
     FinalCTA. Those are the page's two raised-voice moments; the resolution
     line sits just below statement size on purpose, because it answers the
     question rather than competing with it.

   ## No motion, deliberately

   This sits directly below the hero, so it is on screen at first paint on most
   viewports — there is no scroll event to reveal it, and a fade here would
   only delay the page's first real sentence. Rendering it as a plain server
   component also keeps it out of the client bundle and makes its SSR
   visibility unconditional rather than dependent on a hydration gate.
   ───────────────────────────────────────────────────────────────────────── */

export function Manifesto() {
  return (
    <section className="bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <h2 className={TYPE_STATEMENT}>{BRAND_CHAPTER_ONE.question}</h2>

        <p className="mt-8 text-xl font-medium text-muted-foreground sm:text-2xl">
          {BRAND_CHAPTER_ONE.answer}
        </p>

        {/* The resolution. One meaningful phrase carries the brand sweep — the
            house rule everywhere on this page — and it is the whole line here
            because the whole line is the meaningful phrase. */}
        <p className="mt-10 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          <span style={BRAND_TEXT_GRADIENT}>
            {BRAND_CHAPTER_ONE.bridgeToBrand}
          </span>
        </p>
      </div>
    </section>
  );
}
