import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { GYM_LANDING_HEADINGS } from "@/components/solutions/gym-landing-headings";
import {
  activeJourneyIndex,
  buildEnquiry,
  DELIVERABLES,
  GROWTH_STEPS,
  STAGES,
  VERDICTS,
} from "@/components/solutions/gym/content";
import { GYM_FAQ } from "@/lib/gym-faq";

/**
 * Invariants for the gym solution page's claims. The page deliberately shows
 * no pricing, labels what is required vs recommended honestly, and never
 * presents concept or add-on modules as part of the live starting scope.
 */

const ROOT = join(__dirname, "..", "..");
const GYM_DIR = join(ROOT, "src/components/solutions/gym");
const SOURCES = [
  ...readdirSync(GYM_DIR).map((f) => join(GYM_DIR, f)),
  join(ROOT, "src/components/solutions/gym-solution-landing.tsx"),
  join(ROOT, "src/components/solutions/gym-landing-headings.ts"),
  join(ROOT, "src/lib/gym-faq.ts"),
];

const PRICING = [/₹/, /\bRs\.?\s?\d/i, /\bINR\b/, /\d\s*\/\s*(month|mo|year|yr)\b/i, /\binvestment\b/i, /\bper month\b/i];

describe("gym page content", () => {
  it("contains no pricing", () => {
    for (const file of SOURCES) {
      const text = readFileSync(file, "utf8");
      for (const pattern of PRICING) {
        expect(pattern.test(text), `${file} matches ${pattern}`).toBe(false);
      }
    }
  });

  it("gives every deliverable a status and a reason", () => {
    for (const d of DELIVERABLES) {
      expect(d.status, d.id).toBeTruthy();
      expect(d.reason.trim().length, d.id).toBeGreaterThan(10);
    }
  });

  it("labels infrastructure required and discovery recommended", () => {
    const status = (id: string) => DELIVERABLES.find((d) => d.id === id)?.status;
    for (const id of ["website", "domain", "hosting", "ssl", "deployment"]) {
      expect(status(id), id).toBe("required");
    }
    for (const id of ["gbp", "search-console", "analytics", "local-seo"]) {
      expect(status(id), id).toBe("recommended");
    }
  });

  it("never presents growth modules or AI as part of the starting scope", () => {
    for (const d of DELIVERABLES.filter((x) => x.layer === "growth")) {
      expect(["concept", "add-on"]).toContain(d.status);
    }
    expect(DELIVERABLES.find((d) => d.id === "ai")?.status).toBe("add-on");
    for (const step of GROWTH_STEPS.slice(2)) expect(step.status).toBe("concept");
    for (const stage of STAGES) {
      if (stage.items.some((i) => /AI/.test(i))) {
        expect(stage.items.find((i) => /AI/.test(i))).toMatch(/add-on/i);
      }
    }
  });

  it("backs every verdict with a full FAQ answer", () => {
    const questions = new Set(GYM_FAQ.map((f) => f.question));
    for (const v of VERDICTS) expect(questions.has(v.faq), v.faq).toBe(true);
  });

  it("keeps heading texts unique so ids stay deterministic", () => {
    expect(new Set(GYM_LANDING_HEADINGS).size).toBe(GYM_LANDING_HEADINGS.length);
  });
});

describe("buildEnquiry", () => {
  it("composes the same message the demo has always sent", () => {
    expect(
      buildEnquiry({
        levelIntro: "I'm new to gyms",
        goalPhrase: "lose some weight",
        days: 3,
        timePhrase: "in the evenings",
      }),
    ).toBe(
      "Hi, I'm new to gyms and I'm looking to lose some weight. I'd like to train 3 days a week, in the evenings. Can I visit before joining?",
    );
  });
});

describe("activeJourneyIndex", () => {
  it("picks the visible step closest to the reading line", () => {
    expect(activeJourneyIndex([null, 120, -40, 300], 0)).toBe(2);
  });
  it("keeps the previous step when nothing is visible", () => {
    expect(activeJourneyIndex([null, null], 1)).toBe(1);
  });
});
