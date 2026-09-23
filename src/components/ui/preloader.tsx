"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   CINEMATIC PRELOADER
   Full-screen overlay that masks the page while it loads. Displays a rapid
   counter (000 → 100) then slides upward with premium spring physics.

   The overlay is part of the server-rendered HTML (`loading` starts `true`,
   not `null`), so it masks the page from the very first paint — the content
   beneath never flashes before the sequence runs. Skipping is the exception
   and is decided before first paint by the boot script in
   `(site)/layout.tsx` plus the `data-preloader="skip"` rule in globals.css:
   once per session (sessionStorage guard), never under prefers-reduced-motion
   (Requirement 11.9), and the boot script's failsafe timer hides the overlay
   if hydration never lands.
   ───────────────────────────────────────────────────────────────────────────── */

const EXIT_SPRING = { type: "spring", stiffness: 100, damping: 30, mass: 1 } as const;

/**
 * Fired on `window` the moment the curtain begins to leave. The hero system
 * visual's engine listens for this instead of guessing a fixed delay, so the
 * entrance starts on the real hand-off rather than 900ms after mount.
 */
export const PRELOADER_RELEASED_EVENT = "blogspage:preloader-released";

// Counter + hold must stay well inside the 1500ms visible-duration budget
// (Requirement 11.8). EXIT_DURATION_MS is a documented estimate of the
// EXIT_SPRING's settling time (spring physics has no fixed duration), kept
// here so any future consumer summing counter + hold + exit has a value to use.
const COUNTER_DURATION_MS = 900;
const HOLD_DURATION_MS = 150;
const EXIT_DURATION_MS = 400;

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const releasedRef = useRef(false);
  // Counter and progress bar are written straight to the DOM through refs, not
  // through state: the counter ticks ~60 times a second for 900ms, and a
  // `setState` per tick re-renders this subtree on every frame during exactly
  // the window in which the rest of the page is hydrating.
  const counterRef = useRef<HTMLParagraphElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const release = () => {
    if (releasedRef.current) return;
    releasedRef.current = true;
    try {
      sessionStorage.setItem("blogspage-preloaded", "true");
    } catch {
      // Blocked storage (privacy extensions, old private mode) must never
      // trap the visitor behind the overlay — the session guard is
      // best-effort, the release is not.
    }
    // Announce the hand-off before the exit animation runs, so a listener can
    // start its own entrance against the real curtain movement. The attribute
    // covers the race where a listener attaches after this fires.
    document.documentElement.setAttribute("data-preloader-released", "true");
    window.dispatchEvent(new CustomEvent(PRELOADER_RELEASED_EVENT));
    setLoading(false);
  };

  // Skip guards: the overlay ships inside the HTML, so this decision runs as
  // soon as hydration lands. Revisits and reduced-motion users dismiss the
  // overlay immediately — the boot script has already hidden it pre-paint,
  // this unmounts it (the exit animation is invisible behind `display:none`).
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("blogspage-preloaded");
    if (hasLoaded) {
      releasedRef.current = true;
      setLoading(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      release();
      return;
    }
  }, []);

  // Rapid counter from 0 → 100 over COUNTER_DURATION_MS, plus a hard release
  // timeout that fires independent of the rAF loop so a stalled/throttled
  // loop (e.g. backgrounded tab) can never leave the overlay stuck.
  //
  // The counter and the bar width are written via refs on the nodes themselves:
  // text content and one style property, no React render per frame.
  useEffect(() => {
    if (!loading) return;

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1);
      // Ease-out curve for the counter (fast start, slow finish)
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * 100);

      if (counterRef.current) {
        counterRef.current.textContent = String(value).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.width = `${value}%`;
      }

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        // Small delay at 100 before revealing
        setTimeout(release, HOLD_DURATION_MS);
      }
    };

    frame = requestAnimationFrame(tick);

    const hardRelease = setTimeout(release, COUNTER_DURATION_MS + HOLD_DURATION_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(hardRelease);
    };
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          data-preloader-overlay
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={EXIT_SPRING}
          aria-hidden="true"
          className="dark fixed inset-0 z-[99] flex flex-col items-center justify-center bg-background"
        >
          {/* Subtle background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(130,143,255,0.08),transparent_60%)] blur-[80px]"
          />

          {/* Counter — text written by the RAF loop through `counterRef` */}
          <div className="relative flex flex-col items-center gap-6">
            <p
              ref={counterRef}
              className="font-mono text-[clamp(4rem,12vw,8rem)] font-bold tabular-nums leading-none tracking-tighter text-foreground"
            >
              000
            </p>

            <p className="font-mono text-xs tracking-[0.3em] text-text-subtle uppercase">
              Initializing Blogspage AI Engine
            </p>

            {/* Progress bar — width written by the RAF loop through `barRef` */}
            <div className="h-px w-48 overflow-hidden rounded-full bg-border-subtle">
              <div
                ref={barRef}
                className="h-full bg-gradient-to-r from-accent-blue to-accent-violet transition-[width] duration-100 ease-out"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
