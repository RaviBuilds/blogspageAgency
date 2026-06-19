import type { Metadata } from "next";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { ContactChatTrigger } from "./contact-chat-trigger";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Blogspage — AI Automation & Product Engineering Agency based in Hyderabad, India.",
};

const details = [
  {
    icon: MapPin,
    label: "Office Address",
    value: "Ayodhya Nagar Colony, Mehdipatnam\nHyderabad, Telangana 500028\nIndia",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 80194 43314",
    href: "tel:+918019443314",
  },
  {
    icon: Mail,
    label: "Email",
    value: "ravi@blogspage.com",
    href: "mailto:ravi@blogspage.com",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 lg:py-32">
      {/* Header */}
      <p className="text-sm font-medium text-primary">Contact</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Let&apos;s build something intelligent.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
        Whether you need an AI automation engine, a custom SaaS platform, or a
        strategy conversation — reach out through any channel below.
      </p>

      {/* Business details grid */}
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {details.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm"
          >
            <div className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
              <item.icon className="size-4 text-primary" />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              {item.label}
            </p>
            {item.href ? (
              <a
                href={item.href}
                className="mt-2 block whitespace-pre-line text-sm leading-relaxed text-white/80 transition-colors hover:text-white"
              >
                {item.value}
              </a>
            ) : (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/80">
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* AI Chat Trigger */}
      <div className="mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center backdrop-blur-sm">
        <h2 className="text-xl font-semibold tracking-tight">
          Prefer an instant conversation?
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Talk to Sweety, our AI SDR. Get a strategy recommendation in under 2
          minutes — no forms, no waiting.
        </p>
        <div className="mt-6">
          <ContactChatTrigger />
        </div>
      </div>

      {/* Availability note */}
      <p className="mt-12 text-center text-xs text-white/30">
        Business hours: Mon–Sat, 10:00 AM – 7:00 PM IST · Response within 24
        hours
      </p>
    </div>
  );
}
