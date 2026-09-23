import { ArrowRight, Star } from "lucide-react";

import { ScrollReveal } from "@/components/home/scroll-reveal";
import { AmbientFade, ReviewStars } from "@/components/home/review-stars";
import { TESTIMONIALS, type Testimonial } from "@/lib/testimonials-data";

import ambient from "./testimonials-ambient.module.css";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 5 — Trust: the evidence shelf (Blueprint §16, §40)

   Re-art-directed social proof: genuine Google reviews presented as faithful
   Google-native surfaces inside a Blogspage AI editorial environment — a left
   provenance column (the argument) and a right evidence column (the reviews).

   The reviews are the hero: only the *customer's* published words render. The
   owner's own replies are deliberately NOT shown — the cards read as authentic
   reproductions of what real reviewers published on the profile.

   Data-gated social proof: this section renders NOTHING while
   `testimonials-data.ts` ships an empty array, and it cannot render
   placeholder or invented content — the array is the only source.

   Review text is rendered verbatim; `whitespace-pre-line` preserves the
   reviewer's own line breaks and no other formatting is applied.

   Google provenance is communicated visually — the official "G" mark as a
   single strategic source cue, Google's metadata hierarchy (avatar, name,
   stars, relative date) and Google-yellow stars — without cloning Google's
   interface and without any live-API, sync or verification claim (the data
   is static, owner-supplied).

   NO counts, averages or review totals are rendered, and NO Review /
   AggregateRating structured data is derived here. Review schema requires a
   separate validated SEO plan (search-visibility blueprint §17).
   ───────────────────────────────────────────────────────────────────────────── */

/** The approved brand text sweep, identical to the other homepage sections. */
const BRAND_TEXT_GRADIENT = {
  backgroundImage:
    "linear-gradient(90deg, #0891B2 0%, #4353C9 52%, #7C3AED 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

/* Google's brand hues, used sparingly as provenance cues on the evidence
   shelf. Restrained — the customer's own words stay the focal point. */
const GOOGLE_BLUE = "#4285F4";
const GOOGLE_GREEN = "#34A853";

/** Google's link blue — darkened for AA contrast on the white CTA surface. */
const GOOGLE_LINK_BLUE = "#1a73e8";

/** The Google Business Profile review surface this section points at. */
const GOOGLE_REVIEWS_URL = "https://share.google/rZkl9ylSYHIUOAe6d";

/** The official Google "G" mark — a 16px-grid source cue, not a logo lockup. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.204c0-.638-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.7-1.567 2.684-3.875 2.684-6.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.336A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71a5.41 5.41 0 0 1 0-3.42V4.955H.957a8.997 8.997 0 0 0 0 8.09l3.007-2.335z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.5.455 3.435 1.35l2.568-2.569C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.955L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
/**
 * The conceptual background: a faint "local-business reputation map". Thin
 * route lines (Google-Maps contour feel) thread across the section with a few
 * location pins and tiny five-star rating nodes. Purely decorative, strictly
 * subordinate to the reviews, and hidden below `md` where it would clutter.
 */
function RouteAtmosphere({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 900" fill="none" className={className} aria-hidden>
      {/* Route lines */}
      <path
        d="M80 760 C 320 720, 520 640, 720 560 S 1160 460, 1380 520"
        stroke={GOOGLE_BLUE}
        strokeOpacity="0.05"
        strokeWidth="1.5"
      />
      <path
        d="M60 620 C 300 560, 560 500, 820 470 S 1240 380, 1420 340"
        stroke={GOOGLE_GREEN}
        strokeOpacity="0.04"
        strokeWidth="1.5"
        strokeDasharray="3 7"
      />
      <path
        d="M140 840 C 420 800, 720 760, 1000 700 S 1320 600, 1420 560"
        stroke="#EA4335"
        strokeOpacity="0.045"
        strokeWidth="1.5"
        strokeDasharray="2 6"
      />
      {/* Location pins */}
      <circle cx="720" cy="560" r="4" fill="#EA4335" fillOpacity="0.12" />
      <circle cx="820" cy="470" r="3" fill={GOOGLE_BLUE} fillOpacity="0.12" />
      {/* A tiny five-star rating node */}
      <g transform="translate(1000 700)" fill="#FBBC05" fillOpacity="0.14">
        <polygon points="0,-5 1.5,-1.5 5,-1.5 2,1 3,5 0,3 -3,5 -2,1 -5,-1.5 -1.5,-1.5" />
      </g>
    </svg>
  );
}


/**
 * One review — a faithful Google-native surface: source cue ("G" + label) at
 * the top, the reviewer hierarchy (avatar, name, stars, relative date), then
 * the verbatim text as the focal point — nothing else. The owner's published
 * reply is deliberately omitted so the card reads as an authentic reproduction
 * of what the reviewer published: only the *customer's* words are showcased.
 *
 * The two cards sit in a deliberate editorial stack: the first is pulled
 * slightly left (~20px) and the second slightly right, so the evidence is
 * composed like art-directed quotes rather than an evenly spaced grid. The
 * lateral entrance (x) is tiny and settles to 0 under reduced motion.
 */
function ReviewCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <ScrollReveal
      delay={0.3 + index * 0.14}
      x={index === 0 ? -14 : 14}
      className={`h-full ${index === 0 ? "lg:-ml-5" : "lg:ml-5"}`}
    >
      <figure className="flex h-full flex-col rounded-xl border border-border-subtle bg-white p-5 shadow-[0_1px_3px_rgba(14,21,36,0.08)] sm:p-6">
        {/* Source attribution — the "G" mark and the source label. */}
        <figcaption className="flex items-center gap-1.5">
          <GoogleG className="size-4" />
          <span
            className="text-xs font-medium tracking-wide"
            style={{ color: GOOGLE_BLUE }}
          >
            Google review
          </span>
        </figcaption>

        {/* Reviewer metadata — Google's hierarchy: avatar, name, then the
            stars and the relative date beneath the name. */}
        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-foreground"
          >
            {testimonial.authorInitials}
          </span>
          <span className="text-sm leading-tight">
            <span className="block font-medium text-foreground">
              {testimonial.authorName}
            </span>
            <span className="mt-1 flex items-center gap-2">
              <ReviewStars rating={testimonial.rating} />
              {testimonial.dateLabel ? (
                <span className="text-xs text-muted-foreground">
                  · {testimonial.dateLabel}
                </span>
              ) : null}
            </span>
          </span>
        </div>

        <div aria-hidden className="mt-4 border-t border-border-subtle" />

        <blockquote className="mt-4 flex-1 text-[15px] leading-[1.7] whitespace-pre-line text-foreground">
          {testimonial.quote}
        </blockquote>
      </figure>
    </ScrollReveal>
  );
}

