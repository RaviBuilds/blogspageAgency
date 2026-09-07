"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION — design system §5
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/#process", label: "Process" },
  { href: "/blogs", label: "Blogs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Presentational theme state for the pill: dark-glass over the hero (page
  // top), light glass once the page has scrolled. Derived inside the existing
  // scroll handler below — no additional listeners or observers.
  const [scrolled, setScrolled] = useState(false);

  // Track scroll direction
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Reuses the same 100px constant as the hide behaviour: the flip happens
    // while the pill is hidden on down-scroll, so the boundary never flickers.
    setScrolled(latest > 100);
    const direction = latest > lastScrollY.current ? "down" : "up";
    // Only hide after scrolling past 100px, and only when going down
    if (direction === "down" && latest > 100) {
      setHidden(true);
      setOpen(false);
    } else {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  const openChat = () => {
    window.dispatchEvent(new Event("open-ai-chat"));
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: hidden ? "-150%" : "0%",
        opacity: hidden ? 0 : 1,
      }}
      transition={SPRING}
      className={cn(
        "fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2",
        "rounded-full border border-border backdrop-blur-md shadow-2xl shadow-black/20",
        "transition-colors duration-300",
        // Over the hero the pill carries the `dark` scope itself, so every
        // semantic class below resolves the approved dark palette; scrolled,
        // the same classes resolve the approved light palette.
        scrolled ? "bg-card/85" : "dark bg-background/70",
      )}
    >
      <div className="flex h-14 items-center justify-between px-5">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center"
          aria-label="Blogspage AI — home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/blogspage-logo.png"
            alt="Blogspage AI"
            width={320}
            height={96}
            priority
            quality={100}
            className="h-11 w-auto rounded-xl"
          />
        </Link>

        {/* Desktop nav links — centered */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side — CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={openChat}
            className={cn(
              "hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-all duration-200 hover:bg-foreground/90 sm:inline-flex",
            )}
          >
            Start a Project
            <ArrowRight className="size-3" />
          </button>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {open ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden border-t border-border-subtle md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={openChat}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Start a Project
                <ArrowRight className="size-3" />
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
