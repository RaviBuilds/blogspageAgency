/**
 * Dental series, Article B: dental website and social media rules after the
 * NDC advisory of 14 October 2026.
 *
 * Creates (or replaces) a Sanity DRAFT only: `drafts.post-dental-rules-ndc-advisory`.
 * Never publishes. Also ensures the "Dental & Healthcare" category exists
 * (createIfNotExists, so an existing category is never overwritten).
 *
 * Usage (Node 22.6+ runs TypeScript natively; no tsx needed):
 *   node scripts/dental-series/article-b.ts --dry-run   # validate + render banner only
 *   node scripts/dental-series/article-b.ts             # validate, upload banner, write draft
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------- Identity
const PUBLISHED_ID = "post-dental-rules-ndc-advisory";
const DRAFT_ID = `drafts.${PUBLISHED_ID}`;
const SLUG = "dental-website-social-media-rules-india-ndc-advisory";
const TITLE =
  "Dental Website and Social Media Rules in India: What the NDC's October 2026 Advisory Means for Your Clinic";
const SEO_TITLE = "NDC Advisory 2026: Dental Website and Social Media Rules";
const META_DESCRIPTION =
  "The NDC's 14 October 2026 advisory cautions dentists against unethical online promotion. See what it names, what it means for your website, and what to audit.";
const EXCERPT =
  "What the NDC's 14 October 2026 advisory names, how the 2014 Code of Ethics applies to clinic websites, and a claims register and 10-point audit you can use.";
const PRIMARY_KEYWORD = "dentist advertising rules India";
const SEO_KEYWORDS = [
  "dentist advertising rules India",
  "NDC advisory dentists social media",
  "National Dental Commission advisory",
  "can dentists advertise in India",
  "dentists code of ethics advertising",
  "dental clinic website compliance India",
  "before and after photos dentists India",
  "patient testimonials dentists India",
];
const CATEGORY = {
  _id: "category-dental-healthcare",
  _type: "category" as const,
  title: "Dental & Healthcare",
  slug: { _type: "slug" as const, current: "dental-healthcare" },
  description:
    "Websites, local search and professional ethics for dental clinics and healthcare practices in India.",
};
const WORD_TARGET = { min: 1900, max: 2400 };

// ---------------------------------------------------------------- Sources
const SRC = {
  ndcAdvisory: "https://dciindia.gov.in/Admin/NewsArchives/M-2672.pdf",
  medicalDialogues:
    "https://medicaldialogues.in/news/health/doctors/national-dental-commission-warns-dentists-against-unethical-social-media-advertising-181335",
  ndcConstituted: "https://dciindia.gov.in/Admin/NewsArchives/M-369.PDF",
  code2014:
    "https://rsdcjpr.org/uploads/Gazette_Notification_reg_DCI_Revised_Dentists_Code_of_Ethics_Regulations_2014_1744098614.pdf",
  ijme: "https://pubmed.ncbi.nlm.nih.gov/38755761/",
  dpdpPib:
    "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf",
  dpdpShortening:
    "https://telecom.economictimes.indiatimes.com/news/policy/indias-meity-proposes-reduced-timeline-for-data-protection-compliance/129370067",
  articleA: "https://blogspage.com/blogs/do-dentists-need-a-website",
  articleC: "https://blogspage.com/blogs/dental-clinic-seo-hyderabad-google-maps",
  corrections: "mailto:ravi@blogspage.com",
};
/** Internal links open in the same tab (renderer honours blank === false). */
const INTERNAL = new Set([SRC.articleA, SRC.articleC]);

// ---------------------------------------------------------------- Helpers
let keyCounter = 0;
const key = (prefix = "k") => `${prefix}${(++keyCounter).toString(36).padStart(3, "0")}`;

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type LinkDef = { _type: "link"; _key: string; href: string; blank?: boolean };
type Block = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: LinkDef[];
  children: Span[];
  listItem?: "bullet" | "number";
  level?: number;
};
type Cta = {
  _type: "ctaBlock";
  _key: string;
  headline: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
};
type Member = Block | Cta;

