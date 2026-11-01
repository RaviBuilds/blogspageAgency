/**
 * Dental series, Article C: how Hyderabad dental clinics get found on Google
 * Maps and understood once patients click.
 *
 * Creates (or replaces) a Sanity DRAFT only: `drafts.post-dental-seo-hyderabad`.
 * Never publishes. Ensures the "Dental & Healthcare" category exists
 * (createIfNotExists: an existing category is left untouched).
 *
 * Usage (Node 22.6+ runs TypeScript natively; no tsx needed):
 *   node scripts/dental-series/article-c.ts --dry-run   # validate + render images only
 *   node scripts/dental-series/article-c.ts             # validate, upload images, write draft
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
const PUBLISHED_ID = "post-dental-seo-hyderabad";
const DRAFT_ID = `drafts.${PUBLISHED_ID}`;
const SLUG = "dental-clinic-seo-hyderabad-google-maps";
const TITLE = "How Hyderabad Dental Clinics Get Found on Google Maps and Understood Once Patients Click";
const SEO_TITLE = "Dental Clinic SEO in Hyderabad: Maps, Profile, Website";
const META_DESCRIPTION =
  "A practical local SEO guide for Hyderabad dentists: set up Google Business Profile, build supporting pages, and measure results without tracking patient data.";
const EXCERPT =
  "Five steps and a 30-day plan for Hyderabad dental clinics: Google Business Profile, supporting website pages, careful reviews, technical basics and privacy-safe measurement.";
const PRIMARY_KEYWORD = "dental clinic SEO Hyderabad";
const SEO_KEYWORDS = [
  "dental clinic SEO Hyderabad",
  "Google Business Profile for dentists",
  "how to rank dental clinic on Google Maps",
  "local SEO for dentists India",
  "dentist near me ranking",
  "dental clinic Search Console",
  "dental clinic website Hyderabad",
];
const CATEGORY = {
  _id: "category-dental-healthcare",
  _type: "category" as const,
  title: "Dental & Healthcare",
  slug: { _type: "slug" as const, current: "dental-healthcare" },
  description:
    "Websites, local search and professional ethics for dental clinics and healthcare practices in India.",
};
const WORD_TARGET = { min: 2300, max: 2900 };
const DENTAL_SOLUTIONS_HREF = "/solutions/dental-hospital-business-solution-website-at-hyderabad";

// ---------------------------------------------------------------- Sources
const SRC = {
  gbpRanking: "https://support.google.com/business/answer/7091",
  gbpGuidelines: "https://support.google.com/business/answer/3038177",
  gbpVerify: "https://support.google.com/business/answer/7107242",
  gbpServices: "https://support.google.com/business/answer/9455399",
  mapsContentPolicy: "https://support.google.com/contributionpolicy/answer/7400114",
  spamPolicies: "https://developers.google.com/search/docs/essentials/spam-policies",
  sdPolicies: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
  dpdpPib:
    "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf",
  articleA: "https://blogspage.com/blogs/do-dentists-need-a-website",
  articleB: "https://blogspage.com/blogs/dental-website-social-media-rules-india-ndc-advisory",
};
/** Internal links open in the same tab (renderer honours blank === false). */
const INTERNAL = new Set([SRC.articleA, SRC.articleB]);

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
  "Diagram of a patient's path from left to right: a Google or Maps search, the Business Profile and reviews, grouped as Google, then the clinic website and a call, WhatsApp message or directions, grouped as your clinic.";
const diagram: ImageMember = {
  _type: "image",
  _key: key("img"),
  alt: DIAGRAM_ALT,
  asset: { _type: "reference", _ref: PENDING_REF },
};

