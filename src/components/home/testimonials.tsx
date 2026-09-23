import { Check, Star } from "lucide-react";

import { TESTIMONIALS, type Testimonial } from "@/lib/testimonials-data";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 5 — Trust: genuine reviews (Blueprint §16, §40)

   Data-gated social proof: this section renders NOTHING while
   `testimonials-data.ts` ships empty, and it cannot render placeholder or
   invented content — the array is the only source.

   NO Review / AggregateRating structured data is derived here. Review schema
   requires a separate validated SEO plan (search-visibility blueprint §17).
   ───────────────────────────────────────────────────────────────────────────── */

function Stars({ rating }: { rating: Testimonial["rating"] }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "size-4 fill-amber-400 text-amber-400"
              : "size-4 text-border-strong"
          }
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Real feedback</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            What clients say.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Unedited reviews from the business owners we&apos;ve worked with.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <Stars rating={testimonial.rating} />
                <span className="text-xs text-muted-foreground">
                  Posted on Google
                </span>
              </div>

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                “{testimonial.quote}”
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border-subtle pt-4">
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-foreground"
                >
                  {testimonial.authorInitials}
                </span>
                <span className="text-sm">
                  <span className="block font-medium text-foreground">
                    {testimonial.authorName}
                  </span>
                  {testimonial.dateLabel ? (
                    <span className="block text-xs text-muted-foreground">
                      {testimonial.dateLabel}
                    </span>
                  ) : null}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Check className="size-3.5 text-primary" />
          Reviews are shown exactly as published on the Blogspage Google
          Business Profile.
        </p>
      </div>
    </section>
  );
}
