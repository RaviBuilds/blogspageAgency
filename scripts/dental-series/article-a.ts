/**
 * Dental series, Article A: do dentists need a website if they already have
 * Google, Instagram and WhatsApp?
 *
 * Creates (or replaces) a Sanity DRAFT only: `drafts.post-do-dentists-need-a-website`.
 * Never publishes. Ensures the "Dental & Healthcare" category exists
 * (createIfNotExists: an existing category is left untouched).
 *
 * Usage (Node 22.6+ runs TypeScript natively; no tsx needed):
 *   node scripts/dental-series/article-a.ts --dry-run   # validate + render images only
 *   node scripts/dental-series/article-a.ts             # validate, upload images, write draft
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
const PUBLISHED_ID = "post-do-dentists-need-a-website";
const DRAFT_ID = `drafts.${PUBLISHED_ID}`;
const SLUG = "do-dentists-need-a-website";
const TITLE = "Do Dentists Need a Website If They Already Have Google, Instagram and WhatsApp?";
const SEO_TITLE = "Do Dentists Need a Website? Google, Instagram, WhatsApp";
const META_DESCRIPTION =
  "Google helps patients find your dental clinic, but a website helps them understand it. Here is what each channel does, where it stops, and what to fix first.";
const EXCERPT =
  "Google, Instagram and WhatsApp help patients find and contact your clinic. A website helps them understand it. When it matters, when it doesn't, and a 20-minute audit.";
const PRIMARY_KEYWORD = "do dentists need a website";
const SEO_KEYWORDS = [
  "do dentists need a website",
  "dental clinic website India",
  "dentist website vs Google Business Profile",
  "Instagram vs website for dental clinic",
  "dental clinic digital presence",
  "website for dental clinic Hyderabad",
  "Practo vs own website for dentists",
];
const CATEGORY = {
  _id: "category-dental-healthcare",
  _type: "category" as const,
  title: "Dental & Healthcare",
  slug: { _type: "slug" as const, current: "dental-healthcare" },
  description:
    "Websites, local search and professional ethics for dental clinics and healthcare practices in India.",
};
const WORD_TARGET = { min: 2000, max: 2500 };

// ---------------------------------------------------------------- Sources
const SRC = {
  gbpRanking: "https://support.google.com/business/answer/7091",
  gbpVerify: "https://support.google.com/business/answer/7107242",
  ndcAdvisory: "https://dciindia.gov.in/Admin/NewsArchives/M-2672.pdf",
  code2014:
    "https://rsdcjpr.org/uploads/Gazette_Notification_reg_DCI_Revised_Dentists_Code_of_Ethics_Regulations_2014_1744098614.pdf",
  articleB: "https://blogspage.com/blogs/dental-website-social-media-rules-india-ndc-advisory",
  articleC: "https://blogspage.com/blogs/dental-clinic-seo-hyderabad-google-maps",
};
/** Internal links open in the same tab (renderer honours blank === false). */
const INTERNAL = new Set([SRC.articleB, SRC.articleC]);

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
type ImageMember = {
  _type: "image";
  _key: string;
  alt: string;
  asset: { _type: "reference"; _ref: string };
};
type Member = Block | Cta | ImageMember;

/** Inline markup: [text](url) for links, **text** for strong, _text_ for em. No nesting. */
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

const PENDING_REF = "pending-upload";
const DIAGRAM_ALT =
  "Diagram of a patient's path from left to right: Google listing, reviews, Instagram, WhatsApp, then the clinic website, which is highlighted as the place where the six questions get answered.";
const diagram: ImageMember = {
  _type: "image",
  _key: key("img"),
  alt: DIAGRAM_ALT,
  asset: { _type: "reference", _ref: PENDING_REF },
};

