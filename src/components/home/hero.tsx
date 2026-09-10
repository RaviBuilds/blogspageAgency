import {
  HeroConnector,
  HeroCtas,
  HeroGradients,
  HeroProofStrip,
} from "@/components/home/hero-ambient";
import { HeroSystemVisual } from "@/components/home/hero-system";
import { HERO } from "@/lib/homepage-data";

const HEADLINE_LINES = HERO.headlineLines;

/**
 * R2.1 brand expression: the meaningful tail of the H1 — "find, trust and
 * use." — carries the approved dark-signal triad (cyan → blue → violet) as
 * one continuous `background-clip: text` sweep. Declared inline rather than
 * via `.text-gradient` because the hero island's locked override in
 * `globals.css` (outside this phase's scope) pins that class to the legacy
 * near-white gradient — exactly the "white H1" problem this phase corrects.
 *
 * The triad is the same one the eyebrow dot, the system packets and the
 * connector speak, so the typography and the visual read as one system.
 * Static by design — never animated, never hue-shifting.
 */
const BRAND_PHRASE_GRADIENT: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(94deg, #67E8F9 0%, #828FFF 48%, #A78BFA 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

/** First word of the brand phrase, resolved against the real word order. */
const BRAND_PHRASE_FIRST_WORD = "find,";

const BRAND_PHRASE_FROM_WORD = HEADLINE_LINES
  .flatMap((line) => line.split(" "))
  .indexOf(BRAND_PHRASE_FIRST_WORD);

/**
 * Words the supporting copy quietly emphasizes. Weight only — the emphasis
 * lifts them from `--muted-foreground` to `--foreground` without introducing
 * a second colour into the body text.
 */
const SUBCOPY_EMPHASIS = new Set([
  "brand",
  "website",
  "business software",
  "AI automation",
]);

const SUBCOPY_SPLIT = /(brand|website|business software|AI automation)/g;

/**
 * Renders a headline as plain server-rendered text, one `<span>` per word.
 * Each word carries a `--word-index` custom property (a single increasing
 * index across all lines, so the CSS stagger in `globals.css` reads
 * top-to-bottom, left-to-right, matching the original Framer Motion
 * `staggerChildren` order) and the `hero-word` class that drives the reveal
 * keyframe. No client-side JS is required for the text to be visible: every
 * word is a real, non-empty text node in the server-rendered HTML — the
 * `<h1>` element itself renders at `opacity: 1` (Requirement 11.1); only the
 * individual `.hero-word` spans animate in from `opacity: 0` via the CSS
 * keyframe in `globals.css`, which is a purely visual enhancement layered on
 * top of already-crawlable, already-readable text.
 *
 * R2.1: words from `brandFromWord` (global index) to the end of their line
 * render inside one gradient wrapper, so the brand phrase reads as a single
 * continuous sweep — never a gradient per word. The mechanism is the same
 * one the line-level gradient used (background-clip: text over the same
 * nested word spans), only scoped to the phrase.
 */
function KineticHeadline({
  lines,
  className,
  brandFromWord,
}: {
  lines: readonly string[];
  className?: string;
  brandFromWord?: number;
}) {
  let wordIndex = 0;

  return (
    <>
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        const lineBase = wordIndex;
        wordIndex += words.length;

        // Where the brand phrase starts within this line. The phrase always
        // runs to the end of the line, so one split decides the grouping.
        const brandAt =
          brandFromWord === undefined ? -1 : brandFromWord - lineBase;

        const renderWord = (word: string, index: number, i: number) => (
          <span
            key={`${word}-${lineIdx}-${i}`}
            className="inline-block align-bottom"
            style={{ perspective: "1000px" }}
          >
            <span
              className="hero-word inline-block origin-bottom will-change-transform"
              style={{ "--word-index": index } as React.CSSProperties}
            >
              {word}
            </span>
            {i < words.length - 1 ? "\u00A0" : null}
          </span>
        );

        const lineClass = `block overflow-hidden pb-3 ${lineIdx > 0 ? "mt-2" : ""} ${className ?? ""}`;

        if (brandAt <= 0 || brandAt >= words.length) {
          return (
            <span key={lineIdx} className={lineClass}>
              {words.map((word, i) => renderWord(word, lineBase + i, i))}
            </span>
          );
        }

        return (
          <span key={lineIdx} className={lineClass}>
            {words.slice(0, brandAt).map((word, i) =>
              renderWord(word, lineBase + i, i)
            )}
            <span style={BRAND_PHRASE_GRADIENT}>
              {words.slice(brandAt).map((word, i) =>
                renderWord(word, lineBase + brandAt + i, brandAt + i)
              )}
            </span>
          </span>
        );
      })}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Ambient gradient blobs — client-animated, purely decorative. */}
      <HeroGradients />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(9,9,11,0.15),#09090b_78%)]" />

      {/*
        Hero V2 vertical budget.

        V1 opened with `lg:pt-44` (176px) beneath a 72px floating navbar — over
        100px of empty space before the eyebrow — and closed with `lg:pb-48`. That
        padding, plus a headline in its own full-width grid row, pushed the system
        visual into row two and therefore below the fold: the animation could only
        be discovered by scrolling, which is the one thing an above-the-fold
        visual must not require. 128px top holds a deliberate 56px clearance under
        the navbar and buys back the ~110px the composition needed.

        R2.1 FINAL-POLISH: the bottom was the hero's one dead stretch — a wide
        black band between the proof strip and the seam. 96px (from 128px)
        tightens the lower rhythm so the connector thread lands nearer the proof
        strip and the seam reads as an authored hand-off, not an unfinished page.
        The hero still breathes; it just no longer trails off.
      */}
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-8 lg:pb-24 lg:pt-32">
        {/*
          One grid row, two cells — not two rows.

          This is the whole recomposition. Previously the H1 spanned columns 1–11
          of its own row and the visual lived in the row beneath it, so the visual
          started below the headline by construction and no amount of padding
          could lift it. Collapsing to a single row makes the message column and
          the system column siblings, which is what lets `lg:self-center` centre
          the visual against the *entire* text block rather than against whatever
          happened to be next to it.

          They remain sibling cells rather than overlapping layers on purpose: the
          visual's hover interaction needs real hit-testing, and anything sitting
          behind the copy either intercepts pointer events meant for the text or,
          if made inert, can never receive its own.
        */}
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          {/* Message column. */}
          <div className="lg:col-span-7 lg:col-start-1">
            {/*
              Eyebrow — business-first, one quiet brand signal.

              The generic Sparkles glyph is replaced by the canonical Blogspage
              signal dot (cyan → blue → violet): the same triad the system
              visual speaks, so the brand reads as one continuous idea from the
              first 12px of the page. The pill itself is calmed — hairline
              border, flatter fill, no drop shadow — so it frames the line
              instead of competing with the headline beneath it.
            */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-xs text-muted-foreground backdrop-blur lg:mb-8">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-[linear-gradient(135deg,#0891B2,#4353C9,#7C3AED)] shadow-[0_0_10px_rgba(130,143,255,0.55)]"
              />
              {HERO.eyebrow}
            </div>

            {/*
              `clamp()` rather than a `lg:text-[7.5rem]` step. V1's 120px was
              sized against an 11-column row and consumed most of the first
              viewport on its own; capped at 92px it is ~23% smaller and still
              comfortably the largest thing on the page, which is the point — the
              H1 stays the primary focal point and the system becomes the
              co-star, not the other way round. The middle term keeps the
              headline proportional between breakpoints instead of jumping at
              1024px, and the floor keeps it strong on a phone.

              Wording is unchanged, and no line breaks are forced: `text-balance`
              plus the column width decide where it wraps.

              R2.1 BRAND EXPRESSION: the meaningful phrase — "find, trust and
              use." — carries the approved cyan → blue → violet triad as one
              continuous background-clip sweep, declared inline because the
              island's locked `.text-gradient` override still points the class
              at the legacy near-white gradient. The rest of the H1 stays
              neutral `--foreground`: strong neutral base, one deliberate
              brand-emphasized phrase, same mechanism the line-level gradient
              already proved over these nested word spans.
            */}
            <h1
              className="text-[clamp(2.75rem,6.2vw,5.75rem)] font-semibold leading-[0.88] tracking-tighter text-balance"
              style={
                { opacity: 1, "--word-step": "60ms" } as React.CSSProperties
              }
            >
              <KineticHeadline
                lines={HEADLINE_LINES}
                brandFromWord={BRAND_PHRASE_FROM_WORD}
              />
            </h1>

            {/*
              R2.1: the supporting copy keeps its neutral body colour but the
              four build-capability words lift to full `--foreground` weight.
              Typography, not colour — the body introduces no second accent,
              so the phrase gradient in the H1 stays the composition's single
              typographic brand moment.
            */}
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {HERO.subcopy.split(SUBCOPY_SPLIT).map((part, i) =>
                SUBCOPY_EMPHASIS.has(part) ? (
                  <strong
                    key={`${part}-${i}`}
                    className="font-medium text-foreground"
                  >
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>

            {/*
              Capability line: one restrained accent only. The separators —
              not the capabilities — carry the signal blue, so the line stays
              a quiet index of what the business can ask for while picking up
              the same hue the system visual's business records speak.
            */}
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
              {HERO.capabilityLine.split(" · ").map((capability, i, all) => (
                <span key={capability}>
                  {capability}
                  {i < all.length - 1 ? (
                    <span aria-hidden className="text-[#828FFF]/70">
                      {" · "}
                    </span>
                  ) : null}
                </span>
              ))}
            </p>

            <HeroCtas />

            {/*
              Mobile system visual: a different graph, not a scaled one — three
              stacked surfaces, one packet, no parallax, no hover. It sits after
              the CTAs so it can never come between a phone visitor and the
              headline.

              Full column width, deliberately. A `max-w` cap here left the stack
              floating in a dead right-hand gutter, out of alignment with the
              paragraph and the CTA buttons directly above it. The mobile topology
              is authored flush (cards at x = 0) and short enough in aspect that
              spanning the column costs ~260px of height rather than 420, so the
              alignment comes for free instead of being traded against size.
            */}
            <div className="mx-auto mt-12 w-full lg:hidden">
              <HeroSystemVisual variant="mobile" />
            </div>
          </div>

          {/*
            System column — the Active Blueprint.

            Five of twelve columns plus a small `xl` bleed puts it at ~42% of the
            usable hero width, and `self-center` centres it on the message column
            instead of hanging off the bottom of it. It stays a decorative
            illustration of the copy beside it — `aria-hidden`, no focusable
            descendants — so nothing here is load-bearing for comprehension or
            for the keyboard.
          */}
          <div className="hidden lg:col-span-5 lg:col-start-8 lg:block lg:self-center xl:-mr-6">
            <HeroSystemVisual />
          </div>
        </div>

        {/* Proof strip — client-animated scroll reveal. */}
        <HeroProofStrip />
      </div>

      {/*
        Signature connector motif (creative blueprint §19): one quiet line
        leading the eye out of the hero into "Where are you right now?".
        Purely decorative; the matching stub lives in AudiencePathways.
      */}
      <HeroConnector />
    </section>
  );
}
