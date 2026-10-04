"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { CHAPTERS, type ChapterId } from "./content";

/**
 * A quiet "where am I" rail in the left gutter, desktop only (≥1360px, where
 * the gutter is wide enough not to touch the content). It follows the member
 * lifecycle the page is organised around and marks the chapter currently
 * under the reading line. Hidden while the hero is on screen.
 */
export function ChapterRail() {
  const [active, setActive] = useState<ChapterId | null>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!sections.length) return;
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current: ChapterId | null = null;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = s.dataset.chapter as ChapterId;
      }
      // Past the last chapter (final CTA, footer) keep the last one.
      if (!current) {
        const last = sections[sections.length - 1].getBoundingClientRect();
        if (last.bottom <= line) current = sections[sections.length - 1].dataset.chapter as ChapterId;
      }
      setActive(current);
    };
    const observer = new IntersectionObserver(update, { rootMargin: "-40% 0px -60% 0px" });
    sections.forEach((s) => observer.observe(s));
    update();
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav
      aria-label="Page chapters"
      className={cn(
        "fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-2xl border border-white/10 bg-[#050505]/85 px-2.5 py-2 backdrop-blur-md transition-opacity duration-500 min-[1360px]:block",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ol className="relative space-y-1">
        <span aria-hidden className="absolute bottom-3 left-[5px] top-3 w-px bg-white/15" />
        {CHAPTERS.map((c) => {
          const isActive = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.anchor}`}
                aria-label={c.label}
                aria-current={isActive ? "true" : undefined}
                tabIndex={active ? 0 : -1}
                className="group flex min-h-7 items-center gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span
                  className={cn(
                    "relative size-[11px] shrink-0 rounded-full border transition-all duration-300",
                    isActive ? "border-primary bg-primary shadow-[0_0_12px_rgba(130,143,255,0.8)]" : "border-white/25 bg-[#050505] group-hover:border-white/60",
                  )}
                />
                <span
                  className={cn(
                    "hidden whitespace-nowrap pr-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] group-hover:inline group-focus-visible:inline",
                    isActive ? "text-foreground min-[1536px]:inline" : "text-foreground/60",
                  )}
                >
                  {c.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
