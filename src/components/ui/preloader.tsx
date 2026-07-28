"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   CINEMATIC PRELOADER
   Full-screen overlay that masks the page while it loads. Displays a rapid
   counter (000 → 100) then slides upward with premium spring physics.
   Only runs once per session (sessionStorage guard).
   ───────────────────────────────────────────────────────────────────────────── */

const EXIT_SPRING = { type: "spring", stiffness: 100, damping: 30, mass: 1 } as const;

// Counter + hold must stay well inside the 1500ms visible-duration budget
// (Requirement 11.8). EXIT_DURATION_MS is a documented estimate of the
// EXIT_SPRING's settling time (spring physics has no fixed duration), kept
// here so any future consumer summing counter + hold + exit has a value to use.
const COUNTER_DURATION_MS = 900;
const HOLD_DURATION_MS = 150;
const EXIT_DURATION_MS = 400;

export function Preloader() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [counter, setCounter] = useState(0);
  const releasedRef = useRef(false);

  const release = () => {
    if (releasedRef.current) return;
    releasedRef.current = true;
    sessionStorage.setItem("blogspage-preloaded", "true");
    setLoading(false);
  };

  // Guard: only show once per session, and skip entirely under
  // prefers-reduced-motion (Requirement 11.9) so no animated sequence runs.
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

    setLoading(true);
  }, []);

  // Rapid counter from 0 → 100 over COUNTER_DURATION_MS, plus a hard release
  // timeout that fires independent of the rAF loop so a stalled/throttled
  // loop (e.g. backgrounded tab) can never leave the overlay stuck.
  useEffect(() => {
    if (!loading) return;

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1);
      // Ease-out curve for the counter (fast start, slow finish)
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter(Math.floor(eased * 100));

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

  // Don't render anything until we know (avoids flash on revisit)
  if (loading === null) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={EXIT_SPRING}
          aria-hidden="true"
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-[#050505]"
        >
          {/* Subtle background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_60%)] blur-[80px]"
          />

          {/* Counter */}
          <div className="relative flex flex-col items-center gap-6">
            <p className="font-mono text-[clamp(4rem,12vw,8rem)] font-bold tabular-nums leading-none tracking-tighter text-white/90">
              {String(counter).padStart(3, "0")}
            </p>

            <p className="font-mono text-xs tracking-[0.3em] text-white/30 uppercase">
              Initializing Blogspage AI Engine
            </p>

            {/* Progress bar */}
            <div className="h-px w-48 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                initial={{ width: "0%" }}
                animate={{ width: `${counter}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
