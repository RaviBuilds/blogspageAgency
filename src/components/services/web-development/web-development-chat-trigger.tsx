"use client";

/**
 * Web Development page — chat CTA trigger.
 *
 * Dispatches the same site-wide `open-ai-chat` event the global `ChatWidget`
 * (`src/components/chat-widget.tsx`) listens for — the identical mechanism
 * `WebDesignChatTrigger` uses. No second CTA system is introduced; this
 * component only carries this page's own button styling.
 *
 * Both icons are `aria-hidden`: the sparkle and the arrow are decoration around
 * the label, and without the attribute a screen reader announces the accessible
 * names Lucide gives its SVGs alongside the button's own text.
 */

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WebDevelopmentChatTriggerProps {
  label: string;
  variant?: "hero" | "primary" | "outline" | "card";
  className?: string;
  showSparkle?: boolean;
  showArrow?: boolean;
}

export function WebDevelopmentChatTrigger({
  label,
  variant = "primary",
  className,
  showSparkle = false,
  showArrow = true,
}: WebDevelopmentChatTriggerProps) {
  const openChat = () => {
    window.dispatchEvent(new Event("open-ai-chat"));
  };

  if (variant === "hero") {
    return (
      <Button
        onClick={openChat}
        size="lg"
        className={cn(
          "group h-12 rounded-full bg-foreground px-7 text-sm font-semibold text-background transition-all duration-200 hover:bg-foreground/90 hover:shadow-lg hover:shadow-foreground/5",
          className
        )}
      >
        {showSparkle && <Sparkles aria-hidden className="size-4 text-accent-blue" />}
        <span>{label}</span>
        {showArrow && (
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        )}
      </Button>
    );
  }

  if (variant === "card") {
    return (
      <Button
        onClick={openChat}
        size="lg"
        className={cn(
          "group h-12 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-xl",
          className
        )}
      >
        {showSparkle && <Sparkles aria-hidden className="size-4" />}
        <span>{label}</span>
        {showArrow && (
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        )}
      </Button>
    );
  }

  if (variant === "outline") {
    return (
      <Button
        onClick={openChat}
        variant="outline"
        size="default"
        className={cn(
          "group rounded-full border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:border-border-strong hover:bg-background-subtle",
          className
        )}
      >
        {showSparkle && <Sparkles aria-hidden className="size-3.5 text-primary" />}
        <span>{label}</span>
        {showArrow && (
          <ArrowRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
          />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={openChat}
      className={cn(
        "group rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all duration-200 hover:bg-foreground/90",
        className
      )}
    >
      {showSparkle && <Sparkles aria-hidden className="size-3.5 text-accent-blue" />}
      <span>{label}</span>
      {showArrow && (
        <ArrowRight
          aria-hidden
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
        />
      )}
    </Button>
  );
}
