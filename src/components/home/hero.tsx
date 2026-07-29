import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroGradients, HeroTrustStrip } from "@/components/home/hero-ambient";

const HEADLINE_LINES = ["We Build AI Systems That", "Sell While You Sleep."];

/**
 * Renders a headline as plain server-rendered text, one `<span>` per word.
 * Each word carries a `--word-index` custom property (a single increasing
 * index across all lines, so the CSS stagger in `globals.css` reads
 * top-to-bottom, left-to-right, matching the original Framer Motion
 * `staggerChildren` order) and the `hero-word` class that drives the reveal
 * keyframe. No client-side JS is required for the text to be visible: the
 * `<h1>` is at `opacity: 1` in the server-rendered HTML (Requirement 11.1),
 * and the CSS animation is purely a visual enhancement on top of that.
 */
function KineticHeadline({ lines, className }: { lines: string[]; className?: string }) {
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

      {/* Decorative hero visual — abstract AI-system render, anchored to the
          right rail beside the headline with a slight bleed off the edge.
          The asset is pre-trimmed to its artwork bounds (769x558) by
          `scripts/trim-hero-visual.mjs`, so the container mirrors that aspect
          ratio and the render fills its box exactly instead of floating inside
          a letterboxed square. The radial mask feathers every edge so it reads
          as ambient light rather than a pasted rectangle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-14 -z-10 hidden aspect-[769/558] w-[34rem] opacity-60 mix-blend-lighten [mask-image:radial-gradient(ellipse_at_center,black_52%,transparent_82%)] lg:block xl:top-16 xl:w-[44rem] 2xl:w-[52rem]"
      >
        <Image
          src="/hero-visual.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1536px) 832px, (min-width: 1280px) 704px, 544px"
          className="object-contain"
        />
      </div>

      {/* Extreme negative space + structural asymmetry (§1). */}
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-32 lg:px-8 lg:pb-48 lg:pt-44">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-11 lg:col-start-1">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/4 px-4 py-1.5 text-xs text-muted-foreground shadow-2xl shadow-indigo-500/10 backdrop-blur">
              <Sparkles className="size-3.5 text-primary" />
              AI automation & product engineering for category-defining founders
            </div>

            <h1
              className="max-w-5xl text-5xl font-semibold leading-[0.85] tracking-tighter text-balance sm:text-7xl lg:text-[7.5rem]"
              style={{ opacity: 1 }}
            >
              <KineticHeadline lines={HEADLINE_LINES} className="last:text-gradient" />
            </h1>
          </div>

          {/* Asymmetric body block, offset right into the grid. */}
          <div className="lg:col-span-6 lg:col-start-6">
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Blogspage is an AI agency that designs, builds, and ships
              production-grade AI sales agents, workflow automation, and
              custom SaaS platforms for founders who need revenue-generating
              systems live in days, not quarters, engineering every launch on
              Next.js and Supabase within a focused ten to fifteen day
              sprint, then keeping it running long after deployment.
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Button
                size="lg"
                className="glow-border h-11 bg-white px-6 text-black hover:bg-white/90"
                asChild
              >
                <Link href="#contact">
                  Deploy your AI system
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-white/[0.08] bg-white/2 px-6 hover:bg-white/6"
                asChild
              >
                <Link href="#models">See what we automate</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust strip — client-animated scroll reveal. */}
        <HeroTrustStrip />
      </div>
    </section>
  );
}
