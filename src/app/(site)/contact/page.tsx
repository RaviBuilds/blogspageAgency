import type { Metadata } from "next";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { ContactChatTrigger } from "./contact-chat-trigger";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { localBusinessNode } from "@/lib/structured-data";
import { NAP } from "@/lib/site";

// Must stay consistent with `OPENING_HOURS` ("Mo-Su 10:00-19:00") in
// `src/lib/site.ts`, which drives the `LocalBusiness` `openingHours` value
// below. Both cover all seven days, 10 AM-7 PM IST.
const OPENING_HOURS_COPY = "Mon-Sun, 10:00 AM - 7:00 PM IST";

export const metadata: Metadata = buildMetadata({
  path: "/contact",
  title: "Contact Blogspage: hire an ai agency in hyderabad",
  description:
    "Contact Blogspage, the AI automation and product engineering agency based in Hyderabad, India, to discuss your project, timeline, and next steps directly.",
  keywordPhrase: "hire an ai agency in hyderabad",
});

const details = [
  {
    icon: MapPin,
    label: "Office Address",
    value: `${NAP.streetAddress}\n${NAP.locality}, ${NAP.region} ${NAP.postalCode}\n${NAP.country}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: NAP.telephone,
    href: NAP.telephoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: NAP.email,
    href: NAP.emailHref,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 lg:py-32">
      <Breadcrumb trail={[{ name: "Contact", path: "/contact" }]} />

      {/* Header */}
      <p className="mt-6 text-sm font-medium text-primary">Contact</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Let&apos;s build something intelligent.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Whether you need an AI automation engine, a custom SaaS platform, or a
        strategy conversation — reach out through any channel below.
      </p>

      {/* Business details grid */}
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {details.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex size-10 items-center justify-center rounded-xl border border-border-subtle bg-muted">
              <item.icon className="size-4 text-primary" />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-text-subtle">
              {item.label}
            </p>
            {item.href ? (
              <a
                href={item.href}
                className="mt-2 block whitespace-pre-line text-sm leading-relaxed text-foreground transition-colors hover:text-primary"
              >
                {item.value}
              </a>
            ) : (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* AI Chat Trigger */}
      <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-semibold tracking-tight">
          Prefer an instant conversation?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Talk to Sweety, our AI SDR. Get a strategy recommendation in under 2
          minutes — no forms, no waiting.
        </p>
        <div className="mt-6">
          <ContactChatTrigger />
        </div>
      </div>

      {/* Availability note */}
      <p className="mt-12 text-center text-xs text-text-subtle">
        Business hours: {OPENING_HOURS_COPY} · Response within 24 hours
      </p>

      <JsonLd nodes={[localBusinessNode()]} />
    </div>
  );
}
