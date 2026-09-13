# BLOGSPAGE AI - R8 HOW WE WORK EXPERIENCE BLUEPRINT v1.0

**Document status:** Proposed canonical artifact for R8 homepage refinement, created BEFORE implementation (correcting the R7 sequencing gap where implementation preceded a canonical document).
**Applies to:** blogspage.com homepage -- the process section only (`ProcessTimeline`, anchor `#process`).
**Audience priority:** Business owners and non-technical decision makers.
**Copy authority:** BLOGSPAGE_AI_HOMEPAGE_MASTER_BLUEPRINT_v2.0.md, Section 16 (primary).
**Creative authority:** BLOGSPAGE_AI_HOMEPAGE_CREATIVE_DIRECTION_MOTION_BLUEPRINT_v1.0.md, Section 13 Scene 07.
**Visual authority:** BLOGSPAGE_AI_MASTER_VISUAL_DESIGN_SYSTEM_v1.0.md (shared tokens and rules).

---

# 1. Purpose

Transform the existing homepage process section from four near-identical process cards into ONE continuous visual journey that answers the business owner's real question:

> "What actually happens after I contact Blogspage?"

The section must make working with Blogspage feel clear, structured, credible and low-friction -- in plain business language, without exposing an internal engineering checklist, and without inventing anything the repository does not support.

This blueprint exists so implementation follows an established canonical document. The R7 sequencing gap (implementation preceded a canonical R7 blueprint) must not repeat.

# 2. Audience problem being solved

By this point the visitor has seen what Blogspage builds (three verticals), real proof (flagship work), and industries served (industry discovery). The remaining anxiety is procedural, not technical:

- What happens after I contact you?
- How much of my time will this take?
- Will I understand what is being built?
- How do I know it will actually launch?

The section removes this anxiety in plain language. The visitor should understand the transformation from business problem to live digital system even before reading every word.

# 3. Exact approved copy (COPY AUTHORITY: Master Blueprint v2.0 Section 16)

The following copy is canonical and must be rendered verbatim. It already lives in `src/lib/homepage-data.ts` (PROCESS) and must not change without owner approval.

Section header:

- Eyebrow: "What happens next"
- Heading: "You don't need to know how to build it. You need to know what happens next."
- Supporting: "Four phases, explained in plain language -- with something concrete delivered at the end of each one."

The selective-gradient heading convention applies to the final sentence ("You need to know what happens next.") and is already implemented.

Stage copy (canonical, from PROCESS):

01 Understand
"We learn how your business works, who your customers are, and what's actually slowing you down. You explain the business -- we translate it into a build plan."
Outcome: "a written scope, a system direction and a clear plan"

02 Shape
"We design the screens, the content structure and the experience before any code is written, so you can see and approve what you're getting."
Outcome: "defined screens, content structure and the experience we are actually going to build"

03 Build
"We build in reviewable increments, so you see real progress early and can course-correct while it's still cheap to do so."
Outcome: "a working system you can use and review"

04 Launch
"We deploy, hand over the keys and walk you through everything -- then stay available for questions and improvements."
Outcome: "the live system, the accounts in your name, and a clear plan for what comes next."

## Explicitly non-canonical copy (must NOT supersede Section 16)

- Alternate heading: "A clear path from idea to launch."
- Alternate outcomes: "Clarity on the actual problem." / "A clear plan and direction." / "A working digital system." / "Something ready for business."

These are recorded as rejected mission proposals and may not be implemented unless a future canonical revision replaces Section 16.

# 4. Four-stage information architecture

Journey framing:

BUSINESS PROBLEM (entry frame) -> UNDERSTAND -> SHAPE -> BUILD -> LAUNCH -> LIVE BUSINESS (terminal frame)

Entry and terminal are visual frame nodes, not new stages, and carry no new commercial claims.

Stage concepts (Creative Blueprint Section 13 Scene 07):

- Understand -- "Your business and customers."
- Shape -- "Brand, experience and structure."
- Build -- "Website, software and automation."
- Launch -- "Test, optimize and hand over."

# 5. Stage outcomes

