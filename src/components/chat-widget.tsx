"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Sparkles, Send, X, CheckCircle2 } from "lucide-react";

const QUICK_REPLIES = [
  "I run a gym",
  "I need an online store",
  "Automate my business",
  "Build me a SaaS",
];

const WELCOME =
  "Hi, I'm Sweety from Blogspage! 👋 Tell me about your business and what you're trying to build — I'll show you how we can help.";

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[520px] w-[370px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="size-4" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight text-primary">Sweety</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  AI Assistant • Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {/* Sweety's standing welcome bubble */}
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card p-3 text-sm text-card-foreground">
                {WELCOME}
              </div>
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => {
              const textParts = (m.parts ?? []).filter(
                (p): p is { type: "text"; text: string } => p.type === "text"
              );
              const text = textParts.map((p) => p.text).join("");

              // Skip empty assistant turns (e.g. a pure tool-call step).
              if (!text.trim()) return null;

              return (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${
                      m.role === "user"
                        ? "rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-tl-sm border border-border bg-card text-card-foreground"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {leadCaptured && (
              <div className="flex items-center justify-center gap-2 py-1 text-xs text-emerald-500">
                <CheckCircle2 className="size-3.5" />
                Your details are in — our team will reach out soon.
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-card p-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-border bg-card p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sweety anything…"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Chat with Sweety"}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-200 hover:scale-105"
      >
        {isOpen ? <X className="size-6" /> : <Sparkles className="size-6" />}
      </button>
    </div>
  );
}
