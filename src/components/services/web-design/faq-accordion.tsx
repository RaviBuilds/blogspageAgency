import { ChevronDown } from "lucide-react";

import type { FaqPair } from "@/lib/structured-data";

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ ACCORDION.

   ## Two changes, both deliberate

   1. **No card inside a card.** It was a bordered, rounded `bg-card` container
      with `divide-y` rows inside, sitting inside a section — three nested
      surfaces for a list of ten questions. It is now a plain hairline-separated
      list on the section's own surface: the brief asks for this section to stay
      clean and integrated rather than designed, and a question does not need a
      container to be legible.

   2. **`<details>` instead of React state.** The previous accordion mounted each
      answer only while open, so ten answers — the page's densest body of
      commercially specific copy — existed nowhere in the served HTML. Native
      `<details>` ships every answer in the document, gives correct expanded-state
      semantics and keyboard behaviour for free, and lets this stop being a client
      component at all. One fewer hydration island on the page, and the FAQ content
      is now crawlable in the HTML as well as in the FAQPage schema.

   The open/close reveal is the `faq-answer-in` keyframe in `globals.css`, which
   restarts whenever the browser flips the content from `display: none`, and which
   resolves to no animation under `prefers-reduced-motion`.

   `name` is deliberately NOT set on the `details` elements: exclusive-accordion
   behaviour would mean a visitor comparing two answers has to lose the first one.
   ──────────────────────────────────────────────────────────────────────────── */

export function FaqAccordion({ items }: { items: FaqPair[] }) {
  return (
    <div className="border-t border-border">
      {items.map((item) => (
        <details
          key={item.question}
          data-faq
          className="group border-b border-border"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 outline-none transition-colors duration-200 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary group-open:text-primary sm:text-lg">
              {item.question}
            </h3>
            <ChevronDown
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-primary"
            />
          </summary>

          <div className="pb-6 pr-10">
            <p className="max-w-[72ch] text-sm leading-[1.75] text-muted-foreground sm:text-base">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
