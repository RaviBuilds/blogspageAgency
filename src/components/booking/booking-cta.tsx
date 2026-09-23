"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  hasBookingProvider,
  resolveBookingConfig,
  type BookingConfig,
} from "@/lib/booking";

/**
 * A booking call-to-action that adapts to whatever scheduling provider is
 * configured (`src/lib/booking.ts`): it opens an overlay, embeds inline, links
 * out, or falls back to the page's own lead-capture anchor.
 *
 * Styling is entirely caller-supplied (`className`, `size`, `variant`) so the
 * control is visually identical to the buttons already on the page — this
 * component owns behaviour, never appearance.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type BookingCtaProps = {
  /** Where to send the visitor when no provider is configured. */
  fallbackHref: string;
  children: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary" | "link";
  /** Accessible title for the embedded scheduling frame. */
  frameTitle?: string;
};

function BookingModal({
  config,
  frameTitle,
  onClose,
}: {
  config: BookingConfig;
  frameTitle: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={frameTitle}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.24, ease: EASE }}
        className="relative flex h-[min(760px,90vh)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-lg border border-border bg-popover text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
        <iframe
          src={config.url}
          title={frameTitle}
          className="size-full border-0"
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );
}

export function BookingCta({
  fallbackHref,
  children,
  className,
  size = "lg",
  variant = "default",
  frameTitle = "Book an appointment",
}: BookingCtaProps) {
  const config = resolveBookingConfig(fallbackHref);
  const [open, setOpen] = useState(false);

  // No provider configured, or the provider owns its own page: a plain link is
  // the correct control, and keeps the CTA crawlable.
  if (!hasBookingProvider(config) || config.mode === "external") {
    const href = config.mode === "external" ? config.url! : config.fallbackHref;
    const external = config.mode === "external";

    return (
      <Button size={size} variant={variant} className={className} asChild>
        <Link
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </Link>
      </Button>
    );
  }

  // `embed` and `modal` both resolve to an overlay here. An inline embed is a
  // section-level concern, so a page that wants one renders the provider frame
  // itself and keeps this component for its CTAs.
  return (
    <>
      <Button
        size={size}
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <AnimatePresence>
        {open && (
          <BookingModal
            config={config}
            frameTitle={frameTitle}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
