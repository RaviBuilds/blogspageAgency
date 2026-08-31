import { Sparkles } from "lucide-react";
import {
  HeroCtas,
  HeroGradients,
  HeroProofStrip,
} from "@/components/home/hero-ambient";
import { HeroSystemVisual } from "@/components/home/hero-system";

const HEADLINE_LINES = [
  "We Engineer the Digital Systems",
  "Behind Your Business.",
];

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
 */
function KineticHeadline({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  let wordIndex = 0;

  return (
    <>
      {lines.map((line, lineIdx) => (
        <span
          key={lineIdx}
          className={`block overflow-hidden pb-3 ${lineIdx > 0 ? "mt-2" : ""} ${className ?? ""}`}
        >
          {line.split(" ").map((word, i, arr) => {
            const index = wordIndex;
            wordIndex += 1;
            return (
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
                {i < arr.length - 1 ? "\u00A0" : null}
              </span>
            );
          })}
        </span>
      ))}
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
      */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/4 px-4 py-1.5 text-xs text-muted-foreground shadow-2xl shadow-indigo-500/10 backdrop-blur lg:mb-8">
              <Sparkles className="size-3.5 text-primary" />
              Hyderabad-based digital systems and product engineering
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
            */}
            <h1
              className="text-[clamp(2.75rem,6.2vw,5.75rem)] font-semibold leading-[0.88] tracking-tighter text-balance"
              style={
                { opacity: 1, "--word-step": "60ms" } as React.CSSProperties
              }
            >
              <KineticHeadline
                lines={HEADLINE_LINES}
                className="last:text-gradient"
              />
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Websites, web apps, SaaS and AI-powered automation built around
              how your business actually works — not another disconnected
              collection of tools.
            </p>

            <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
              Websites · Software · AI · Automation
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
            <div className="mt-12 w-full lg:hidden">
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
    </section>
  );
}
