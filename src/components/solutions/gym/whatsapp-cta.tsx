"use client";

import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

import { GYM_ENQUIRY_MESSAGE, GYM_QUOTE_MESSAGE } from "./content";

type WhatsAppCtaProps = {
  children: React.ReactNode;
  /** Where on the page the CTA sits; sent with the analytics event. */
  location: "hero-quote" | "hero" | "after-tools" | "foundation" | "final-quote" | "final";
  /** `white` is the primary treatment, `accent` the brand fill, `outline` secondary. */
  tone?: "white" | "accent" | "outline";
  /** `quote` pre-fills the quote request; `preview` the "show me" message. */
  intent?: "quote" | "preview";
  showWhatsAppIcon?: boolean;
  className?: string;
};

/**
 * A WhatsApp click-to-chat CTA.
 *
 * A plain anchor (crawlable, works without JS) wrapped in the shared `Button`.
 * Long labels wrap instead of overflowing a 360px viewport, which is why the
 * button's default `whitespace-nowrap` and fixed height are overridden.
 */
export function WhatsAppCta({
  children,
  location,
  tone = "white",
  intent = "preview",
  showWhatsAppIcon = false,
  className,
}: WhatsAppCtaProps) {
  const href = whatsappHref(intent === "quote" ? GYM_QUOTE_MESSAGE : GYM_ENQUIRY_MESSAGE);

  return (
    <Button
      size="lg"
      variant={tone === "outline" ? "outline" : "default"}
      asChild
      className={cn(
        "h-auto min-h-12 w-full whitespace-normal px-7 py-3 text-center transition-transform active:scale-[0.98] sm:w-auto",
        tone === "white" && "glow-border bg-white text-black hover:bg-white/90",
        tone === "accent" && "glow-border bg-primary text-primary-foreground hover:bg-primary/90",
        tone === "outline" &&
          "border-white/15 bg-transparent text-foreground hover:bg-white/[0.05] dark:border-white/15 dark:bg-transparent dark:hover:bg-white/[0.05]",
        className,
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("solution_cta_click", {
            cta_location: `gym-${location}`,
            cta_label: typeof children === "string" ? children : intent,
            destination: "whatsapp",
          })
        }
      >
        {showWhatsAppIcon ? <MessageCircle className="size-4" /> : null}
        {children}
        {showWhatsAppIcon ? null : <ArrowRight className="size-4" />}
      </a>
    </Button>
  );
}
