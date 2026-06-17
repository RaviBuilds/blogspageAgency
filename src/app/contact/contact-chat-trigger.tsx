"use client";

import { Sparkles, ArrowRight } from "lucide-react";

export function ContactChatTrigger() {
  const openChat = () => {
    window.dispatchEvent(new Event("open-ai-chat"));
  };

  return (
    <button
      onClick={openChat}
      className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-white"
    >
      <Sparkles className="size-3.5 text-primary" />
      Talk to Sweety
      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
    </button>
  );
}