export function Testimonials() {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-24 lg:py-32">
      {/* Atmosphere — a quiet "local-business reputation map": two faint
          breathing glows (Google blue / green), the single signature ghost-"G"
          clipped by the right edge, faint route lines with location-pin and
          star-rating nodes, one restrained four-brand-hue hairline, and the
          dot-grid grain. Every layer is ≤0.08 alpha, strictly behind the
          evidence, and revealed first via AmbientFade. */}
      <AmbientFade className="pointer-events-none absolute inset-0">
        <div aria-hidden className="absolute inset-0">
          <div
            className={`absolute -left-44 -top-32 size-[34rem] rounded-full ${ambient.breatheA}`}
            style={{
              background:
                "radial-gradient(circle, rgba(66,133,244,0.045), transparent 65%)",
            }}
          />
          <div
            className={`absolute -bottom-40 -right-48 size-[38rem] rounded-full ${ambient.breatheB}`}
            style={{
              background:
                "radial-gradient(circle, rgba(52,168,83,0.04), transparent 65%)",
            }}
          />
          {/* The single ghost-"G" — one signature motif, partially clipped by
              the section's right edge, at very low opacity. */}
          <GoogleG
            className={`absolute -right-24 top-10 size-[19rem] opacity-[0.05] ${ambient.ghostBreathe} sm:size-[26rem] lg:size-[30rem]`}
          />
          {/* One restrained four-brand-hue hairline near the top. */}
          <div
            className="absolute left-0 top-24 hidden h-px w-44 lg:block"
            style={{
              background:
                "linear-gradient(90deg,#4285F4,#EA4335,#FBBC05,#34A853)",
              opacity: 0.16,
            }}
          />
          {/* Route map — hidden on small screens to avoid clutter. */}
          <RouteAtmosphere className="absolute inset-0 hidden md:block" />
          <div className={`absolute inset-0 ${ambient.gridTexture}`} />
        </div>
      </AmbientFade>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-0">
          {/* Left column — the argument, read top-to-bottom as
              heading → proof → provenance, threaded by a quiet rail so no
              stretch of the column reads as empty. */}
          <div className="flex flex-col lg:pr-16">
            <div className="relative flex flex-col lg:flex-1 lg:justify-between lg:pl-8">
              {/* Provenance rail — a hairline that connects the three blocks,
                  with two tiny Google-yellow star nodes in the gaps. Pure
                  decoration. */}
              <span
                aria-hidden
                className="absolute bottom-4 left-0 top-5 hidden w-px bg-border lg:block"
              />
              <Star
                aria-hidden
                className="absolute left-[-3.5px] top-[46%] hidden size-1.5 fill-[#FBBC05] text-[#FBBC05] lg:block"
              />
              <Star
                aria-hidden
                className="absolute left-[-3.5px] top-[86%] hidden size-1.5 fill-[#FBBC05] text-[#FBBC05] lg:block"
              />

              <ScrollReveal delay={0.05}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Proof, not promises
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  5-star work gets{" "}
                  <span style={BRAND_TEXT_GRADIENT}>remembered</span>.
                </h2>
                <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                  Real words from the businesses that trusted Blogspage AI with
                  their work.
                </p>
              </ScrollReveal>

              {/* Proof — the rating at a glance, framed as a compact verified
                  chip (white surface, thin border — visibly a source note, not
                  a testimonial card). */}
              <ScrollReveal delay={0.22} className="mt-10 lg:mt-0">
                <div className="inline-flex flex-col gap-2 rounded-xl border border-border-subtle bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <ReviewStars rating={5} />
                    <span className="text-sm font-semibold text-foreground">
                      Verified on Google
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    5-star client feedback from real businesses.
                  </p>
                </div>
              </ScrollReveal>

              {/* Provenance — the source attestation, anchored beneath the
                  proof as a restrained citation note (left Google-blue rule,
                  small G cue) with the external Google link as its action. */}
              <ScrollReveal delay={0.58} className="mt-10 lg:mt-0">
                <div className="border-l-2 border-l-[#4285F4] bg-card px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <GoogleG className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                      Source · Google
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-foreground">
                    Blogspage Google Business Profile
                  </p>
                  <div className="mt-2 space-y-0.5 text-sm leading-relaxed text-muted-foreground">
                    <p>Unedited.</p>
                    <p>Unfiltered.</p>
                    <p>Exactly as published.</p>
                  </div>
                  <a
                    href={GOOGLE_REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2"
                    style={{ color: GOOGLE_LINK_BLUE }}
                  >
                    View all Google reviews
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right column — the evidence. */}
          <div className="flex flex-col gap-5 lg:gap-6 lg:pl-16">
            {TESTIMONIALS.map((testimonial, index) => (
              <ReviewCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
