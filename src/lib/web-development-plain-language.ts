/**
 * Web Development service page — plain-language translation layer.
 *
 * Scope: /services/web-development.
 *
 * Implements canonical spec §31 (Business Language Translation Rules): every
 * technical concept on this page is stated in outcome language first, with
 * the technical tag shown only as a small, secondary label. This module is
 * the single source for those translations so the same concept is never
 * phrased two different ways in two different sections.
 *
 * Pure module: no React, no I/O, no framework imports.
 */

/*
 * REMOVED: `PlainTranslation` / `PLAIN_LANGUAGE`.
 *
 * That table held six technical-term translations (rbac, api, webhook,
 * multi-tenant, database, jwt) and had no consumer. It was not a pending
 * feature: every one of those translations already ships on the page as real
 * prose the copy deck owns — the architecture layers' `businessMeaning` and
 * `note` fields, and the capability groups' notes. Keeping a second, unrendered
 * copy of approved wording is how two phrasings of the same idea end up on one
 * page. The page's translation discipline (canonical spec §31) is unchanged and
 * is enforced where the words actually are: in `web-development-data.ts`.
 */

/** RBAC "doors" motif — three example roles reused across the architecture and proof sections. */
export const ACCESS_DOORS = [
  { id: "customer", label: "Customer" },
  { id: "staff", label: "Staff" },
  { id: "admin", label: "Admin" },
] as const;

/** Booking/order lifecycle states, per canonical spec §29. */
export const LIFECYCLE_STATES = [
  { id: "requested", label: "Requested" },
  { id: "paid", label: "Paid" },
  { id: "confirmed", label: "Confirmed" },
  { id: "assigned", label: "Assigned" },
  { id: "completed", label: "Completed" },
] as const;

/** Multi-tenant motif — one platform, logically separated businesses. */
export const TENANTS = [
  { id: "business-a", label: "Business A" },
  { id: "business-b", label: "Business B" },
  { id: "business-c", label: "Business C" },
] as const;

/*
 * REMOVED: `MVP_LOOP`.
 *
 * Build → Launch → Learn → Improve was the data for a loop visual that drew a
 * caption ("loops back to Build — the cycle continues after launch") over Phixl
 * AI's *request* pipeline, where it was simply untrue. Both the visual and this
 * table are gone; the two proof builds whose claim is a sequence now share
 * `visuals/state-chain.tsx`. The MVP approach itself is still stated, in the
 * words the deck approves for it: the SaaS MVP ladder rung and the "Can you
 * build an MVP first?" FAQ answer.
 */

/* -------------------------------------------------------------------------- */
/* Process — the dual-layer reading of the five phases                        */
/* -------------------------------------------------------------------------- */

/**
 * One action word and one ordinary sentence per build phase, keyed by
 * `WEB_DEVELOPMENT_PROCESS.phases[].step`.
 *
 * The same dual-layer device the Web Design process section uses, for the same
 * reason: "Architect" and "Test & Validate" tell an engineer exactly what
 * happens and tell a business owner nothing about what they will be shown or
 * asked for. The phase's own title, focus list and output are unchanged — this
 * layer sits in front of them, never instead of them.
 *
 * Deliberately free of any duration, date or turnaround claim: the deck makes
 * no timeline promise and neither does this.
 */
export interface ProcessPlain {
  /** The action, as one word — the largest type in the phase's row. */
  action: string;
  /** What the phase means for the person paying for it. */
  plain: string;
}

export const PROCESS_PLAIN: Record<string, ProcessPlain> = {
  "01": {
    action: "Understand",
    plain: "We work out what the system has to do before anyone writes code.",
  },
  "02": {
    action: "Blueprint",
    plain: "You see the structure — data, roles and workflows — before the build starts.",
  },
  "03": {
    action: "Build",
    plain: "You review working software in increments, not one final reveal.",
  },
  "04": {
    action: "Verify",
    plain: "Every flow that touches money, access or customer data is tested deliberately.",
  },
  "05": {
    action: "Launch",
    plain: "The system goes live, and you get what you need to run and extend it.",
  },
};
