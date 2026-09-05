"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, type LucideIcon } from "lucide-react";
import { SOCIAL_PROFILES } from "@/lib/site";
import { serviceRoutes } from "@/lib/routes";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 150, damping: 18, mass: 0.8 } as const;

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────────────────────── */
const footerLinks = {
  Solutions: serviceRoutes().map((route) => ({
    label: route.label,
    href: route.path,
  })),
  Company: [
    { label: "About", href: "/about" },
    { label: "Process", href: "/#process" },
    { label: "Solutions", href: "/solutions" },
    { label: "Blog", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

/* Icons are not data, so the lookup stays local; SOCIAL_PROFILES (from
   src/lib/site.ts) supplies the label/href pairs that must stay
   character-identical to the Organization `sameAs` array. */
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  "X (Twitter)": Twitter,
  GitHub: Github,
  LinkedIn: Linkedin,
};

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED FOOTER LINK
   Line animates in from left on hover; text shifts right slightly.
   ───────────────────────────────────────────────────────────────────────────── */
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.div initial="rest" whileHover="hover" animate="rest">
      <Link
        href={href}
        className="group relative inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {/* Underline from left */}
        <motion.span
          className="absolute -bottom-0.5 left-0 h-px bg-muted-foreground"
          variants={{
            rest: { width: "0%" },
            hover: { width: "100%" },
          }}
          transition={SPRING}
        />
        <motion.span
          className="inline-block"
          variants={{
            rest: { x: 0 },
            hover: { x: 4 },
          }}
          transition={SPRING}
        >
          {label}
        </motion.span>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="dark border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Blogspage AI — home"
            >
              <Image
                src="/blogspage-logo.png"
                alt="Blogspage AI"
                width={400}
                height={120}
                quality={100}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-subtle">
              Premium AI automation &amp; product engineering. We build
              intelligent systems that sell, qualify, and scale — so ambitious
              founders can grow without the headcount.
            </p>
            <p className="mt-4 text-xs tracking-wide text-text-subtle">
              Engineering globally · Based in Hyderabad, India
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              {SOCIAL_PROFILES.map(({ label, href }) => {
                const Icon = SOCIAL_ICONS[label];
                return (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-lg border border-border text-text-subtle transition-colors duration-200 hover:border-border-strong hover:text-foreground"
                  >
                    <Icon className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 sm:flex-row">
          <p className="text-xs text-text-subtle">
            © {new Date().getFullYear()} Blogspage Agency. All rights reserved.
          </p>
          <p className="text-xs text-text-subtle">
            Designed &amp; engineered with obsessive attention to detail.
          </p>
        </div>
      </div>
    </footer>
  );
}