// ---------------------------------------------------------------- Content
const content: Member[] = [
  p(
    "A common path for a new patient looks like this. They search on Google or Maps, open a clinic's Business Profile, read some reviews, visit the clinic's website, and then call, send a WhatsApp message or ask for directions. Dental clinic SEO in Hyderabad, done properly, means making every step of that path accurate and clear.",
  ),
  p(
    "Nobody can promise you a position in those results. They depend on Google's systems and on what the clinics around you do, and both are outside your control. What you can control is the quality of your information. This guide gives you five steps in a sensible order, and a 30-day plan to work through them.",
  ),
  p(
    "We wrote this on 1 November 2026. Google changes its features and policies from time to time, so check the linked help pages before acting on any detail.",
  ),

  h2("How a patient's search actually flows"),
  p(
    "The path has two halves. The first three steps happen on Google, where you supply information but Google decides how it is shown. The last two happen on channels the clinic controls: your website, your phone line and your WhatsApp. Local SEO (search engine optimisation for nearby searches) tends to concentrate on the first half. The second half is where a patient decides whether to contact you.",
  ),
  diagram,
  p(
    "Google's own help pages say [local results are based mainly on relevance, distance and prominence](" +
      SRC.gbpRanking +
      "). You cannot change distance. Relevance depends on complete, accurate information. Prominence reflects how well known the clinic is, which builds slowly. Google also states that there is no way to request or pay for a better local ranking.",
  ),

  h2("Seven kinds of searches to plan for"),
  p(
    "In our framework, local searches for a clinic fall into seven kinds, and each is best answered by a different part of your presence. The examples are illustrations of what people might type, not measured searches.",
  ),
  ...bullets(
    "**Brand:** the clinic's name, perhaps with \"timings\". Answered by your Business Profile and your website's home or branch page.",
    "**Treatment:** \"root canal treatment Madhapur\". Answered by a treatment page linked to the right doctor and branch.",
    "**Concern:** \"bleeding gums\" or \"tooth pain at night\". Answered by a plain educational page that points to a consultation and never diagnoses.",
    "**Location:** \"dentist in Kukatpally\". Answered by your Business Profile and a genuine branch page.",
    "**Doctor:** a dentist's name plus \"dentist\". Answered by a doctor profile page.",
    "**Urgency:** \"dentist open now\". Answered by accurate hours, including holidays, and a phone that someone answers.",
    "**Cost and logistics:** \"root canal cost\" or \"dental clinic with parking near Begumpet\". Answered by an honest page on what affects cost, and clear access details.",
  ),
  p(
    "You do not need a page for every phrase. You need each kind of question to have one clear, accurate answer that a patient can find.",
  ),

  h2("Step 1: Get your Google Business Profile right"),
  p(
    "Your Business Profile is the listing that appears in Google Search and Maps, and for a local search it is often the first thing a patient sees. Start here. Google's [guidelines for representing your business](" +
      SRC.gbpGuidelines +
      ") are the rulebook. These are the points that matter most for a dental clinic:",
  ),
  ...bullets(
    "**Claim and verify it.** If you have not yet, [follow Google's verification steps](" +
      SRC.gbpVerify +
      "). Keep ownership in the clinic's own Google account, and add any agency as a manager rather than the owner.",
    "**Use the clinic's real name.** Google says the name should match how the business is known in the real world, on signage and stationery. Adding treatment names, taglines or extra locality names is not permitted, and Google says it can lead to suspension.",
    "**Choose the right primary category.** Google asks for as few categories as possible, as specific as possible, completing the sentence \"this business is a\". For most clinics that means one dental category, not a list of treatments.",
    "**Keep hours accurate, including holidays.** Set regular hours and use special hours for festivals and closures. A listing that says open when the clinic is shut is a poor first impression.",
    "**Use one phone number the clinic controls.** Google asks for a number that connects to that location and is under the business's direct control, and a local number rather than a central call centre where possible.",
    "**List your services.** Google lets businesses in many categories [show services on the profile](" +
      SRC.gbpServices +
      "). Use plain treatment names. Google rejects custom service names that contain prices or phone numbers.",
    "**Add real, current photographs.** Show the entrance, signage, reception and treatment rooms as they are today. No stock images, and no patients.",
    "**Write the description as facts.** Google does not allow descriptions that focus on promotions or prices, or that contain links.",
    "**One profile per real location.** A second branch gets its own profile only if it is a real, staffed clinic with permanent signage. Google says a virtual office, meaning a rented address where you do not operate, is not eligible.",
    "**Individual dentists.** Google's guidelines treat dentists as individual practitioners who may have their own profile if they are public-facing and can be reached at that location during stated hours. Where several dentists practise together, the clinic keeps its own separate profile.",
  ),

  h2("Step 2: Build the website pages that support the profile"),
  p(
    "Your website does not compete with your profile. It gives patients, and Google, the detail the profile has no room for. In our framework that means a few kinds of page, linked in the order a patient thinks: concern, then treatment, then doctor, then branch, then contact. If you are still weighing whether a website is worth it at all, [our guide on whether dentists need a website](" +
      SRC.articleA +
      ") covers that question first.",
  ),
  h3("Branch pages, only for real branches"),
  p(
    "One page per real clinic location, with the same name, address, phone number and hours as its Business Profile, plus a map, directions and the dentists who practise there. A single clinic needs a single location page, or simply a clear contact page.",
  ),
  h3("Doctor pages"),
  p(
    "Each dentist's name, recognised qualifications exactly as the certificates show, and state dental council registration number. Add the treatments they provide, the branch and days they see patients, and the languages they speak. Evidence, not adjectives.",
  ),
  h3("Treatment pages"),
  p(
    "What the treatment is, what the process generally involves, what can affect the plan and the cost, and what to ask at consultation. Written or reviewed by your own dentist, with the reviewer's name and the review date on the page. Never copied from another clinic's site.",
  ),
  h3("Avoid mass-produced locality pages"),
  p(
    "A common tactic is to generate dozens of near-identical pages, such as \"root canal in Madhapur\", \"root canal in Kondapur\" and \"root canal in Gachibowli\", all leading to the same booking form. Google's [spam policies](" +
      SRC.spamPolicies +
      ") describe this as doorway abuse. The examples they give include pages targeted at specific regions or cities that funnel users to one page, and substantially similar pages. Google says sites that violate its policies may rank lower or not appear at all. Write location content only where you actually have a clinic.",
  ),
  p(
    "Finally, keep your name, address and phone number identical everywhere they appear: website, Business Profile, directory listings, Instagram bio, signboard and visiting cards. An old number on one directory is a small thing, but it makes the overall picture less consistent for patients and for Google.",
  ),
  cta({
    headline: "Want us to check your profile and website against this list?",
    body: "Share your clinic name and we will review your Google profile, website and enquiry path in plain language. No pitch deck, no jargon.",
    primaryLabel: "Talk to our AI",
    secondaryLabel: "See how we work",
    secondaryHref: "/#process",
  }),

  h2("Step 3: Reviews, handled carefully"),
  p(
    "Google's rules on the basics are clear. A review must reflect a genuine experience. Google's [content policy for Maps](" +
      SRC.mapsContentPolicy +
      ") does not allow businesses to offer incentives such as payment, discounts or free services in exchange for a review. It also prohibits discouraging negative reviews, asking only patients you expect to be pleased, or asking for specific content. It does allow a business to ask for genuine reviews without trying to influence the rating or what is written.",
  ),
  p(
    "The dental position is less settled. The National Dental Commission's advisory of 14 October 2026 names publishing patient testimonials among the practices it cautions against. It does not mention Google reviews, and nobody has yet clarified whether asking for reviews, or showing them on your own website, falls within it. We go through the advisory in [our guide to the NDC advisory](" +
      SRC.articleB +
      ").",
  ),
  p("Until that is clearer, our reading is to stay cautious:"),
  ...bullets(
    "If you ask for reviews at all, ask every patient in the same neutral way, never in exchange for anything.",
    "Do not script what patients write or suggest staff they should mention.",
    "Do not post screenshots of reviews on Instagram or your website as promotion.",
    "When replying in public, never confirm what treatment someone had or mention any clinical detail. Thank them, and invite them to contact the clinic directly about anything specific.",
    "Reply to critical reviews the same way: calmly, with no clinical details, and with an offer to talk directly.",
  ),
  p(
    "This is general information, not legal advice. Before you settle on a review process, confirm with your state dental council or a healthcare lawyer.",
  ),

  h2("Step 4: The technical basics that matter"),
  p(
    "Patients never see these parts of a website, but they decide whether Google can read it properly. One line on each:",
  ),
  ...bullets(
    "**Mobile speed.** Patients often search on a phone, sometimes in discomfort, so pages should load quickly and be easy to tap.",
    "**HTTPS.** The padlock in the address bar means the connection is encrypted, which matters as soon as a page has a form.",
    "**A sitemap.** A file listing your pages so Google can find all of them, including new ones.",
    "**Google Search Console.** Google's free tool that shows which searches your site appears for, which pages are indexed and any problems Google finds. Set it up and verify ownership at launch.",
    "**Canonical URLs.** A tag that tells Google which address is the main version of a page, so near-duplicate addresses do not compete with each other.",
    "**Structured data that matches the page.** Code that describes the clinic, its address, hours and dentists in a format search engines read. Google's [structured data guidelines](" +
      SRC.sdPolicies +
      ") say it must be a true representation of the page content, and Google may still choose not to show any special result. It helps Google read the page; it does not lift a ranking on its own.",
  ),
  p(
    "Whoever built your site should be able to show you each of these without much effort. If they cannot, that is worth a conversation.",
  ),

  h2("Step 5: Make first contact easy, and make sure reception is ready"),
  p("Everything above leads to one moment, when the patient decides to get in touch. Make that easy on every page:"),
  ...bullets(
    "Call, WhatsApp and Directions buttons that stay visible on a phone screen.",
    "A reply time the clinic actually keeps, stated plainly, such as \"We reply to WhatsApp messages within two hours during clinic hours.\"",
    "Urgent concerns pointed to a phone call, not a form.",
  ),
  p(
    "Then look at the other end of the line. A website can send better-informed enquiries, but it cannot make up for an inbox nobody watches or a team that is not prepared. In our framework the reception side is part of the work:",
  ),
  ...bullets(
    "**Simple routing.** Is this about a treatment, a particular doctor, a branch, or something urgent? Each has an agreed next step.",
    "**A short quick-reply library by topic,** covering timings, directions, first visits and common treatments, which staff adapt rather than paste.",
    "**One named person** responsible for the WhatsApp inbox on each shift.",
  ),
  p(
    "Some Hyderabad details are worth stating on the site, because each one can save a phone call: the languages your team actually speaks (Telugu, Urdu, Hindi or English, only as confirmed), the nearest metro station, parking, and a landmark patients recognise.",
  ),

  h2("Measure without tracking patients"),
  p("Measure behaviour, not health. These are worth tracking:"),
  ...bullets(
    "Calls started from the website.",
    "WhatsApp button taps, by page.",
    "Directions requests.",
    "Search Console impressions and clicks, and the general themes of the searches.",
    "The pages people land on first.",
  ),
  p(
    "Your Business Profile has its own performance report as well, which is worth reading alongside these.",
  ),
  p(
    "Some things should never reach your analytics tools: symptoms, the text of enquiries, answers to any tool on the site, or anything clinical. Record that someone tapped the WhatsApp button on the root canal page. Never record what they wrote.",
  ),
  p(
    "This also lines up with India's Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025, which are being [phased in over 18 months](" +
      SRC.dpdpPib +
      "). Most day-to-day duties are scheduled for around May 2027, although there have been reports of plans to shorten the window for the largest data handlers. Check the current position before planning around a date.",
  ),

  h2("A 30-day plan for dental clinic SEO in Hyderabad"),
  ...numbered(
    "**Week 1: Business Profile and consistency.** Claim and verify the profile. Correct the name, category, hours, special hours and phone number, then add current photographs and services. List every place your name, address and phone number appear, and make them match.",
    "**Week 2: Doctor and treatment pages.** Gather qualifications and registration numbers and write one page per dentist. Draft pages for your main treatments, then have your dentists review and date them.",
    "**Week 3: Reviews and reception.** Agree a neutral review process, after checking with your council if you are unsure. Settle a reply style for public reviews, build the WhatsApp quick-reply library, and decide who answers on each shift.",
    "**Week 4: Search Console and measurement.** Verify Search Console and submit the sitemap. Set up the tracking listed above, with no patient data, and look at the first figures with your team. Expect them to be small; they are your baseline.",
  ),
  p(
    "After the first month, review the figures once a month. Search data takes weeks to settle, so judge changes over months, not days.",
  ),

  h2("What nobody can promise"),
  p(
    "Rankings depend on Google's systems and on what other clinics near you do, and both change. Results take time. Anyone who promises a Maps position, a number of new patients or a revenue figure is promising something they do not control.",
  ),
  p(
    "A strong foundation does something narrower. It makes your information consistent, useful and easy to find, and it makes your clinic easier to understand once a patient arrives. That is all it claims.",
  ),
  p(
    "If you would like help working through the five steps, the conversation starts with what you already have. Blogspage builds websites for dental clinics, so we have a commercial interest in this subject.",
  ),
  cta({
    headline: "Ready to make your clinic easier to find and easier to understand?",
    body: "We would begin with your current digital footprint and a conversation with your doctors and reception team, then agree what is worth fixing first.",
    primaryLabel: "Talk to our AI",
    secondaryLabel: "See how we work",
    secondaryHref: DENTAL_SOLUTIONS_HREF,
  }),
];

