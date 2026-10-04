"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

import { FINAL_CTA_ID, GYM_QUOTE_MESSAGE } from "./content";

/**
 * Mobile-only sticky WhatsApp CTA.
 *
 * Appears once the visitor has scrolled past the hero and steps aside while the
 * closing CTA section is on screen (which already carries the same action).
 * It stops short of the right edge so it never covers the site-wide chat
 * widget, which is pinned bottom-right.
 */
export function StickyWhatsApp() {
  const [pastHero, setPastHero] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById(FINAL_CTA_ID);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFinalVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !finalVisible;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-24 z-40 transition-all duration-300 md:hidden",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <a
        href={whatsappHref(GYM_QUOTE_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        onClick={() =>
          trackEvent("solution_cta_click", {
            cta_location: "gym-sticky-mobile",
            cta_label: "Get a quote",
            destination: "whatsapp",
          })
        }
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <MessageCircle className="size-4 text-[#128c4b]" />
        Get a quote
      </a>
    </div>
  );
}
