"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#process", label: "Process" },
  { href: "/blogs", label: "Blogs" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-white/[0.06]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-white/10 text-xs font-bold">
            B
          </span>
          Blogspage
        </Link>

        {/* Centered minimalist link row */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className={cn("glow-border hidden bg-white text-black hover:bg-white/90 sm:inline-flex")}
            asChild
          >
            <Link href="/#contact">
              Start a Project
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex size-9 items-center justify-center rounded-md border border-white/[0.08] text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {open && (
        <div className="border-t border-white/[0.06] md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button
              size="sm"
              className="glow-border mt-2 bg-white text-black hover:bg-white/90"
              asChild
            >
              <Link href="/#contact" onClick={() => setOpen(false)}>
                Start a Project
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