/**
 * Inline markup: [text](url) for links, **text** for strong, _text_ for em.
 * Kept deliberately small; no nesting.
 */
function inline(text: string): { children: Span[]; markDefs: LinkDef[] } {
  const children: Span[] = [];
  const markDefs: LinkDef[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|(?<![\w])_([^_]+)_(?![\w])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const push = (t: string, marks: string[] = []) => {
    if (t) children.push({ _type: "span", _key: key("s"), text: t, marks });
  };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const def: LinkDef = { _type: "link", _key: key("l"), href: m[2] };
      if (INTERNAL.has(m[2])) def.blank = false;
      markDefs.push(def);
      push(m[1], [def._key]);
    } else if (m[3] !== undefined) {
      push(m[3], ["strong"]);
    } else if (m[4] !== undefined) {
      push(m[4], ["em"]);
    }
    last = re.lastIndex;
  }
  push(text.slice(last));
  return { children, markDefs };
}

function block(style: string, text: string, listItem?: "bullet" | "number"): Block {
  const { children, markDefs } = inline(text);
  const b: Block = { _type: "block", _key: key("b"), style, markDefs, children };
  if (listItem) {
    b.listItem = listItem;
    b.level = 1;
  }
  return b;
}
const p = (t: string) => block("normal", t);
const h2 = (t: string) => block("h2", t);
const h3 = (t: string) => block("h3", t);
const bullets = (...items: string[]) => items.map((t) => block("normal", t, "bullet"));
const numbered = (...items: string[]) => items.map((t) => block("normal", t, "number"));
const cta = (c: Omit<Cta, "_type" | "_key">): Cta => ({ _type: "ctaBlock", _key: key("c"), ...c });