// ---------------------------------------------------------------- Content
const content: Member[] = [
  p(
    "A patient in Kukatpally searches for a dentist and finds your Google listing. They see your rating, your timings and a phone number. Then the real questions start. Who will treat me? Do they do what I need? What happens at the first visit? Google has done its job, and the answers have nowhere to live.",
  ),

  h2("Do dentists need a website? The short answer"),
  p(
    "Usually, yes, for one specific reason. Google, Instagram and WhatsApp help patients find you and contact you. A website is where they understand you: who the doctors are, what you treat, and what to expect. Being found and being understood are two different jobs, and many clinics have only covered the first.",
  ),
  p(
    "This article covers what each channel does well and where it stops, the questions patients tend to have before they call, the five jobs a dental clinic website should do, and the cases where a website is not the first thing to fix. It ends with a 20-minute audit you can do from your phone.",
  ),
  p(
    "We wrote this on 1 November 2026. The core argument changes slowly. Platform features, Google's guidance and the regulatory position for dentists can change faster, and we will update the article when they do.",
  ),

  h2("What each channel does well, and where it stops"),
  p(
    "Each of these channels is worth having. The useful question is what each one can carry, and what it cannot.",
  ),
  ...bullets(
    "**Google Business Profile and Maps.** Does well: puts your address, hours, phone number and directions in front of people searching nearby. Stops: it is a listing in a format Google controls, with little room to explain a treatment or introduce a doctor properly.",
    "**Reviews.** Does well: show that real people have visited and what they noticed. Stops: they are written by patients, in their words, about one visit. You cannot use them to explain anything, and a public reply should never mention a patient's treatment.",
    "**Instagram.** Does well: shows the character of the clinic, its team and its space, to people who already follow you. Stops: posts scroll away, specific information is hard to find later, and the platform's algorithm (the system that decides who sees which post) decides your reach.",
    "**WhatsApp.** Does well: the easiest way for a patient to start a conversation. Stops: it only works once the patient has already decided to ask, and it depends on someone at the clinic replying.",
    "**Directory and marketplace listings.** Does well: platforms such as Practo let patients compare clinics and find contact details in one place. Stops: the platform decides how your page looks and where it appears, and your page sits next to other clinics.",
    "**Your own website.** Does well: the one place you control, where every answer can be set out in order and kept current. Stops: it does little on its own if nobody reaches it, which is why it works alongside the others, not instead of them.",
  ),
  p(
    "Google discovery deserves its own guide, and we cover the profile and Maps step by step in [our guide to dental clinic SEO in Hyderabad](" +
      SRC.articleC +
      "). One point from Google's own help pages is worth knowing here. [Google says local results are based mainly on relevance, distance and prominence](" +
      SRC.gbpRanking +
      "), and that there is no way to pay for a better local ranking. A website can support that picture with clear, consistent information. It cannot override it, and nobody can promise you a position.",
  ),

  h2("The information gap: six questions patients ask before they call"),
  p(
    "In the way we think about clinic websites, a new patient's questions before the first call tend to fall into six groups:",
  ),
  ...numbered(
    "Who are the doctors, and what are their qualifications?",
    "What treatments does the clinic offer?",
    "What does the clinic actually look like?",
    "What should I expect at the first visit?",
    "Is this clinic suitable for my concern?",
    "What makes this clinic different from the others nearby?",
  ),
  p(
    "A Google listing answers part of the second and third questions. Instagram may answer the third. Reviews hint at the sixth. None of them is built to answer the first, fourth or fifth in any depth. When the answers are scattered across four or five places, the patient has to assemble the picture themselves.",
  ),
  p(
    "What follows is our observation and inference, not a measured finding. When one clinic answers these questions clearly in one place and another does not, the first one may be the clinic that gets the call. That is not necessarily because it is the better clinic. The patient simply understood it better.",
  ),
  diagram,
  p(
    "You can test this against your own enquiries. Ask your reception team what new patients say they were unsure about before they called, or what they ask in the first WhatsApp message. If the same questions keep coming up, those are the answers missing from your public information.",
  ),

  h2("What a dental clinic website is for: five jobs"),
  p(
    "Our framework gives a clinic website five jobs. None of them is about looking impressive. Each one maps to something a dentist will recognise from the chair or the front desk.",
  ),
  h3("1. Discover"),
  p(
    "Accurate, consistent information about the clinic, its location and its treatments, which supports how patients already find you on Google and Maps. The website does not replace your Google profile. It backs it up with detail that search engines can read and link to.",
  ),
  h3("2. Trust"),
  p(
    "Evidence instead of adjectives. That means a profile for each dentist with their name, recognised qualifications and state dental council registration number, written exactly as the certificates show. It means clinical pages that name the dentist who reviewed them and the date of the review. And it means current photographs of the clinic as it is today, not stock images.",
  ),
  h3("3. Understand"),
  p(
    "Plain explanations of each treatment you offer: what it is, what the process generally involves, what can change the plan, and what a patient might ask at consultation. Honest notes on what affects time and cost help more than a price list. A website never diagnoses. That stays with the dentist.",
  ),
  h3("4. Prepare"),
  p(
    "What happens at a first visit, what to bring and roughly how long it takes. A short page for anxious patients on how to tell the team and what the appointment will look like. Pages like these carry little clinical risk, and they save reception from answering the same questions every day.",
  ),
  h3("5. Connect"),
  p(
    "Call, WhatsApp and Directions, easy to reach on every page of a phone screen. Urgent concerns should be pointed to a phone call, not a form. Add an enquiry form only if someone will answer it, ask only for what you need, and keep anything patients type out of your analytics tools. India's DPDP Act 2023 and DPDP Rules 2025 are bringing in formal duties for how that data is handled.",
  ),

  h2("What a clinic website should not do"),
  p(
    "A clinic website should inform, not promote. That rules out superlatives such as \"leading\" or \"most trusted\", patient testimonials, before-and-after galleries, countdown offers and \"limited slots\" banners, and promises about results.",
  ),
  p(
    "This matters more than it did a month ago. On 14 October 2026 the National Dental Commission issued an [advisory to all registered dentists](" +
      SRC.ndcAdvisory +
      ") that names, among other practices, publishing patient testimonials and before-and-after photographs, and self-aggrandising publicity. It points back to the Revised Dentists (Code of Ethics) Regulations, 2014, which [allow clinic websites where all the information is factual](" +
      SRC.code2014 +
      "). We go through what the advisory says, and what it means for your website and Instagram, in [our guide to the NDC advisory](" +
      SRC.articleB +
      ").",
  ),
  p(
    "This is general information, not legal advice. For decisions about your own clinic, confirm with your state dental council or a healthcare lawyer.",
  ),

  h2("When a website is not your first fix"),
  p(
    "Sometimes a website is the wrong place to start, and it would be unfair to tell you otherwise. If any of these is true, fix it first:",
  ),
  ...bullets(
    "**Your Google profile is unclaimed, or shows the wrong hours or phone number.** That listing is often the first thing a patient sees. Claim it, [verify it through Google](" +
      SRC.gbpVerify +
      "), correct the details, and check it again whenever anything changes at the clinic. This costs time, not money.",
    "**WhatsApp messages sit unanswered.** A website that sends more enquiries to an inbox nobody watches makes things worse, not better. Decide who replies, how quickly, and what they say to the common questions. No website can make up for a team that is unavailable or unprepared.",
    "**You cannot yet state each doctor's qualifications and registration consistently.** Gather the degree certificates and state council registration numbers, and agree how each name will be written. Every other page builds on this.",
    "**Your basic details differ from place to place.** If the address, phone number or timings on your signboard, Google profile, Instagram bio and directory listings do not match, correct them so they are identical.",
  ),
  p(
    "Once those basics are right, the website is the layer that gives them a permanent, structured home. It is where the facts on Google, the character on Instagram and the conversation on WhatsApp come together, in an order a patient can follow.",
  ),

  h2("A 20-minute self-audit you can do from your phone"),
  p(
    "Use your phone, ideally on mobile data rather than the clinic Wi-Fi, so you see roughly what a patient sees. Keep a note of what you find.",
  ),
  ...numbered(
    "**Search your clinic's name.** Note what appears first: your Google profile, a directory page, an old listing or your website. Is it all clearly you, and is anything out of date?",
    "**Check your Google profile's hours, phone and address.** Compare them with what is true this week, including holidays. Call the number shown and see who answers.",
    "**Search \"dentist near me\" from your locality.** Stand near the clinic and note which clinics appear and what each one shows: photographs, hours, a website link. Look at it as a patient comparing options, not as a contest for position.",
    "**Look for your doctors' qualifications in one place.** Can a stranger find every dentist's name, recognised degrees and registration number without messaging you?",
    "**Send a WhatsApp enquiry as a patient.** Use a number the team does not know. Time the reply, and read it the way a nervous patient would.",
    "**Ask someone who does not know the clinic to find \"what to expect at a first visit\".** Give them five minutes and watch where they look.",
    "**Check that your information matches everywhere.** Name, address, phone and timings should be the same on the signboard, Google profile, Instagram bio, directory listings and visiting cards.",
  ),
  p(
    "Problems in checks 2, 5 or 7 are basics to fix before anything else. Gaps in checks 4 and 6 are exactly the gaps a website is built to fill. Check 3 tells you how much your listing has to work against nearby clinics.",
  ),

  h2("Why it matters in Hyderabad"),
  p(
    "In many parts of the city, several dental clinics sit within a few kilometres of each other. In Banjara Hills, Madhapur, Kukatpally or Secunderabad, a patient searching nearby may see a handful of options on one screen. Our inference is that when comparing is this easy, clarity counts for more, and the clinic that answers the six questions plainly is easier to choose. We have no local data that measures this, so treat it as reasoned judgement.",
  ),
  p("A website is also the natural home for practical details that a listing squeezes or leaves out:"),
  ...bullets(
    "The languages your team actually speaks, whether Telugu, Urdu, Hindi or English. List only what is true for the people on shift.",
    "The nearest metro station and roughly how long the walk is.",
    "Parking: where it is, and whether it is free.",
    "A landmark patients recognise, so directions over the phone take one sentence.",
    "Step-free access, or the lack of it, for older patients and parents with young children.",
  ),

  h2("Next step"),
  p(
    "If you have worked through the audit, you already know whether your next move is a Google fix, a reception fix or a website. Whichever it is, the useful conversation starts from what you have today, not from a template.",
  ),
  p(
    "Blogspage builds websites for dental clinics, so we have a commercial interest in this question. We have tried to be fair about when a website is not the answer.",
  ),
  cta({
    headline: "Not sure what your clinic's digital footprint looks like today?",
    body: "Tell us about your clinic and we will walk through your Google profile, Instagram and enquiry path with you in plain language. We start with what you already have and a conversation with your doctors and reception team.",
    primaryLabel: "Talk to our AI",
    secondaryLabel: "See how we work",
    secondaryHref: "/#process",
  }),
];