Owned by Master Blueprint Section 16 (Section 3 above), rendered in the established "You end with: ..." treatment. No invented deliverables, timelines, communication guarantees or commercial promises. Do not claim specific delivery times.

# 6. Visual storytelling concept

Core principle: **the transformation itself is the storytelling mechanism.**

One continuous visual subject -- a plain business brief -- progressively becomes a working, live system as the visitor moves through the four stages. The four stages are states of ONE system, not four decorated cards placed beside a timeline.

Creative Blueprint Section 13 governs the metaphor:

problem -> plan -> interface/system -> working product -> live business

Implementation shape:

- A single "transformation canvas" (one SVG composition) whose internal state morphs through five canonical states as the visitor progresses: BRIEF (problem) -> UNDERSTOOD -> SHAPED -> BUILT -> LIVE.
- The same underlying sheet primitives persist across every state so continuity stays visible; per-state elements emerge and resolve within each stage's progress window.
- Stage rows remain normal document content (number, title, description, "You end with: ...") -- fully readable as plain text even if the canvas is ignored entirely.

# 7. Stage visual motifs (states of the one canvas)

- BRIEF / entry (neutral): a plain sheet with loosely scattered strokes -- the unstructured business problem.
- UNDERSTAND (cyan): the sheet gains annotation marks and customer-signal dots -- the business mapped.
- SHAPE (blue): scattered strokes resolve onto a grid into an ordered wireframe -- the plan.
- BUILD (blue + violet): the wireframe gains stacked interface surfaces and depth -- the working product assembling.
- LAUNCH / terminal (cyan + blue): the interface resolves into a live window emitting one calm signal ring with an outward customer dot -- the live business.

Sheet and skeleton primitives persist across all states (visible continuity). Per-state elements stay restrained (4-6 shapes each). All decorative and aria-hidden.

# 8. Continuous journey metaphor

- One progress spine and one canvas state, driven by the SAME scroll progress value -- never independent animations.
- Stage nodes on the spine mark the four stages; entry and terminal nodes mark the problem and live states.
- The canvas state, spine fill, and each stage row's "reached" emphasis advance together within that stage's progress window and persist once reached (no reverse churn on fast scroll).
- The transformation must be graspable before reading any copy -- and the copy alone must still carry everything.

# 9. Motion behavior

- Calmer than the R5 scroll progression. Scroll-windowed, once-persistent states. Spring/stagger per the design system (stiffness 100, damping 20, mass 1; stagger <= 0.1).
- Entry: the section establishes the journey (header + canvas in BRIEF state + stage 01) via whileInView, once.
- Progression: spine fill + canvas morph + stage emphasis advance within per-stage windows derived from the section's scrollYProgress.
- A signal dot travels the filled spine and fades at the ends.
- No looping/idle animation, no parallax stacking, no element churn.

# 10. Scroll behavior

Normal document flow. No pinning, no 400vh theatrical track, no scroll hijack, no horizontal takeover. The section remains skimmable; fast scroll must never leave half-applied states (progress windows settle/persist, reusing the established settle-on-load philosophy).

# 11. Reduced-motion behavior

With reduced motion: the spine renders fully drawn, the canvas renders its complete LIVE composition (or a static five-state filmstrip if that reads better in QA), no traveling signal, no morph. Every piece of information is available without animation. Nothing may be animation-gated.

# 12. Desktop layout (>= 1200px)

Two-column journey inside the existing centered container:

- Left: the transformation canvas (one SVG, roughly square, ~380-420px) -- the persistent storytelling subject.
- Right: the four stage entries as an editorial list separated by spine nodes (number, title, description, "You end with: ..."). Entries are typographic -- no per-entry card chrome -- so the section reads as one journey, not four tiles.
- Spine runs vertically between canvas and list, visually connecting the canvas state to the stage list.

# 13. Tablet layout (768-1199px)

Stacked: compact canvas strip (full width, ~180-220px tall) above the stage list; identical stage list; identical progression behavior.

# 14. Mobile layout (< 768px)