// ---------------------------------------------------------------- Content
const content: Member[] = [
  p(
    "On 14 October 2026, the Ethics and Dental Registration Board of the National Dental Commission (NDC) issued an advisory to every registered dentist in the country. It cautions against unethical promotion on social media, names six practices, and says an established violation may lead to a show-cause notice, suspension or removal from the dental register. If you run a clinic in Hyderabad with a website, an Instagram page and a Google profile, it applies to you.",
  ),
  p(
    "This guide sets out what the advisory says, where it sits among the dentist advertising rules in India that already existed, and what it means for your website. You will come away with a simple test (information or promotion), a claims register you can build in an afternoon, and a 10-point audit of your online presence.",
  ),
  p(
    "We wrote this on 1 November 2026. It is general information, not legal advice. For a decision about your own clinic, confirm with your state dental council or a healthcare lawyer.",
  ),

  h2("What the advisory actually says"),
  p(
    "The notice is one page with six numbered paragraphs. You can read the [original advisory on the NDC website](" +
      SRC.ndcAdvisory +
      ") (file reference M-2672). [Medical Dialogues reported it](" +
      SRC.medicalDialogues +
      ") a day later. In brief:",
  ),
  ...bullets(
    "**Issued by:** the Ethics and Dental Registration Board (EDRB) of the National Dental Commission, Ministry of Health and Family Welfare.",
    "**Date:** 14 October 2026, taking effect immediately.",
    "**Applies to:** all registered dental practitioners; it also refers to dental establishments.",
    "**Practices it names:** recording and broadcasting consultations and dental procedures; publishing patient testimonials and before-and-after photographs; making misleading treatment claims; spreading inaccurate health information; self-aggrandising publicity; and disproportionately large signboards.",
    "**Rules it points to:** Chapter VI (Unethical Acts), Clauses 8.1, 8.2 and 8.3 of the Revised Dentists (Code of Ethics) Regulations, 2014, covering advertising, patient solicitation, confidentiality, publicity and signage.",
    "**Possible consequences:** an established violation may lead to a show-cause notice, suspension, or removal from the State and National Register of Dentists, as permitted under applicable law.",
  ),
  p(
    "The notice creates no new rules; it points back to the 2014 Code. It lists no exceptions, and says nothing about patient consent making recordings or photographs acceptable.",
  ),
  p(
    "Our reading: the Code already treated most of these practices as unethical. What has changed is that the national regulator has now said so in writing, about social media, and spelled out the consequences.",
  ),

  h2("Who sets the dentist advertising rules in India now"),
  p(
    "The National Dental Commission replaced the Dental Council of India on 19 March 2026, when the National Dental Commission Act, 2023 came into force and the Dentists Act, 1948 was repealed. The [NDC's notice of its own constitution](" +
      SRC.ndcConstituted +
      ") confirms the date.",
  ),
  p(
    "As far as we could find, the NDC has not yet notified a new code of ethics, so the 2014 regulations remain the text to read. Your state dental council registration still matters too: the Code requires your registration number to be displayed in the clinic and on prescriptions, certificates and money receipts.",
  ),
  p(
    "You may also have seen coverage of the National Medical Commission's advertising guidelines of 6 October 2026. Those are for medical practitioners and hospitals, and are not binding on a stand-alone dental clinic. If you work in a hospital dental department, ask the hospital whether its obligations reach you.",
  ),
  p(
    "Read your own Code rather than borrowing the doctors' rules, because the advisory will be applied against the dental Code and the two differ in detail. The 2014 Code says a dentist may advertise provided decorum is maintained, and explicitly allows websites that carry factual information. You can read the full text in [a state dental council's copy of the 2014 Code](" +
      SRC.code2014 +
      ").",
  ),

  h2("Why it catches clinics off guard"),
  p(
    "Most dentists learnt the rules years ago, so it is easy to be working from memory.",
  ),
  p(
    "One study gives a sense of the gap. In a cross-sectional survey of dental practitioners in Andhra Pradesh, [published in the Indian Journal of Medical Ethics in 2024](" +
      SRC.ijme +
      "), only 13.8% knew the Code had been revised in 2014. That is an Andhra Pradesh figure. We have not found an equivalent for Telangana.",
  ),
  p(
    "Add marketing advice that treats testimonial videos and before-and-after reels as standard, and a careful clinician can easily end up with content the advisory now names.",
  ),

  h2("A simple test for your website: information or promotion?"),
  p(
    "Clause 8.2.9 of the Code says a clinic website is not unethical where all the information is factual. Clause 8.2 says a dentist should not publicise their own skill in a self-aggrandising way, or boast of cases. So ask of every line on your site: does this help a patient decide, or does it promote me?",
  ),
  p(
    "If you are still deciding whether a website is worth having at all, [our guide on whether dentists need a website](" +
      SRC.articleA +
      ") covers that question first.",
  ),
  h3("Information a patient can use"),
  ...bullets(
    "Clinic name, address, opening hours, phone and WhatsApp number.",
    "Each dentist's name, recognised qualifications and state council registration number.",
    "Plain descriptions of the treatments you offer, without promises about results.",
    "What happens at a first visit and what to bring.",
    "Facilities stated as facts, such as digital X-ray or step-free access at the entrance.",
    "How to reach you: landmarks, the nearest metro station for a clinic in, say, Begumpet, parking, and the languages your team actually speaks.",
  ),
  h3("Promotion the advisory cautions against"),
  ...bullets(
    "Superlatives and self-aggrandising claims, such as \"leading\", \"most trusted\" or \"the best\".",
    "Treatment claims that imply an outcome, such as \"pain-free\" or \"perfect smile\".",
    "Patient testimonials, written or on video.",
    "Before-and-after photographs.",
    "Recorded or broadcast consultations and procedures.",
    "Health information that is inaccurate, out of date, or not reviewed by a dentist.",
    "Oversized signboards. Clause 8.3.1 also treats a self-photograph on a signboard or letterhead as self-advertisement.",
    "Language that reads as soliciting patients: discount offers, referral rewards, or \"book now before slots run out\".",
  ),
  h3("Grey areas nobody has settled yet"),
  ...bullets(
    "**Google reviews shown on your website.** Quoting or embedding them on your own site may look like publishing testimonials. The sources we read lean cautious, and we would leave them off until this is clarified.",
    "**Doctor-explains reels.** General educational videos are not named in the advisory. Clause 8.1.8 of the Code, however, warns against surrogate advertising \"in the garb of educating the public\". Where one ends and the other begins is unclear.",
    "**Team and clinic photographs.** Current photographs of rooms and equipment are factual. The Code's restriction on self-photographs refers to letterheads and signboards, not websites. Keep any photographs of dentists plain.",
    "**Listing fees.** On a plain reading, Clause 8.2.9 allows websites to list treatment facilities and fees. The NDC has not confirmed how it reads that clause alongside the advisory, so treat it as unconfirmed and never frame a fee as an offer.",
  ),
  p(
    "For any of these, a short written question to your state dental council is the safest route. Again, this is general information, not legal advice.",
  ),

  h2("Instagram, reels and WhatsApp"),
  p(
    "The first practice the advisory names is recording and broadcasting consultations and dental procedures. On Instagram that covers chairside clips, treatment time-lapses and a patient's reaction to a finished case.",
  ),
  p(
    "The notice does not say patient consent makes these acceptable. Until the NDC says otherwise, we would treat any recording of a real consultation or procedure as higher risk, with or without consent.",
  ),
  p("Educational content sits in a grey area. If you post it, keep it within these limits:"),
  ...bullets(
    "General information about a condition or treatment, not a particular case.",
    "Reviewed by a dentist before it goes out, with that dentist named.",
    "No identifiable patients, including on a monitor or radiograph.",
    "No outcome claims and no \"results\" framing.",
    "No phone number or booking prompt in the post; Clause 8.1.8 says public information should not carry contact details to attract patients.",
  ),
  p(
    "WhatsApp is different again. Replying to a patient who messaged you is ordinary communication. Broadcasting to people who never contacted the clinic, such as bought number lists, could read as soliciting patients under Clause 8.2. That is our reading, not a ruling, but it is the cautious one.",
  ),

  h2("Patient data: forms, WhatsApp and analytics"),
  p(
    "Separately, India's data protection law applies to the personal data your website and messaging collect. The Digital Personal Data Protection (DPDP) Act, 2023 is being brought into force through the DPDP Rules, 2025, notified in November 2025 with an [18-month phased timeline](" +
      SRC.dpdpPib +
      "). Most day-to-day duties, such as privacy notices, consent, security safeguards and breach notification, are scheduled to apply from around May 2027.",
  ),
  p(
    "There have been [reports in early 2026](" +
      SRC.dpdpShortening +
      ") that the government proposed shortening that window for the largest data handlers, known as Significant Data Fiduciaries. As far as we could find, no change had been notified by the time of writing. Check before you plan around a date.",
  ),
  p("You do not need to wait for a deadline to do the sensible things:"),
  ...bullets(
    "**Collect only what you need.** A name, phone number and preferred time are usually enough.",
    "**Say why you collect it,** in one plain sentence beside the form.",
    "**Keep symptoms and enquiry text out of analytics.** Analytics tools (the software that counts visits and clicks on your site) should record that a form was sent, never what it said.",
    "**Let patients send their own messages.** A WhatsApp button should open a draft the patient edits and sends.",
    "**Know who can see enquiries,** and remove access when someone leaves.",
  ),

  h2("Build a claims register in one afternoon"),
  p(
    "A claims register lists every factual statement your clinic makes in public, with the evidence behind it. It turns one vague question (\"is our website within the rules?\") into small ones you can answer line by line.",
  ),
  p("Open a spreadsheet and give each claim five columns:"),
  ...numbered(
    "**Claim:** the exact words, as published.",
    "**Where it appears:** website page, Google profile, Instagram bio, signboard, visiting card.",
    "**Evidence:** the document or fact that supports it.",
    "**Approved by:** the dentist responsible for it.",
    "**Review date:** when someone last checked it is still true.",
  ),
  p("Three worked examples show how it works."),
  h3("Example 1: \"Registered dentist, BDS\""),
  ...bullets(
    "**Where:** website team page, Google profile description, visiting card.",
    "**Evidence:** the state dental council registration certificate and the BDS degree certificate. Show the registration number beside the name.",
    "**Approved by:** the dentist named.",
    "**Review:** at each renewal, and at least yearly.",
  ),
  h3("Example 2: \"Digital X-ray available\""),
  ...bullets(
    "**Where:** the facilities section of the website.",
    "**Evidence:** the equipment in the clinic today.",
    "**Approved by:** the clinic owner.",
    "**Review:** whenever equipment changes.",
  ),
  h3("Example 3: \"Painless root canals\""),
  ...bullets(
    "**Where:** often a homepage banner or an Instagram caption.",
    "**Evidence:** none can support the word. No dentist can promise how every patient will feel.",
    "**Action:** remove it, or rewrite it as a description of what you do. For example: \"We use local anaesthesia and check in with you during treatment. Tell us if you feel discomfort and we will pause.\"",
    "**Approved by:** the treating dentist, confirming it matches what actually happens.",
  ),
  p(
    "The same discipline applies to clinical pages. In our framework, every treatment page goes through doctor interview, draft, doctor review and publish, and carries a named reviewer and a review date. That alone does not settle any regulatory question. It does mean a dentist stands behind every clinical sentence the clinic publishes.",
  ),

  h2("A 10-point audit for your website, Google profile and Instagram"),
  p(
    "Open your website, your Google Business Profile (the listing that appears in Google Maps and search results) and your Instagram grid side by side, and work through this list:",
  ),
  ...numbered(
    "**Superlatives.** Search every page, caption and bio for words like \"best\", \"leading\", \"advanced\", \"most trusted\" and \"painless\". Remove or rewrite each one.",
    "**Testimonials and before-and-after images.** Check all three channels, including Instagram highlights and old posts.",
    "**Recorded procedures and consultations.** Look for chairside clips, time-lapses and reels filmed during treatment.",
    "**Signage.** Compare your signboard with Clause 8.3: name and qualifications, a size that serves to show the location and entrance, and no photograph of yourself.",
    "**Registration and degrees.** Each dentist's state council registration number should appear where the Code requires it, and only recognised degrees should follow their names.",
    "**Fee and offer language.** Remove \"free check-up this week\", \"flat 20% off\" and festival discounts.",
    "**Health information.** Every clinical page and post should be accurate, current and reviewed by a named dentist.",
    "**Patient data.** Check what your forms ask for, where submissions go, whether your analytics captures enquiry text, and who can read WhatsApp messages.",
    "**Google Business Profile.** The description should state facts, categories should match services you provide, and review replies should never mention a patient's treatment. We cover the profile in more detail in [our guide to dental clinic SEO in Hyderabad](" +
      SRC.articleC +
      ").",
    "**Ownership.** Write down who updates each channel and who approves clinical content. If the answer is \"the agency\", make sure a dentist still approves.",
  ),

  h2("What we don't know yet"),
  p("Several questions remain open as of 1 November 2026:"),
  ...bullets(
    "Whether showing Google reviews on a clinic website counts as publishing testimonials.",
    "Whether general educational reels by a dentist fall under \"recording and broadcasting\", or under the Code's warning about surrogate advertising.",
    "Whether the NDC will notify a new code of ethics to replace the 2014 regulations, and when.",
    "How state dental councils, including Telangana's, will enforce it. We have no information on this and will not guess.",
    "How the DPDP timelines will settle if the proposed shortening goes ahead.",
  ),
  p(
    "We will update this article when the NDC clarifies any of these points or issues a new code. If you spot an error, or your council has given you guidance on any of these questions, please [write to us](" +
      SRC.corrections +
      ") and we will correct it.",
  ),

  h2("Where this leaves your clinic"),
  p(
    "None of this asks you to go quiet online. The Code allows a factual website, and the advisory targets promotion. A clinic that publishes clear facts, checked by its own dentists, has far less to worry about than one leaning on testimonials and reels.",
  ),
  p(
    "If you would like a second view before you start the audit, the next step is a short conversation. Blogspage builds websites for dental clinics, so we have a commercial interest in this subject. This article is general information, not legal advice; for decisions about your own clinic, confirm with your state dental council or a healthcare lawyer.",
  ),
  cta({
    headline: "Want a second pair of eyes on your clinic's digital footprint?",
    body: "We will walk through your website, Google profile and Instagram with you in plain language and note anything worth raising with your dental council. No pitch deck, and no legal advice.",
    primaryLabel: "Talk to our AI",
    secondaryLabel: "See how we work",
    secondaryHref: "/#process",
  }),
];

