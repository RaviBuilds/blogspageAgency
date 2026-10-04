"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

const useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

type MotionState = "armed" | "in";

/**
 * One-shot "has this entered the viewport" wrapper for CSS-driven motion.
 *
 * SSR contract (same as `ScrollReveal`): the server and first client render
 * carry no motion attribute, so every `.gym-*` motion class resolves to its
 * settled, visible state. After mount (in a layout effect, before paint) the
 * wrapper arms `data-gym-motion="armed"`, which applies each class's start
 * state; when it intersects it flips to `"in"` and the CSS keyframes in
 * `globals.css` play once. Reduced motion never arms, so nothing moves.
 */
export function InView({
  as,
  children,
  className,
  threshold = 0.2,
  rootMargin = "0px 0px -12% 0px",
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<MotionState | null>(null);

  useIsoLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    setState("armed");
  }, []);

  useEffect(() => {
    if (state !== "armed" || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("in");
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [state, threshold, rootMargin]);

  return (
    <Tag ref={ref} className={className} data-gym-motion={state ?? undefined} {...rest}>
      {children}
    </Tag>
  );
}
