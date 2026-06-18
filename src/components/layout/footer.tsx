"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 150, damping: 18, mass: 0.8 } as const;

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────────────────────── */
const footerLinks = {
  Solutions: [
    { label: "AI Sales Agents", href: "/#services" },
    { label: "Workflow Automation", href: "/#services" },
    { label: "Custom SaaS", href: "/#services" },
    { label: "Programmatic SEO", href: "/#services" },
  ],
  Company: [
    { label: "Process", href: "/#process" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Blog", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://x.com/ravindra5k", label: "X (Twitter)" },
  { icon: Github, href: "https://github.com/RaviBuilds", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ravindra-kamble-97094220a/",
    label: "LinkedIn",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED FOOTER LINK
   Line animates in from left on hover; text shifts right slightly.
   ───────────────────────────────────────────────────────────────────────────── */
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.div initial="rest" whileHover="hover" animate="rest">
      <Link
        href={href}
        className="group relative inline-flex items-center text-sm text-white/50 transition-colors hover:text-white/90"
      >
        {/* Underline from left */}
        <motion.span
          className="absolute -bottom-0.5 left-0 h-px bg-white/40"
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
    <footer className="border-t border-white/[0.05] bg-black">
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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Premium AI automation &amp; product engineering. We build
              intelligent systems that sell, qualify, and scale — so ambitious
              founders can grow without the headcount.
            </p>
            <p className="mt-4 text-xs tracking-wide text-white/25">
              Engineering globally · Based in Hyderabad, India
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 transition-colors duration-200 hover:border-white/[0.15] hover:text-white/80"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
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
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Blogspage Agency. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Designed &amp; engineered with obsessive attention to detail.
          </p>
        </div>
      </div>
    </footer>
  );
}