// ---------------------------------------------------------------- Validation
const ALLOWED_BLOCK_KEYS = new Set(["_type", "_key", "style", "listItem", "level", "children", "markDefs"]);
const ALLOWED_STYLES = new Set(["normal", "h2", "h3", "h4", "blockquote"]);
const DECORATORS = new Set(["strong", "em", "underline", "strike-through", "code"]);
const CTA_FIELDS = ["headline", "body", "primaryLabel", "secondaryLabel", "secondaryHref"] as const;

function plainText(members: Member[]): string {
  return members
    .map((m) => (m._type === "block" ? m.children.map((c) => c.text).join("") : `${m.headline} ${m.body}`))
    .join("\n");
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function validate(): { words: number } {
  const errors: string[] = [];
  const keys = new Set<string>();
  const seeKey = (k: string | undefined, where: string) => {
    if (!k) errors.push(`Missing _key: ${where}`);
    else if (keys.has(k)) errors.push(`Duplicate _key ${k}: ${where}`);
    else keys.add(k);
  };

  if (META_DESCRIPTION.length < 120 || META_DESCRIPTION.length > 160)
    errors.push(`metaDescription is ${META_DESCRIPTION.length} chars (need 120-160)`);
  if (SEO_TITLE.length > 60) errors.push(`seoTitle is ${SEO_TITLE.length} chars (max 60)`);
  if (EXCERPT.length < 50 || EXCERPT.length > 200) errors.push(`excerpt is ${EXCERPT.length} chars (need 50-200)`);
  if (SEO_KEYWORDS.length < 6 || SEO_KEYWORDS.length > 8) errors.push(`seoKeywords has ${SEO_KEYWORDS.length} items`);

  let ctaCount = 0;
  content.forEach((m, i) => {
    const where = `content[${i}]`;
    seeKey(m._key, where);
    if (m._type === "ctaBlock") {
      ctaCount++;
      for (const f of CTA_FIELDS) if (!m[f]?.trim()) errors.push(`${where} ctaBlock missing ${f}`);
      if (!(m.secondaryHref.startsWith("/") || /^https?:\/\//.test(m.secondaryHref)))
        errors.push(`${where} ctaBlock secondaryHref invalid`);
      return;
    }
    if (m._type !== "block") {
      errors.push(`${where} unexpected _type ${(m as { _type: string })._type}`);
      return;
    }
    for (const k of Object.keys(m)) if (!ALLOWED_BLOCK_KEYS.has(k)) errors.push(`${where} illegal field "${k}"`);
    if (m.style === "h1") errors.push(`${where} uses h1`);
    if (!ALLOWED_STYLES.has(m.style)) errors.push(`${where} illegal style ${m.style}`);
    if (m.listItem && !["bullet", "number"].includes(m.listItem)) errors.push(`${where} illegal listItem`);
    if (m.listItem && m.style !== "normal") errors.push(`${where} list item with style ${m.style}`);
    const defKeys = new Set<string>();
    m.markDefs.forEach((d, j) => {
      seeKey(d._key, `${where}.markDefs[${j}]`);
      defKeys.add(d._key);
      if (d._type !== "link" || !d.href) errors.push(`${where} invalid markDef`);
      else if (!/^(https?:\/\/|mailto:)/.test(d.href)) errors.push(`${where} link href not absolute: ${d.href}`);
    });
    if (!m.children.length) errors.push(`${where} has no children`);
    m.children.forEach((c, j) => {
      const cw = `${where}.children[${j}]`;
      if (Array.isArray(c) || c._type !== "span") errors.push(`${cw} is not a span`);
      seeKey(c._key, cw);
      if (typeof c.text !== "string" || !c.text) errors.push(`${cw} empty text`);
      for (const mk of c.marks) if (!DECORATORS.has(mk) && !defKeys.has(mk)) errors.push(`${cw} orphan mark ${mk}`);
      if (/\*\*|\]\(/.test(c.text)) errors.push(`${cw} unparsed markup: ${c.text}`);
    });
    if ((m.style === "h2" || m.style === "h3") && m.children.some((c) => c.marks.length))
      errors.push(`${where} heading has marks`);
  });
  if (ctaCount !== 1) errors.push(`Expected exactly 1 ctaBlock, found ${ctaCount}`);
  if (content[content.length - 1]._type !== "ctaBlock") errors.push("ctaBlock is not the last member");

  const body = plainText(content);
  const words = countWords(body);
  if (words < WORD_TARGET.min || words > WORD_TARGET.max)
    errors.push(`Word count ${words} outside ${WORD_TARGET.min}-${WORD_TARGET.max}`);

  // Banned phrases across everything a reader can see.
  const allText = [TITLE, SEO_TITLE, META_DESCRIPTION, EXCERPT, body].join("\n");
  const banned: [RegExp, string][] = [
    [/HIPAA/i, "HIPAA"],
    [/best dentist/i, "best dentist"],
    [/guarantee/i, "guarantee/guaranteed"],
    [/100\s?%/, "100%"],
    [/#1\b/, "#1"],
    [/number one/i, "number one"],
    [/top-rated/i, "top-rated"],
    [/!/, "exclamation mark"],
  ];
  for (const [re, label] of banned) if (re.test(allText)) errors.push(`Banned phrase found: ${label}`);

  // Primary keyword placement (case-insensitive, allowing "in").
  const kw = /dentist advertising rules (in )?India/i;
  const first100 = body.split(/\s+/).slice(0, 100).join(" ");
  if (!kw.test(first100)) errors.push("Primary keyword missing from first 100 words");
  const h2Texts = content.filter((m): m is Block => m._type === "block" && m.style === "h2").map((b) => b.children.map((c) => c.text).join(""));
  if (!h2Texts.some((t) => kw.test(t))) errors.push("Primary keyword missing from every H2");

  // Required substance checks.
  if (!/1 November 2026/.test(body)) errors.push("Missing date stamp");
  if (!/commercial interest/.test(body)) errors.push("Missing disclosure");
  if ((body.match(/not legal advice/g) ?? []).length < 2) errors.push("Not-legal-advice note should appear at least twice");
  if ((body.match(/13\.8%/g) ?? []).length !== 1) errors.push("IJME statistic must appear exactly once");
  const emDashes = (allText.match(/\u2014/g) ?? []).length;
  if (emDashes > 0) errors.push(`Em dashes found: ${emDashes}`);

  const linkCount = content.reduce((n, m) => n + (m._type === "block" ? m.markDefs.length : 0), 0);
  const firstWords = countWords(first100);

  console.log("Validation summary");
  console.log(`  title:            ${TITLE.length} chars`);
  console.log(`  seoTitle:         ${SEO_TITLE.length} chars (max 60)`);
  console.log(`  metaDescription:  ${META_DESCRIPTION.length} chars (120-160)`);
  console.log(`  excerpt:          ${EXCERPT.length} chars (50-200)`);
  console.log(`  seoKeywords:      ${SEO_KEYWORDS.length}`);
  console.log(`  content members:  ${content.length} (keys checked: ${keys.size})`);
  console.log(`  links:            ${linkCount}`);
  console.log(`  word count:       ${words} (target ${WORD_TARGET.min}-${WORD_TARGET.max}); first-100 window ${firstWords}`);
  console.log(`  H2s:              ${h2Texts.length}`);

  if (errors.length) {
    console.error(`\nValidation FAILED (${errors.length}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log("  result:           PASS\n");
  return { words };
}

// ---------------------------------------------------------------- Banner
const BANNER_ALT =
  "Dark blue banner with the words \"Information, not promotion\" and a line reading \"Dental websites and social media after the NDC advisory\" beside a simple pattern of concentric circles.";

async function renderBanner(): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0c18"/>
      <stop offset="1" stop-color="#171c45"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g fill="none" stroke="#828FFF">
    <circle cx="1290" cy="450" r="90"  stroke-opacity="0.55" stroke-width="2"/>
    <circle cx="1290" cy="450" r="170" stroke-opacity="0.35" stroke-width="2"/>
    <circle cx="1290" cy="450" r="250" stroke-opacity="0.22" stroke-width="2"/>
    <circle cx="1290" cy="450" r="330" stroke-opacity="0.12" stroke-width="2"/>
  </g>
  <rect x="120" y="300" width="72" height="6" fill="#828FFF"/>
  <text x="120" y="420" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="92" font-weight="600" fill="#F2F3FA">Information,</text>
  <text x="120" y="530" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="92" font-weight="600" fill="#F2F3FA">not promotion.</text>
  <text x="120" y="610" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34" fill="#A9B0E8">Dental websites and social media after the NDC advisory</text>
</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

// ---------------------------------------------------------------- Main
async function main() {
  const { words } = validate();
  const png = await renderBanner();
  const localPng = join(tmpdir(), "article-b-banner.png");
  writeFileSync(localPng, png);
  const meta = await sharp(png).metadata();
  console.log(`Banner rendered: ${meta.width}x${meta.height}, ${png.length} bytes -> ${localPng}`);

  if (DRY_RUN) {
    console.log("\nDry run: nothing written to Sanity.");
    return;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = process.env.SANITY_WRITE_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-06-14";
  if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  if (!token) throw new Error("Missing SANITY_WRITE_TOKEN in .env.local");
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

  // Safety: never touch the published document.
  const published = await client.getDocument(PUBLISHED_ID);
  if (published) throw new Error(`A published document ${PUBLISHED_ID} already exists. Refusing to continue.`);
  const slugClash = await client.fetch<string[]>(
    `*[_type == "post" && slug.current == $slug && !(_id in [$draft, $pub])]._id`,
    { slug: SLUG, draft: DRAFT_ID, pub: PUBLISHED_ID },
  );
  if (slugClash.length) throw new Error(`Slug already used by: ${slugClash.join(", ")}`);

  const cat = await client.createIfNotExists(CATEGORY);
  console.log(`Category ready: ${cat.title} (${cat._id})`);

  const asset = await client.assets.upload("image", png, {
    filename: "dental-ndc-advisory-banner.png",
    contentType: "image/png",
  });
  console.log(`Banner uploaded: ${asset._id}`);

  const imageRef = { _type: "reference" as const, _ref: asset._id };
  const doc = {
    _id: DRAFT_ID,
    _type: "post" as const,
    title: TITLE,
    slug: { _type: "slug" as const, current: SLUG },
    excerpt: EXCERPT,
    author: { _type: "reference" as const, _ref: "author-ravi" },
    mainImage: { _type: "image" as const, alt: BANNER_ALT, asset: imageRef },
    categories: [{ _type: "reference" as const, _ref: CATEGORY._id, _key: key("cat") }],
    publishedAt: new Date().toISOString(),
    content,
    focusKeyword: PRIMARY_KEYWORD,
    seoKeywords: SEO_KEYWORDS,
    seoTitle: SEO_TITLE,
    metaDescription: META_DESCRIPTION,
    ogImage: { _type: "image" as const, alt: BANNER_ALT, asset: imageRef },
  };

  const res = await client.createOrReplace(doc);
  console.log(`Draft written: ${res._id} (rev ${res._rev}), ${words} words`);
}

main().catch((error) => {
  console.error("article-b failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