// ---------------------------------------------------------------- Validation
const ALLOWED_BLOCK_KEYS = new Set(["_type", "_key", "style", "listItem", "level", "children", "markDefs"]);
const ALLOWED_IMAGE_KEYS = new Set(["_type", "_key", "alt", "asset", "caption"]);
const ALLOWED_STYLES = new Set(["normal", "h2", "h3", "h4", "blockquote"]);
const DECORATORS = new Set(["strong", "em", "underline", "strike-through", "code"]);
const CTA_FIELDS = ["headline", "body", "primaryLabel", "secondaryLabel", "secondaryHref"] as const;

function plainText(members: Member[]): string {
  return members
    .map((m) =>
      m._type === "block" ? m.children.map((c) => c.text).join("") : m._type === "ctaBlock" ? `${m.headline} ${m.body}` : "",
    )
    .join("\n");
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function validate(requireAssets: boolean): { words: number } {
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
  let imageCount = 0;
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
    if (m._type === "image") {
      imageCount++;
      for (const k of Object.keys(m)) if (!ALLOWED_IMAGE_KEYS.has(k)) errors.push(`${where} illegal image field "${k}"`);
      if (!m.alt?.trim()) errors.push(`${where} image missing alt`);
      if (requireAssets && !/^image-/.test(m.asset._ref)) errors.push(`${where} image asset not uploaded`);
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
  if (imageCount !== 1) errors.push(`Expected exactly 1 in-body diagram, found ${imageCount}`);

  const body = plainText(content);
  const words = countWords(body);
  if (words < WORD_TARGET.min || words > WORD_TARGET.max)
    errors.push(`Word count ${words} outside ${WORD_TARGET.min}-${WORD_TARGET.max}`);

  // Banned phrases across everything a reader can see.
  const allText = [TITLE, SEO_TITLE, META_DESCRIPTION, EXCERPT, DIAGRAM_ALT, BANNER_ALT, body].join("\n");
  const banned: [RegExp, string][] = [
    [/HIPAA/i, "HIPAA"],
    [/best dentist/i, "best dentist"],
    [/guarantee/i, "guarantee/guaranteed"],
    [/100\s?%/, "100%"],
    [/#1\b/, "#1"],
    [/number one/i, "number one"],
    [/top-rated/i, "top-rated"],
    [/!/, "exclamation mark"],
    [/\d+(\.\d+)?\s?%/, "percentage (no statistics allowed in this article)"],
  ];
  for (const [re, label] of banned) if (re.test(allText)) errors.push(`Banned phrase found: ${label}`);

  // Primary keyword placement.
  const kw = /do dentists need a website/i;
  const first100 = body.split(/\s+/).slice(0, 100).join(" ");
  if (!kw.test(TITLE)) errors.push("Primary keyword missing from title");
  if (!kw.test(SEO_TITLE)) errors.push("Primary keyword missing from seoTitle");
  if (!kw.test(first100)) errors.push("Primary keyword missing from first 100 words");
  const h2Texts = content
    .filter((m): m is Block => m._type === "block" && m.style === "h2")
    .map((b) => b.children.map((c) => c.text).join(""));
  if (!h2Texts.some((t) => kw.test(t))) errors.push("Primary keyword missing from every H2");

  // Required substance checks.
  if (!/1 November 2026/.test(body)) errors.push("Missing date stamp");
  if (!/commercial interest/.test(body)) errors.push("Missing disclosure");
  if (!/not legal advice/.test(body)) errors.push("Missing not-legal-advice note");
  if ((body.match(/Practo/g) ?? []).length !== 1) errors.push("Practo must be named exactly once");
  if (!body.includes(SRC.articleB) && !content.some((m) => m._type === "block" && m.markDefs.some((d) => d.href === SRC.articleB)))
    errors.push("Missing link to Article B");
  if (!content.some((m) => m._type === "block" && m.markDefs.some((d) => d.href === SRC.articleC)))
    errors.push("Missing link to Article C");
  const emDashes = (allText.match(/\u2014/g) ?? []).length;
  if (emDashes > 0) errors.push(`Em dashes found: ${emDashes}`);

  const linkCount = content.reduce((n, m) => n + (m._type === "block" ? m.markDefs.length : 0), 0);

  console.log("Validation summary");
  console.log(`  title:            ${TITLE.length} chars`);
  console.log(`  seoTitle:         ${SEO_TITLE.length} chars (max 60)`);
  console.log(`  metaDescription:  ${META_DESCRIPTION.length} chars (120-160)`);
  console.log(`  excerpt:          ${EXCERPT.length} chars (50-200)`);
  console.log(`  seoKeywords:      ${SEO_KEYWORDS.length}`);
  console.log(`  content members:  ${content.length} (keys checked: ${keys.size})`);
  console.log(`  links:            ${linkCount}`);
  console.log(`  in-body images:   ${imageCount}`);
  console.log(`  word count:       ${words} (target ${WORD_TARGET.min}-${WORD_TARGET.max})`);
  console.log(`  H2s:              ${h2Texts.length}`);

  if (errors.length) {
    console.error(`\nValidation FAILED (${errors.length}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log("  result:           PASS\n");
  return { words };
}

// ---------------------------------------------------------------- Images
const FONT = "Segoe UI, Helvetica, Arial, sans-serif";
const BANNER_ALT =
  "Dark blue banner with the words \"Found is not the same as understood\" and a line reading \"Do dentists need a website?\" beside a row of four small outlined circles leading to one larger filled circle.";

async function renderBanner(): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0c18"/>
      <stop offset="1" stop-color="#171c45"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect x="120" y="250" width="72" height="6" fill="#828FFF"/>
  <text x="120" y="370" font-family="${FONT}" font-size="92" font-weight="600" fill="#F2F3FA">Found is not the same</text>
  <text x="120" y="480" font-family="${FONT}" font-size="92" font-weight="600" fill="#F2F3FA">as understood.</text>
  <text x="120" y="560" font-family="${FONT}" font-size="34" fill="#A9B0E8">Do dentists need a website?</text>
  <g stroke="#828FFF" stroke-width="2" fill="none">
    <line x1="140" y1="720" x2="1060" y2="720" stroke-opacity="0.35"/>
    <circle cx="140" cy="720" r="16" stroke-opacity="0.6" fill="#0f1230"/>
    <circle cx="370" cy="720" r="16" stroke-opacity="0.6" fill="#0f1230"/>
    <circle cx="600" cy="720" r="16" stroke-opacity="0.6" fill="#0f1230"/>
    <circle cx="830" cy="720" r="16" stroke-opacity="0.6" fill="#0f1230"/>
  </g>
  <circle cx="1060" cy="720" r="30" fill="#828FFF"/>
</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

async function renderDiagram(): Promise<Buffer> {
  const W = 1600;
  const H = 760;
  const steps = ["Google listing", "Reviews", "Instagram", "WhatsApp", "Website"];
  const boxW = 260;
  const boxH = 128;
  const gap = (W - 2 * 70 - steps.length * boxW) / (steps.length - 1);
  const y = 290;
  const parts: string[] = [];
  steps.forEach((label, i) => {
    const x = 70 + i * (boxW + gap);
    const isSite = i === steps.length - 1;
    parts.push(
      `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="18" fill="${isSite ? "#828FFF" : "#141838"}" stroke="${isSite ? "#828FFF" : "#3a4180"}" stroke-width="3"/>`,
      `<text x="${x + boxW / 2}" y="${y + boxH / 2 + 13}" text-anchor="middle" font-family="${FONT}" font-size="33" font-weight="600" fill="${isSite ? "#0a0c18" : "#F2F3FA"}">${label}</text>`,
    );
    if (i < steps.length - 1) {
      const ax = x + boxW + 10;
      const bx = x + boxW + gap - 10;
      const ay = y + boxH / 2;
      parts.push(
        `<line x1="${ax}" y1="${ay}" x2="${bx - 14}" y2="${ay}" stroke="#A9B0E8" stroke-width="4"/>`,
        `<polygon points="${bx},${ay} ${bx - 18},${ay - 11} ${bx - 18},${ay + 11}" fill="#A9B0E8"/>`,
      );
    }
  });
  const siteX = 70 + (steps.length - 1) * (boxW + gap);
  const siteCx = siteX + boxW / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0b0d1c"/>
  <text x="70" y="120" font-family="${FONT}" font-size="48" font-weight="600" fill="#F2F3FA">A patient's path before the first call</text>
  <text x="70" y="180" font-family="${FONT}" font-size="32" fill="#A9B0E8">Each step helps. Only one is yours to shape.</text>
  ${parts.join("\n  ")}
  <line x1="${siteCx}" y1="${y + boxH + 14}" x2="${siteCx}" y2="${y + boxH + 74}" stroke="#828FFF" stroke-width="3"/>
  <text x="${siteX + boxW}" y="${y + boxH + 122}" text-anchor="end" font-family="${FONT}" font-size="34" font-weight="600" fill="#828FFF">Where the six questions get answered</text>
  <text x="70" y="${H - 50}" font-family="${FONT}" font-size="26" fill="#6f76a8">Illustrative. Not every patient follows this path.</text>
</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

// ---------------------------------------------------------------- Main
async function main() {
  validate(false);
  const banner = await renderBanner();
  const diagramPng = await renderDiagram();
  for (const [name, buf] of [
    ["article-a-banner.png", banner],
    ["article-a-diagram.png", diagramPng],
  ] as const) {
    const path = join(tmpdir(), name);
    writeFileSync(path, buf);
    const meta = await sharp(buf).metadata();
    console.log(`Rendered ${name}: ${meta.width}x${meta.height}, ${buf.length} bytes -> ${path}`);
  }

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

  // Safety: never touch a published document or another post's slug.
  const published = await client.getDocument(PUBLISHED_ID);
  if (published) throw new Error(`A published document ${PUBLISHED_ID} already exists. Refusing to continue.`);
  const slugClash = await client.fetch<string[]>(
    `*[_type == "post" && slug.current == $slug && !(_id in [$draft, $pub])]._id`,
    { slug: SLUG, draft: DRAFT_ID, pub: PUBLISHED_ID },
  );
  if (slugClash.length) throw new Error(`Slug already used by: ${slugClash.join(", ")}`);

  const cat = await client.createIfNotExists(CATEGORY);
  console.log(`Category ready: ${cat.title} (${cat._id})`);

  const bannerAsset = await client.assets.upload("image", banner, {
    filename: "dental-do-dentists-need-a-website-banner.png",
    contentType: "image/png",
  });
  const diagramAsset = await client.assets.upload("image", diagramPng, {
    filename: "dental-patient-path-diagram.png",
    contentType: "image/png",
  });
  console.log(`Uploaded banner ${bannerAsset._id}`);
  console.log(`Uploaded diagram ${diagramAsset._id}`);
  diagram.asset._ref = diagramAsset._id;

  const { words } = validate(true);

  const imageRef = { _type: "reference" as const, _ref: bannerAsset._id };
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
  console.error("article-a failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
