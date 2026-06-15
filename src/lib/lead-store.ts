import "server-only";

import { writeClient } from "@/sanity/lib/write-client";

export type LeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  businessName?: string | null;
  industry?: string | null;
  message?: string | null;
  source?: string | null;
  transcript?: string | null;
};

export type RecordLeadResult = {
  success: boolean;
  id?: string;
  /** True when the lead was persisted to Sanity; false when only logged. */
  persisted: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

/**
 * Single source of truth for persisting a lead.
 * Used by both the homepage form action and the Sweety chat tool.
 *
 * Writes to Sanity when SANITY_WRITE_TOKEN is configured; otherwise it
 * degrades gracefully to a server log so the UX never breaks.
 */
export async function recordLead(input: LeadInput): Promise<RecordLeadResult> {
  const doc = {
    _type: "lead" as const,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || undefined,
    businessName: input.businessName?.trim() || undefined,
    industry: input.industry?.trim() || undefined,
    message: input.message?.trim() || undefined,
    source: input.source?.trim() || "website",
    transcript: input.transcript?.trim() || undefined,
    status: "new" as const,
    submittedAt: new Date().toISOString(),
  };

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.warn(
      "[Lead] SANITY_WRITE_TOKEN missing — logging lead instead of persisting.",
      JSON.stringify(doc, null, 2)
    );
    return { success: true, persisted: false };
  }

  try {
    const created = await writeClient.create(doc);
    console.log("[Lead] Captured", created._id, doc.email, `(${doc.source})`);
    return { success: true, id: created._id, persisted: true };
  } catch (error) {
    console.error("[Lead] Failed to persist lead:", error);
    return { success: false, persisted: false };
  }
}
