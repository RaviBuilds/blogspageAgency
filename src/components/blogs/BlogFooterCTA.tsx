"use client";

import Link from "next/link";

type BlogFooterCTAProps = {
  headline: string;
  body: string;
  primaryLabel?: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export function BlogFooterCTA({
  headline,
  body,
  primaryLabel = "Talk to our AI",
  secondaryLabel,
  secondaryHref,
}: BlogFooterCTAProps) {
  const openChat = () => {
    window.dispatchEvent(new Event("open-ai-chat"));
  };

  return (
    <aside
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center"
      aria-label="Call to action"
    >
      <h2 className="text-4xl font-bold tracking-tight text-balance">
        {headline}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-white/70">{body}</p>
      <div className="mt-8 flex flex-row flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={openChat}
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {primaryLabel}
        </button>
        <Link
          href={secondaryHref}
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
        >
          {secondaryLabel}
        </Link>
      </div>
    </aside>
  );
}
