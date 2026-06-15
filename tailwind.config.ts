import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const semanticProse = {
  "--tw-prose-body": "var(--foreground)",
  "--tw-prose-headings": "var(--foreground)",
  "--tw-prose-lead": "var(--muted-foreground)",
  "--tw-prose-links": "var(--primary)",
  "--tw-prose-bold": "var(--foreground)",
  "--tw-prose-counters": "var(--muted-foreground)",
  "--tw-prose-bullets": "var(--muted-foreground)",
  "--tw-prose-hr": "var(--border)",
  "--tw-prose-quotes": "var(--foreground)",
  "--tw-prose-quote-borders": "var(--border)",
  "--tw-prose-captions": "var(--muted-foreground)",
  "--tw-prose-kbd": "var(--foreground)",
  "--tw-prose-kbd-shadows": "var(--foreground)",
  "--tw-prose-code": "var(--foreground)",
  "--tw-prose-pre-code": "var(--foreground)",
  "--tw-prose-pre-bg": "var(--card)",
  "--tw-prose-th-borders": "var(--border)",
  "--tw-prose-td-borders": "var(--border)",
  color: "var(--foreground)",
  a: {
    color: "var(--primary)",
    textDecoration: "underline",
    textUnderlineOffset: "4px",
    fontWeight: "500",
    "&:hover": {
      color: "var(--primary)",
      opacity: "0.85",
    },
  },
  h1: { color: "var(--foreground)", letterSpacing: "-0.025em" },
  h2: { color: "var(--foreground)", letterSpacing: "-0.02em" },
  h3: { color: "var(--foreground)", letterSpacing: "-0.015em" },
  h4: { color: "var(--foreground)" },
  p: { color: "var(--foreground)" },
  strong: { color: "var(--foreground)" },
  blockquote: {
    color: "var(--foreground)",
    borderLeftColor: "var(--border)",
  },
  hr: { borderColor: "var(--border)" },
  code: {
    color: "var(--foreground)",
    backgroundColor: "var(--card)",
    borderRadius: "0.375rem",
    padding: "0.125rem 0.375rem",
    fontWeight: "400",
  },
  "pre code": {
    backgroundColor: "transparent",
    padding: "0",
  },
  pre: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
  },
  li: { color: "var(--foreground)" },
  figcaption: { color: "var(--muted-foreground)" },
} as const;

const config: Config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: { css: semanticProse },
        invert: { css: semanticProse },
      },
    },
  },
  plugins: [typography],
};

export default config;
