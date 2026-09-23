"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Sparkles, Send, X, CheckCircle2 } from "lucide-react";

const QUICK_REPLIES = [
  "I need an AI agent",
  "Automate my workflows",
  "Build me a SaaS",
  "Scale my business",
];

const WELCOME =
  "Hi, I'm Sweety, your AI Business Consultant at Blogspage. 👋 Tell me a little about your business and what you're trying to achieve. Whether you're looking for a professional website, AI automation, a customer portal, or a complete digital transformation, I'll recommend the right solution and guide you on the next steps.";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "submitted" || status === "streaming";
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listen for global "open-ai-chat" event so other components can trigger the widget.
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-ai-chat", handleOpen);
    return () => window.removeEventListener("open-ai-chat", handleOpen);
  }, []);

  // Keep the conversation pinned to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  // Did Sweety successfully capture a lead anywhere in the thread?
  const leadCaptured = messages.some((m) =>
    (m.parts ?? []).some(
      (p) =>
        typeof p.type === "string" &&
        p.type.startsWith("tool-save_lead") &&
        "state" in p &&
        p.state === "output-available" &&
        (p as { output?: { success?: boolean } }).output?.success === true
    )
  );

  return (
    <div className="dark fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[540px] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-2xl shadow-black/50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          {/* ─── Header ─── */}
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-full border border-accent-blue/20 bg-accent-blue/10">
                <Sparkles className="size-4 text-accent-blue" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-popover bg-success" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-foreground">
                  Sweety
                </h3>
                <p className="text-[11px] text-text-subtle">
                  AI Sales Agent · Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex size-7 items-center justify-center rounded-full border border-border-subtle text-text-subtle transition-colors hover:border-border-strong hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* ─── Messages Area ─── */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Welcome message */}
            <div className="flex justify-start">
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm border-l-2 border-accent-blue/50 bg-card/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                {WELCOME}
              </div>
            </div>

            {/* Quick replies */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:border-accent-blue/30 hover:bg-accent-blue/10 hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Message thread */}
            {messages.map((m) => {
              const textParts = (m.parts ?? []).filter(
                (p): p is { type: "text"; text: string } => p.type === "text"
              );
              const text = textParts.map((p) => p.text).join("");

              if (!text.trim()) return null;

              const isUser = m.role === "user";

              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-tr-sm bg-card text-foreground"
                        : "rounded-tl-sm border-l-2 border-accent-blue/50 bg-card/60 text-muted-foreground"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {/* Lead captured indicator */}
            {leadCaptured && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-success">
                <CheckCircle2 className="size-3.5" />
                Details captured — our team will reach out soon.
              </div>
            )}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border-l-2 border-accent-blue/50 bg-card/60 px-4 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-text-disabled [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-text-disabled [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-text-disabled" />
                </div>
              </div>
            )}
          </div>

          {/* ─── Input Form ─── */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border-subtle px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-200 focus:border-border-strong focus:bg-popover"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="flex size-9 items-center justify-center rounded-full bg-accent-blue/80 text-primary-foreground transition-all duration-200 hover:bg-accent-blue disabled:opacity-40 disabled:hover:bg-accent-blue/80"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ─── Floating Toggle Button ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Chat with Sweety"}
        className="flex size-14 items-center justify-center rounded-full border border-border bg-popover/90 text-accent-blue shadow-2xl shadow-accent-blue/20 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-accent-blue/30 hover:shadow-accent-blue/30"
      >
        {isOpen ? <X className="size-5" /> : <Sparkles className="size-5" />}
      </button>
    </div>
  );
}