- Canvas becomes a small sticky strip (~96-120px) at the top of the section that morphs as the visitor scrolls the stages (sticky is normal flow, not scroll hijack); if QA shows sticky competes with the navbar, it degrades to an inline strip per stage group.
- Stage entries render full-width, typography-led, with the spine dots inline.
- Motifs never shrink into microscopic diagrams; the copy carries meaning on its own.

# 15. Accessibility requirements

- Semantic structure preserved: section heading (h2), stage titles as list items with real headings; stage list is an `<ol>`.
- Canvas, spine, signal dot and motifs are decorative: `aria-hidden`, `focusable="false"`.
- No color-only meaning: stage "reached" state pairs color with border/typography weight and the node fill.
- No interactive elements are added; keyboard behavior of the page is unchanged.
- `aria-live` is not required (no dynamic text content changes).

# 16. Performance constraints

- No new dependencies (React + existing Framer Motion + SVG only).
- Transform/opacity animation only; ~6-8 `useTransform` bindings total; no per-frame layout work; no `will-change` overuse.
- No video, no canvas/WebGL, no particles, no idle/looping animation.
- No layout shift: canvas and motif columns are fixed-size at every breakpoint.

# 17. Brand/color constraints

Only approved tokens: cyan rgb(14,116,144), blue rgb(67,83,201), violet rgb(124,58,237), on light-surface tokens (--background, --card, --border, --border-subtle, --border-strong). Semantic progression: Understand -> cyan; Shape -> blue; Build -> blue+violet; Launch -> cyan+blue. Neutral editorial surfaces dominate; color communicates state, never decoration. Alpha usage restrained (<= 0.5 strokes, <= 0.07 washes).

# 18. Explicit anti-patterns (must not ship)

- A generic four-card process grid (explicitly rejected by Creative Blueprint Section 13).
- Four cards with a line behind them -- per-stage icon tiles + decorative connector.
- Giant decorative gradients; particles; AI-looking abstract effects.
- Stock imagery; video for decoration.
- Scroll hijacking; pinned or 400vh theatrical scroll scenes.
- Animation-gated information (anything readable only after/through animation).
- Invented delivery times, communication guarantees, capabilities or metrics.
- Duplicate business/SEO data or a second process copy source.
- Unnecessary changes to R1-R7 sections or SEO infrastructure.

# 19. Repository/file scope

Implementation remains primarily within:

- `src/components/home/process-timeline.tsx`
- `src/components/home/process-motifs.tsx` (new, only if justified -- the canvas/motif SVG components)

Preserve: `#process` anchor, PROCESS data shape, canonical copy, theme tokens, reduced-motion conventions, existing motion primitives.

Do not modify: `homepage-data.ts` (unless owner-approved copy changes are explicitly required), `page.tsx`, `delivery-models.tsx`, SEO/route systems, navbar/footer, R1-R7 sections.

# 20. Validation requirements

- `tsc --noEmit` clean.
- Existing suites green (`tests/unit`, `tests/properties/solution-slug.spec.ts`); no new tests required (no data/logic change) unless the presentation map is extracted into a data module.
- `next lint` clean; `npm run build` success with `git diff src/lib/route-lastmod.generated.json` empty (SEO surface proof).
- Browser QA at 1440/768/390px: normal/slow/fast scroll, deep-link `#process` from navbar/footer/solution pages, reduced-motion mode, keyboard pass (unchanged tab order), no layout shift.

# 21. Owner decisions

1. APPROVED: keep canonical Section 16 heading; the alternate "A clear path from idea to launch." heading is rejected for this release.
2. APPROVED: journey frame labels "Your business" (entry) and "Ready for your customers" (terminal) -- presentation-only, grounded in existing stage copy.
3. REJECTED: the alternate mission outcome labels (Section 3) -- not canonical.
4. OPEN: whether the terminal frame's final state is labeled; default is the plain live-state visual with no extra copy.

# 22. Implementation boundaries

R8 changes one homepage section. It must not rewrite the homepage, redesign the hero, Audience Pathways, Digital Home, the three verticals, Real Work or Industry Discovery, alter SEO source-of-truth files, route registries, niche/city/service data, sitemap/robots/structured-data systems or canonical URLs, create duplicate route/data systems, invent services or capabilities, or introduce stock imagery or decorative video.
