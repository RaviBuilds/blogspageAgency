"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Global smooth-scroll side effect (design system §2).
 *
 * Boots a single Lenis instance for the App Router, drives it from a
 * requestAnimationFrame loop, and tears everything down on unmount so we never
 * leak a RAF loop or a second Lenis instance across client navigations.
 *
 * Lenis drives document scroll and does not need to wrap any DOM children, so
 * this renders nothing — it's a sibling side-effect component.
 */
export function SmoothScroll() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect users who ask for reduced motion — skip smoothing entirely.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