// ---------------------------------------------------------------- Validation
const ALLOWED_BLOCK_KEYS = new Set(["_type", "_key", "style", "listItem", "level", "children", "markDefs"]);
const ALLOWED_IMAGE_KEYS = new Set(["_type", "_key", "alt", "asset", "caption"]);
const ALLOWED_STYLES = new Set(["normal", "h2", "h3", "h4", "blockquote"]);
const DECORATORS = new Set(["strong", "em", "underline", "strike-through", "code"]);
const CTA_FIELDS = ["headline", "body", "primaryLabel", "secondaryLabel", "secondaryHref"] as const;

const blockText = (b: Block) => b.children.map((c) => c.text).join("");

function plainText(members: Member[]): string {
  return members
    .map((m) => (m._type === "block" ? blockText(m) : m._type === "ctaBlock" ? `${m.headline} ${m.body}` : ""))
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

  const ctaIdx: number[] = [];
  let imageCount = 0;
  content.forEach((m, i) => {
    const where = `content[${i}]`;
    seeKey(m._key, where);
    if (m._type === "ctaBlock") {
      ctaIdx.push(i);
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

  // CTAs: exactly two, one between the Step 2 and Step 3 headings, one closing.
  const h2Idx = (prefix: string) =>
    content.findIndex((m) => m._type === "block" && m.style === "h2" && blockText(m).startsWith(prefix));
  if (ctaIdx.length !== 2) errors.push(`Expected exactly 2 ctaBlocks, found ${ctaIdx.length}`);
  else {
    const s2 = h2Idx("Step 2");
    const s3 = h2Idx("Step 3");
    if (!(ctaIdx[0] > s2 && ctaIdx[0] < s3)) errors.push("Mid-article CTA is not between Step 2 and Step 3");
    if (ctaIdx[1] !== content.length - 1) errors.push("Closing ctaBlock is not the last member");
  }
  if (imageCount !== 1) errors.push(`Expected exactly 1 in-body diagram, found ${imageCount}`);
  const firstH2 = h2Idx("How a patient");
  const imgIdx = content.findIndex((m) => m._type === "image");
  if (!(imgIdx > firstH2 && imgIdx < h2Idx("Seven kinds"))) errors.push("Diagram is not in section 1");

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
    [/search volume/i, "search volume"],
  ];
  for (const [re, label] of banned) if (re.test(allText)) errors.push(`Banned phrase found: ${label}`);

  // Primary keyword placement (allowing "in").
  const kw = /dental clinic SEO (in )?Hyderabad/i;
  const first100 = body.split(/\s+/).slice(0, 100).join(" ");
  if (!kw.test(SEO_TITLE)) errors.push("Primary keyword missing from seoTitle");
  if (!kw.test(first100)) errors.push("Primary keyword missing from first 100 words");
  const h2Texts = content.filter((m): m is Block => m._type === "block" && m.style === "h2").map(blockText);
  if (!h2Texts.some((t) => kw.test(t))) errors.push("Primary keyword missing from every H2");
  if (!/no one can promise|nobody can promise/i.test(first100)) errors.push("First 100 words must say no position can be promised");

  // Required substance checks.
  if (!/1 November 2026/.test(body)) errors.push("Missing date stamp");
  if (!/commercial interest/.test(body)) errors.push("Missing disclosure");
  if (!/not legal advice/.test(body)) errors.push("Missing not-legal-advice note");
  if (!/DPDP Rules, 2025/.test(body)) errors.push("Missing DPDP reference");
  const linksTo = (href: string) => content.some((m) => m._type === "block" && m.markDefs.some((d) => d.href === href));
  if (!linksTo(SRC.articleA)) errors.push("Missing link to Article A");
  if (!linksTo(SRC.articleB)) errors.push("Missing link to Article B");
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
  console.log(`  ctaBlocks:        ${ctaIdx.length} at ${ctaIdx.join(", ")}`);
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
  "Dark blue banner with the words \"Found on Maps. Understood on your site.\" and a line reading \"Dental clinic SEO in Hyderabad\" above a simple map-pin outline.";

async function renderBanner(): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0c18"/>
      <stop offset="1" stop-color="#171c45"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g fill="none" stroke="#828FFF" stroke-width="3">
    <path d="M1370 270 c-76 0 -126 56 -126 124 c0 90 126 216 126 216 s126 -126 126 -216 c0 -68 -50 -124 -126 -124 z" stroke-opacity="0.7"/>
    <circle cx="1370" cy="394" r="40" stroke-opacity="0.7"/>
    <ellipse cx="1370" cy="640" rx="160" ry="28" stroke-opacity="0.25"/>
  </g>
  <rect x="120" y="270" width="72" height="6" fill="#828FFF"/>
  <text x="120" y="390" font-family="${FONT}" font-size="80" font-weight="600" fill="#F2F3FA">Found on Maps.</text>
  <text x="120" y="500" font-family="${FONT}" font-size="80" font-weight="600" fill="#F2F3FA">Understood on your site.</text>
  <text x="120" y="580" font-family="${FONT}" font-size="34" fill="#A9B0E8">Dental clinic SEO in Hyderabad</text>
</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

async function renderDiagram(): Promise<Buffer> {
  const W = 1600;
  const H = 640;
  const steps = [
    { lines: ["Search", "or Maps"], ours: false },
    { lines: ["Business", "Profile"], ours: false },
    { lines: ["Reviews"], ours: false },
    { lines: ["Clinic", "website"], ours: true },
    { lines: ["Call, WhatsApp", "or Directions"], ours: true },
  ];
  const margin = 70;
  const boxW = 262;
  const boxH = 150;
  const gap = (W - 2 * margin - steps.length * boxW) / (steps.length - 1);
  const y = 330;
  const xOf = (i: number) => margin + i * (boxW + gap);
  const parts: string[] = [];
  steps.forEach((s, i) => {
    const x = xOf(i);
    const fill = s.ours ? "#828FFF" : "#141838";
    const stroke = s.ours ? "#828FFF" : "#3a4180";
    const text = s.ours ? "#0a0c18" : "#F2F3FA";
    parts.push(`<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`);
    const lh = 40;
    const startY = y + boxH / 2 - ((s.lines.length - 1) * lh) / 2 + 12;
    s.lines.forEach((ln, j) =>
      parts.push(
        `<text x="${x + boxW / 2}" y="${startY + j * lh}" text-anchor="middle" font-family="${FONT}" font-size="32" font-weight="600" fill="${text}">${ln}</text>`,
      ),
    );
    if (i < steps.length - 1) {
      const ax = x + boxW + 8;
      const bx = x + boxW + gap - 8;
      const ay = y + boxH / 2;
      parts.push(
        `<line x1="${ax}" y1="${ay}" x2="${bx - 12}" y2="${ay}" stroke="#A9B0E8" stroke-width="4"/>`,
        `<polygon points="${bx},${ay} ${bx - 16},${ay - 10} ${bx - 16},${ay + 10}" fill="#A9B0E8"/>`,
      );
    }
  });
  // Group brackets above the boxes.
  const bracket = (from: number, to: number, label: string, color: string) => {
    const x1 = xOf(from);
    const x2 = xOf(to) + boxW;
    const by = y - 40;
    return [
      `<path d="M${x1} ${by + 18} V${by} H${x2} V${by + 18}" fill="none" stroke="${color}" stroke-width="3"/>`,
      `<text x="${(x1 + x2) / 2}" y="${by - 20}" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="600" fill="${color}">${label}</text>`,
    ].join("\n  ");
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0b0d1c"/>
  <text x="${margin}" y="110" font-family="${FONT}" font-size="48" font-weight="600" fill="#F2F3FA">How a local search reaches your clinic</text>
  <text x="${margin}" y="168" font-family="${FONT}" font-size="30" fill="#A9B0E8">Google decides how the first half is shown. You control the second half.</text>
  ${bracket(0, 2, "Google", "#A9B0E8")}
  ${bracket(3, 4, "Your clinic", "#828FFF")}
  ${parts.join("\n  ")}
  <text x="${margin}" y="${H - 50}" font-family="${FONT}" font-size="26" fill="#6f76a8">Illustrative. Not every patient follows this path.</text>
</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

// ---------------------------------------------------------------- Main
async function main() {
  validate(false);
  const banner = await renderBanner();
  const diagramPng = await renderDiagram();
  for (const [name, buf] of [
    ["article-c-banner.png", banner],
    ["article-c-diagram.png", diagramPng],
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
    filename: "dental-clinic-seo-hyderabad-banner.png",
    contentType: "image/png",
  });
  const diagramAsset = await client.assets.upload("image", diagramPng, {
    filename: "dental-local-search-path-diagram.png",
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
  console.error("article-c failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
