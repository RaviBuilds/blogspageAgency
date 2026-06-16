"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom global cursor (design system §6).
 *
 * A fixed, pointer-events-none, monochrome glass circle that tracks the mouse
 * via useMotionValue + useSpring. It scales up and brightens when hovering over
 * actionable elements (a, button, [role="button"], inputs).
 *
 * Hidden on touch / coarse-pointer devices where a custom cursor is noise.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);

  // Raw pointer position.
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Premium spring smoothing for the trailing follow (§5 motion physics).
  const springConfig = { stiffness: 350, damping: 28, mass: 0.6 } as const;
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse / trackpad).
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    setEnabled(true);

    const ACTIONABLE = 'a, button, [role="button"], input, textarea, select, label';

    function handleMove(event: MouseEvent) {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setHidden(false);

      const target = event.target as Element | null;
      setActive(Boolean(target?.closest(ACTIONABLE)));
    }

    function handleLeave() {
      setHidden(true);
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/5 backdrop-blur-[2px] mix-blend-difference lg:block"
      style={{ x, y }}
      animate={{
        scale: active ? 2.4 : 1,
        opacity: hidden ? 0 : active ? 1 : 0.7,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
    />
  );
}

export default CustomCursor;
