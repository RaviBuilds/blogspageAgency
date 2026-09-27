import { WEB_DESIGN_FAQS, WEB_DESIGN_FINAL_CTA } from "@/lib/web-design-data";
import { FaqAccordion } from "./faq-accordion";
import { WebDesignChatTrigger } from "./web-design-chat-trigger";

export function FAQAndFinalCTASection() {
  const { h3, lead, buttonLabel, microcopy } = WEB_DESIGN_FINAL_CTA;

  return (
    <section className="border-b border-border bg-background py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-wider text-accent-cyan uppercase">
            COMMON QUESTIONS
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
            Frequently Asked Questions About Our Web Design Services
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Clear, transparent answers regarding inclusions, boundaries, pricing, and launch infrastructure.
          </p>
        </div>

        {/* FAQ Accordion (10 Curated Q&As) */}
        <div className="mx-auto mt-14 max-w-3xl">
          <FaqAccordion items={WEB_DESIGN_FAQS} />
        </div>

        {/* Final CTA Card (Canonical Section 11 Component) */}
        <div className="mx-auto mt-20 max-w-4xl overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-card via-background-subtle/40 to-card p-8 sm:p-12 lg:p-16 text-center shadow-lg shadow-black/5">
          <div className="mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
              NEXT STEPS
            </span>

            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance">
              {h3}
            </h3>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {lead}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3">
              <WebDesignChatTrigger
                label={buttonLabel}
                variant="card"
                showSparkle
              />
              <p className="text-xs text-text-subtle">{microcopy}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
