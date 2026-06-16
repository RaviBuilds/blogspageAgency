"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

/**
 * Global smooth-scroll wrapper (design system §2).
 *
 * Boots a single Lenis instance for the App Router, drives it from a
 * requestAnimationFrame loop, and tears everything down on unmount so we never
 * leak a RAF loop or a second Lenis instance across client navigations.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
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

  return <>{children}</>;
}

export default SmoothScrollProvider;
