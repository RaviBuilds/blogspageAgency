"use client";

import { useEffect, useState } from "react";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CustomCursor } from "@/components/ui/custom-cursor";
import ChatWidget from "@/components/chat-widget";

/**
 * Mounts non-essential client-side enhancements (smooth scroll, custom
 * cursor, chat widget) after the browser has an idle moment, so they never
 * sit on the critical rendering path for initial paint/hydration.
 */
export function ClientEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true));
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(() => setReady(true), 1);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!ready) return null;

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <ChatWidget />
    </>
  );
}

export default ClientEnhancements;
