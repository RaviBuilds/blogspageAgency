# BLOGSPAGE AI — MASTER VISUAL DESIGN SYSTEM v1.0

**Document type:** Canonical visual design system for all Blogspage AI brand surfaces  
**Status:** Final. Canonical visual authority. Documentation only — this document authorizes no application code changes by itself.  
**Scope:** The Blogspage website and all future digital brand assets: homepage, service pages, solution pages, future service hubs, portfolio, blogs, contact, about, legal pages, social-media creative, AI-generated visual assets, and AI-generated animation assets.  
**Purpose:** Permanently define the Blogspage AI visual language and prevent visual drift during the section-by-section homepage refinement and all future service, solution, portfolio, blog, and brand work.  
**Version:** 1.0 — LOCKED. Do not change casually (see Section 27, Design Governance).

---

## Relationship to other canonical documents

- `BLOGSPAGE_AI_HOMEPAGE_MASTER_BLUEPRINT_v2.0.md` — homepage strategy, positioning, content, and story. Homepage-specific content decisions remain its authority.
- `BLOGSPAGE_SEARCH_VISIBILITY_AND_ENTITY_BLUEPRINT.md` — search visibility and entity strategy.
- `BLOGSPAGE_AI_HOMEPAGE_CREATIVE_DIRECTION_MOTION_BLUEPRINT_v1.0.md` — homepage creative execution and the five signature motion moments. All motion governed by this document must remain compatible with that direction.
- `BLOGSPAGE_AI_HOMEPAGE_MASTER_REFINEMENT_STRATEGY_OUTCOME_PLAN_v1.0.md` — homepage execution strategy and outcome scoring. This document does not modify it.
- `blogspage-architecture-report.md` — technical dependency constraints.
- `seo-audit-report.md` — SEO protection rules.

On visual-system conflicts, see **Section 27 — Design Governance**.

---

## 0. How to use this document

- This is the **single canonical visual authority** for Blogspage AI. When any other document describes visuals differently, this document governs the shared visual language.
- Every new section, page, component, social creative, or AI-generated asset must be evaluated against this document before implementation.
- **Consistency does not mean identical layouts** (Section 25).
- The approved color values in this document are already implemented as the Phase 1 token foundation in `src/app/globals.css`. That file is the implementation reference; this document is the design authority. Neither may drift from the other without an explicit governance decision (Section 27).
- This document intentionally defines *principles and rules*, not component recipes. It does not prescribe exact layouts, grids, or code.

---

# 1. Core visual philosophy

The Blogspage visual language is locked as:

# **BRIGHT EDITORIAL TECHNOLOGY**
# +
# **DARK PRODUCT / SYSTEM ENVIRONMENTS**

## Interpretation

### LIGHT =
reading, business explanation, education, services, trust, conversion.

### DARK =
hero, software, product systems, technical showcases, terminal, AI/system environments, footer.

## The governing rule

The same brand must exist across both environments. Light and dark are not two themes — they are two expressive registers of one identity. Every element (typography, color signal, radius, motion character, icon language) must feel like it belongs to the same system whether it appears on paper-white or graphite.

## What this philosophy excludes

- A permanently dark "tech-bro" site with no editorial light surfaces.
- A permanently light site that hides the product/system capability.
- Mixed-temperature compromise surfaces that belong to neither register.

---

# 2. Brand visual DNA

The Blogspage logo and the supplied social-media visual reference establish the following visual DNA. These traits are the recognizable identity; everything in Sections 3–26 exists to express them.

- Fresh cool-white / pale blue-gray environments.
- Graphite / near-black typography.
- Cyan → blue → violet brand signal.
- Strong editorial typography.
- Generous negative space.
- Realistic commercial imagery.
- Restrained accents.
- Premium product/technology presentation.
- Clean visual hierarchy.

## Social-media reference rule

The social-media visual reference is **ART DIRECTION ONLY**.

- Never copy its exact layout.
- Never copy its exact imagery.
- Extract the *feel*: cool neutrality, editorial clarity, restrained signal, premium restraint.

---

# 3. Color system

These are the **approved and locked** color values. They are already implemented verbatim as the Phase 1 token foundation in `src/app/globals.css` (`:root` light palette, `.dark` dark-island palette, and the `--surface-dark-*` constants). No value may be changed, and no color outside these sets may be introduced without a governance decision.

## LIGHT

| Role | Value |
|---|---|
| background | `#F7F8FA` |
| band | `#EDF1F6` |
| card | `#FFFFFF` |
| foreground | `#0E1524` |
| secondary | `#475467` |
| subtle | `#5D6B7E` |
| disabled | `#98A2B3` |
| border | `#DDE3EC` |
| border-subtle | `#E4E9F0` |
| border-strong | `#C6CFDC` |
| input | `#B9C3D3` |
| primary / blue | `#4353C9` |
| cyan | `#0E7490` |
| violet | `#7C3AED` |
| success | `#047857` |
| destructive | `#D92D20` |

## DARK

| Role | Value |
|---|---|
| background | `#0B0E14` |
| band | `#10141C` |
| card | `#141822` |
| popover | `#191E2A` |
| foreground | `#EEF1F6` |
| muted | `#98A2B8` |
| subtle | `#7D879C` |
| disabled | `#565F73` |
| border | `#252C3B` |
| border-subtle | `#1C2230` |
| border-strong | `#333B4D` |
| input | `#333B4D` |
| primary / blue | `#828FFF` |
| cyan | `#67E8F9` |
| violet | `#A78BFA` |
| success | `#34D399` |
| destructive | `#F87171` |

## Usage rules

- **Light is the site default.** Dark environments are scoped surfaces/islands (hero, product showcases, terminal, footer), not a global theme.
- Neutrals (background, band, card, foreground, secondary, subtle, disabled) carry ~90% of the visual field. Accent colors are signal only (Section 5).
- `success` and `destructive` are semantic states only. Never use them decoratively.
- `disabled` is only for genuinely non-interactive content.
- The dark `band`, `card`, and `popover` values create depth **within** dark environments: background → band → card → popover is the dark elevation order.
- The locked Hero currently resolves a legacy pre-migration token scope inside its `.hero-island` wrapper (documented in `globals.css`). This is a deliberate stability constraint, not part of the canonical palette; the canonical dark values above govern all *new* dark surfaces.

---

# 4. Brand gradients

## LIGHT SIGNAL

```css
linear-gradient(
  90deg,
  #0891B2 0%,
  #4353C9 48%,
  #7C3AED 100%
)
```

## DARK SIGNAL

```css
linear-gradient(
  90deg,
  #67E8F9 0%,
  #828FFF 50%,
  #A78BFA 100%
)
```

These are implemented as the scoped `.text-gradient` utility in `globals.css` (light default + `.dark` island variant).

## The locked rule

# **GRADIENTS ARE SIGNALS, NOT SURFACES.**

- Do not use large gradient-filled page backgrounds by default.
- Gradients are applied to *content that carries meaning*: a headline phrase, an active indicator, a progress/line element, a small emblem.
- Acceptable gradient applications: key headline phrase (as today), thin connector/progress lines, small brand marks, selected-state indicators.
- Prohibited by default: full-section gradient washes, gradient hero backgrounds, gradient card backgrounds, gradient buttons, gradient borders on ordinary containers, animated gradient meshes as page decoration.
- The one exception family already approved: the Hero's atmospheric dark composition (including its legacy `gradient-mesh`/`glow-border` utilities), which is locked at the composition level. New sections must not copy that treatment wholesale.
- Atmospheric depth on light pages comes from the approved neutral surfaces (Section 14), not from brand-color washes.

---

# 5. Color balance

## Default target

# **85–95% neutral**
# **5–15% brand signal**

This ratio is measured across any full viewport or composed screen, not per element.

## Brand signal budget

Brand colors should primarily communicate:

- active state
- interaction
- progression
- selected state
- important connection
- CTA emphasis
- technology signal

## Prohibited

- Flooding entire sections with brand color.
- Brand-colored section backgrounds as a rhythm device.
- Using all three accent hues (cyan/blue/violet) simultaneously at full strength in one composition.
- Replacing hierarchy with color intensity.

If a section feels "flat," the first response is typography, whitespace, and composition (Sections 6, 20) — never more color.

---

# 6. Typography

Typography is the primary carrier of hierarchy. **Typography must carry hierarchy before decorative UI does.**

## Font stack

- Primary: **Geist Sans** (self-hosted via `next/font`, mapped to `--font-sans`).
- Technical metadata / code / system data: **Geist Mono** (mapped to `--font-mono`).
- No additional display or body typefaces without a governance decision.

## Hierarchy rules

- **Large editorial headline hierarchy.** Headlines are a brand moment: big, confident, tight-tracked, near-black ink on light / near-white ink on dark. Headlines may run several visual sizes across a page — variety of scale is part of the editorial character.
- **Strong ink contrast.** Primary text is `#0E1524` (light) / `#EEF1F6` (dark). Supporting text uses `secondary`/`subtle` — but body copy that must be read is never set below `secondary`.
- **Generous whitespace.** Spacing around headlines and between sections is part of the typography, not empty area to be filled.
- **Concise supporting text.** Short sentences, business language (see Master Blueprint v2.0 copy rules). Supporting paragraphs are visually quieter than headlines in both size and color.
- **Technical metadata as a secondary layer.** Technology names, counts, labels, and system data may be set in Geist Mono at small sizes in `subtle`/`muted` color. Technical vocabulary appears *after* the business statement, as proof.
- **Uppercase micro-labels only when they improve hierarchy.** Permitted pattern (already in use): `text-[11px] font-medium uppercase` with wide tracking (`tracking-wider`–`tracking-[0.18em]`), in `subtle`/`muted` or `primary`. Use for eyebrows, journey/step labels, and category tags. Never use uppercase micro-labels as body text, and never stack many of them in one view.

## Anti-patterns

- Do not turn every section into a dense SaaS dashboard (equal-size labels, dense data rows, uniform card text).
- Do not center every heading by default — alignment is a compositional choice (Section 20).
- Do not shrink headlines until pages feel like documentation; scale contrast is the identity.
- Do not use color where size and weight can create the hierarchy.

---

# 7. Surface system

## LIGHT

The light register is **paper editorial**:

```text
paper background (#F7F8FA)
  → white cards (#FFFFFF)
  → subtle borders (#E4E9F0 / #DDE3EC)
  → occasional muted surfaces (#EDF1F6 band)
  → restrained depth
```

- Light pages live primarily on the paper background; white cards are introduced where content needs containment (Section 19).
- Muted `band` surfaces group or alternate sections quietly.
- Depth on light pages is *very* restrained: mostly flat, separated by borders and spacing rather than shadows.

## DARK

The dark register is **product/system graphite**:

```text
graphite background (#0B0E14)
  → band (#10141C)
  → raised dark cards (#141822)
  → popover / deepest layer (#191E2A)
  → strong text contrast (#EEF1F6)
  → subtle signal accents (Section 3 dark accents)
  → product/system depth
```

- Dark environments read as *systems*: product UI, terminals, technical showcases.
- Elevation is expressed through the dark surface ladder plus slightly stronger shadows (Section 9).
- Text contrast in dark environments must be stronger than in light ones — dark surfaces tolerate less gray-on-gray text.

## Glassmorphism

**Avoid excessive glassmorphism.** Glass may be used only where it communicates hierarchy or physical depth (e.g., a floating control above a clearly layered scene). Glass is never the default card treatment, and never used on light editorial pages.

---

# 8. Border language

Borders are information, not decoration.

- **subtle border** (`#E4E9F0` / `#1C2230`) = quiet section separation. Use where a boundary must exist without being noticed: dividers, muted groupings.
- **standard border** (`#DDE3EC` / `#252C3B`) = card/container definition. The default edge for cards, inputs, and panels.
- **strong border** (`#C6CFDC` / `#333B4D`) = hover/focus/active emphasis. The primary "the system noticed you" cue (Section 17).
- `input` border colors are for form fields only.

Rules:

- Do not use borders everywhere merely to make layout visible. If spacing and surface change already separate two regions, no border is needed.
- A composition should never be "all boxes": if every element carries a border, borders have stopped communicating.
- Border + slight signal tint is the preferred hover pairing (Section 17).

---

# 9. Shadow language

Shadows must be:

- soft
- controlled
- realistic
- low-frequency (few elements carry them)
- context appropriate

## Light pages

Very restrained. Shadows appear only on genuinely floating elements (popovers, dropdowns, drag states). Sections, cards, and panels separate with borders and surface change, not shadow.

## Dark product environments

Slightly stronger shadows are permitted for depth (raised cards, floating UI within a system scene), because dark surfaces need luminance separation to read elevation.

## Prohibited

- Giant glowing shadows as a substitute for hierarchy.
- Colored brand-glow shadows on ordinary elements.
- Shadow + border + gradient + glow stacked on one element ("overdressed" components).
- Permanently pulsing glow.

---

# 10. Radius language

One coherent corner-radius family. The implementation base is `--radius: 0.5rem` in `globals.css`, with the derived scale (`sm` −4px, `md` −2px, `lg` = base, `xl` +4px) already defined. New UI must draw from this family, not invent values.

## Application

- **Smaller radii** — micro UI, tags, chips, small badges (the tight end of the scale).
- **Medium radii** — cards, inputs, panels, standard buttons (the family default).
- **Larger radii** — major compositions only: hero/product surfaces, flagship visual containers.

## Rules

- Avoid making every object excessively rounded. Full-rounding everything destroys the technical, precise character.
- Radius must be consistent *within* a composition: sibling cards share one radius; nested elements step down (or match), never arbitrarily vary.
- Pill-shaped radii are reserved for genuine pills: tags, chips, status dots — not for buttons by default.

---

# 11. Icon system

Icons must:

- **support meaning** — every icon clarifies or labels something; an icon that adds no information is removed
- **use consistent stroke language** — one stroke family (the codebase standard is Lucide), one stroke weight per size tier, rounded caps/joins consistently
- **have consistent visual scale** — icons align to a small set of sizes; icons in sibling elements are identical in size
- **align with surrounding typography** — optically centered against adjacent text, sized relative to it (icon cap-height ≈ text cap-height)
- **use brand color only when semantically useful** — e.g., an active vertical's icon, a success state, a selected category. Default icon color is `secondary`/`subtle` (light) or `muted` (dark)

## Prohibited

- Icon grids used as decorative filler (rows of unrelated icons to "fill" a section).
- Mixing filled and outlined styles.
- One-off custom icons that break the stroke language.
- Animated icons except as meaningful state feedback.

---

# 12. Illustration system

Illustrations are a supporting voice, not the brand's face.

## Approved qualities

Illustrations should be:

- custom (made for Blogspage, not stock)
- restrained
- structured (built from the same geometry language as the connector/system motif)
- meaningful (each illustrates a specific business concept or relationship)
- visually consistent with the connector/system motif that runs through the site

## Prohibited

- Generic SaaS illustrations.
- Cartoon characters.
- AI robots.
- Decorative abstract blobs without meaning.
- Clip-art-style imagery.
- Illustration styles that drift per section — one illustration language, reused.

Where a real interface, diagram, or photograph communicates better, prefer it over illustration.

---

# 13. Photography / realistic imagery

## Approved direction

- photorealistic
- commercial
- editorial
- natural lighting
- premium
- realistic environments
- real products/interfaces
- restrained brand reflections

Photography should look like it was commissioned for a serious business publication: real workplaces, real devices, real people working — never stocky, never glossy-corporate, never sci-fi.

## AI generation rule

Use AI generation to produce **ART-DIRECTED VISUALS** (Section 26 defines the standard and workflow).

**Never use AI-generated imagery to fabricate client/project evidence.**

Real project screenshots remain the authority for portfolio proof. AI may create the *presentation environment* around real screenshots (device frames, scene context), never the screenshots, dashboards, metrics, or testimonials themselves.

---

# 14. Background system

Backgrounds are part of the brand's atmosphere and must stay in this family.

## Approved

- cool paper backgrounds (`#F7F8FA` / `#EDF1F6` bands)
- graphite product backgrounds (`#0B0E14` / `#10141C`)
- subtle atmospheric gradients (low-contrast, tonal shifts *within* the approved neutrals; on dark islands, faint cyan/blue/violet atmosphere at very low opacity as in the locked Hero)
- fine system lines (thin structural/connector lines, grid hints, hairlines)
- editorial geometry (measured asymmetry, aligned edges, deliberate negative space)
- realistic photography (Section 13)
- controlled interface depth (dark surface ladder, Section 7)
- negative space as an active design material

## Prohibited

- giant gradient blobs
- particle fields
- galaxy/star fields
- cyberpunk
- random neon
- holographic environments
- floating AI orbs
- glowing brains
- generic "future technology" artwork
- busy textured backgrounds behind body text

A background must never compete with the business message sitting on it.

---

# 15. Motion system

Motion communicates exactly three things:

# **EXPLAIN · GUIDE · REWARD**

- **Explain** — show a relationship or process.
- **Guide** — direct attention or communicate progression.
- **Reward** — respond to user interaction with subtle visual feedback.

Motion should not exist only because animation is possible.

## Global motion character

All motion must feel:

- smooth
- calm
- precise
- physical
- restrained
- predictable
- intentional

## Prohibited motion character

- random bounce
- excessive spring
- camera shake
- perpetual looping (except where clearly justified, performance-safe, and meaning-carrying — e.g., the Hero's ambient system)
- heavy parallax
- unnecessary scroll hijacking
- many simultaneous movements

## Compatibility with the homepage creative blueprint

The homepage creative blueprint (`BLOGSPAGE_AI_HOMEPAGE_CREATIVE_DIRECTION_MOTION_BLUEPRINT_v1.0.md`) and the refinement strategy define **five signature motion moments**:

1. **Business becomes digital** — Hero assembly (the strongest motion on the site).
2. **Presence connects** — social/search/WhatsApp touchpoints → website → customer action.
3. **Digital journey grows** — START → BUILD → SCALE.
4. **Problem becomes system** — portfolio storytelling.
5. **Need becomes conversation** — final CTA / Sweety.

Everything else remains quieter. All future motion on any page must remain compatible with this direction: at most one signature-caliber moment per page; supporting motion stays below it in intensity.

---

# 16. On-screen motion

Visual objects may:

- assemble
- connect
- activate
- transition
- reveal
- settle

Rules:

- **Every major motion needs a reason** (explain / guide / reward).
- **The final resting state must always be visually complete.** Nothing may rest half-assembled, half-revealed, or dependent on continued looping to look finished.
- Motion resolves into clarity — the post-animation state is the "correct" state of the page.
- If a motion were removed, the content must remain fully understandable (Section 23).

---

# 17. Interaction language

Hover/focus should feel:

- responsive
- physical
- crisp
- restrained

## Preferred feedback

- border strengthening (→ `border-strong`)
- subtle signal tint (small brand-color shift on text/icon/border)
- slight elevation (shadow within Section 9 limits)
- controlled scale (small, e.g., ≤ ~1.02–1.03; buttons may compress on press)
- short transition (~150–300ms; the codebase's standard easing, `cubic-bezier(0.16, 1, 0.3, 1)`, is the approved character)

## Prohibited

- aggressive glow
- giant color floods
- excessive transforms (large lifts, flips, tilts)
- ornamental motion (effects that perform but communicate nothing)

## Non-negotiable

Interaction must never be the only way to understand content. Nothing critical may be hidden behind hover (this is also a homepage hard prohibition). Hover reveals are reinforcement, not information storage.

---

# 18. UI/UX language

Every section must prioritize, in order:

1. **hierarchy**
2. **comprehension**
3. **affordance**
4. **accessibility**
5. **visual polish**

Decorative complexity must never obscure the business message.

- Hierarchy first: the visitor's eye should land on the most important element without instruction.
- Comprehension: a business owner understands the section without technical knowledge.
- Affordance: interactive things look interactive; static things look static.
- Accessibility: contrast, focus, keyboard, reduced motion (Section 23).
- Polish comes last and never overrides the first four.

---

# 19. Card policy

**Cards are tools, not the visual identity.**

Use cards where they improve:

- comparison
- selection
- proof
- organization

Prefer large editorial compositions when a story can be told better.

Do not create repetitive card grids merely because the content is list-shaped. If the same card repeats 3+ times with only text swapped, evaluate an editorial alternative (split layout, numbered sequence, timeline, full-width band, table) before defaulting to the grid.

Cards must not be the *only* layout the brand has. A page composed entirely of card grids fails this system even if every card is individually on-brand.

---

# 20. Editorial composition

Premium Blogspage pages use:

- **asymmetric compositions** where appropriate (text/visual offset, varied column widths, overlapping registers)
- **large typography moments** (headlines as the visual event of a section)
- **generous breathing space** (whitespace is a material, not leftover)
- **visual focal points** (one dominant element per composition)
- **carefully controlled alignment** (grid-based, intentional, not everything centered)
- **intentional transitions between visual environments** (light → light via surface tone and whitespace; light → dark via deliberate full-bleed change, often a product surface or photograph; dark → light via slow whitespace reveal and clear reset)

## The anti-pattern to avoid

Avoid every section becoming a centered heading + 3 cards.

Rotate composition types across a page (per Master Blueprint v2.0 scroll rhythm): cinematic full-width scene, split editorial composition, asymmetric layout, product showcase, quiet text field, interactive selector, compact proof strip, dark product island. The page should breathe, not repeat.

---

# 21. Business-first communication

Visual design must support **business-owner comprehension**.

- The visitor should not need to understand technical concepts before understanding value.
- Technical sophistication appears as **supporting evidence** (Geist Mono metadata, real interfaces, system visuals) — never as the entry point.
- Every section must pass this test: *could a business owner with zero technical vocabulary explain this section's value to someone else?*
- Visual metaphors come from business reality (shopfront, counter, enquiries, operations) — not from developer culture (terminals as primary metaphors, code screenshots as hero content).

---

# 22. Responsive design language

## Desktop

- richer composition
- larger visual systems
- asymmetric relationships where useful
- cinematic motion

## Tablet

- preserve hierarchy
- simplify density

## Mobile

- vertical storytelling
- clear typography
- reduced visual complexity
- simplified motion (shorter/looser transitions, fewer simultaneous movements, static fallbacks where appropriate)
- touch-first controls (adequate target sizes, no hover-dependent behavior)

## The governing rule

**Never design mobile as a shrunken desktop.**

- Mobile re-stages the story vertically: one focal point at a time, typography scales down but keeps its relative hierarchy (headline > supporting > metadata).
- Desktop-only compositions (pinned scroll, hover systems, complex asymmetric layouts) must have designed mobile equivalents or designed omissions — never a squeezed afterthought.
- Dark product islands on mobile keep their contrast strength and drop non-essential ambience.

---

# 23. Accessibility

The design system must support, as built-in properties — not post-hoc fixes:

- **sufficient contrast** — text meets WCAG AA against its actual surface; the approved light/dark pairs above are chosen for this. Dark environments require *stronger* contrast discipline (Section 7).
- **visible focus** — every interactive element has a clearly visible focus state (the `ring` token family); focus is never removed without replacement.
- **keyboard interaction** — all functionality reachable and operable by keyboard; hover-only reveals have keyboard/focus equivalents.
- **reduced motion** — `prefers-reduced-motion` is respected everywhere (the codebase already implements this pattern, e.g., the hero word reveal short-circuit and preloader skip). Under reduced motion, content appears in its final, complete resting state.
- **semantic structure** — real headings, landmarks, lists, buttons, and labels; visual styling never replaces document structure.
- **no color-only meaning** — color signal is always paired with another cue (text, icon, position, label).
- **no animation-only meaning** — nothing is communicated solely through animation.

---

# 24. Performance

Visual quality must not justify unnecessary performance cost.

## Prefer

- CSS (pure-CSS animation where possible, as with the hero word reveal)
- SVG
- optimized images (`next/image`, AVIF/WebP, correct `sizes`, priority only above the fold)
- small motion components (isolated client islands)
- existing Framer Motion infrastructure (plus Lenis, already in use)

## Avoid introducing

- WebGL
- heavy particle engines
- new animation libraries
- large continuously running client systems

…unless a future project explicitly approves them. Every new visual dependency is a governance decision (Section 27), not an implementation choice.

---

# 25. Cross-project consistency

This design system applies to:

- homepage
- service pages
- solution pages
- future service hubs
- portfolio
- blogs
- contact
- about
- legal pages
- social-media creative
- AI-generated visual assets
- AI-generated animation assets

## The consistency rule

# **CONSISTENCY DOES NOT MEAN IDENTICAL LAYOUTS.**

All pages should share the same visual DNA while expressing their specific content differently.

What stays constant everywhere: color system, gradient rules, typography character, surface/border/shadow/radius language, icon and illustration language, motion character, interaction language, business-first priority.

What varies per page: composition, layout, density, section types, story structure — chosen from the approved vocabulary above to serve that page's content.

A blog post, a solution landing page, and the homepage should be recognizably the same brand within seconds, without looking like clones.

---

# 26. AI visual generation standard

## Stills

Any future ChatGPT-generated (or other-model) still or transparent visual must follow this design system:

- approved palette and gradients only (Section 3–4)
- approved photography/imagery direction (Section 13)
- approved background family (Section 14)
- no prohibited motifs (Section 14 "Prohibited")
- typography, where applicable, in the brand fonts and hierarchy rules (Section 6)

## Animation (e.g., Gemini)

Any future Gemini (or other-model) animation must use the **approved still/master frame** and preserve:

- framing
- objects
- typography where applicable
- colors
- proportions
- composition

Animations must **not**:

- crop important objects
- recompose the scene
- invent new objects
- redesign UI
- alter typography
- introduce unrelated colors

## Workflow (per the refinement strategy)

Strategy → master frame → human review (composition, margins, object position, hierarchy, text safety, brand fit) → animation → integration → **fallback (master still as the static/reduced-motion fallback)** → performance validation.

## Evidence rule (repeated from Section 13)

AI-generated imagery must never fabricate client/project evidence: no invented screenshots, dashboards, metrics, testimonials, or client outcomes. Real project screenshots remain the authority for portfolio proof.

---

# 27. Design governance

When another design document conflicts with this document on visual-system rules:

1. **Specific current implementation constraints take precedence** where required for stability (e.g., the locked Hero's legacy island scope).
2. **Homepage-specific strategy** (`BLOGSPAGE_AI_HOMEPAGE_MASTER_BLUEPRINT_v2.0.md` + refinement strategy) determines content and story.
3. **This document governs the shared visual language.**
4. **SEO/architecture protection rules** (`seo-audit-report.md`, `blogspage-architecture-report.md`, Search Visibility & Entity Blueprint) remain authoritative for technical constraints.

## Change control

- **Do not change the design system casually.**
- Any new global visual pattern (new color, new gradient use, new surface treatment, new motion pattern, new dependency) must be **explicitly evaluated for whether it belongs in this system before adoption**, and if accepted, documented here via a versioned update (v1.1, v2.0…).
- Implementation work that needs a value outside this system must stop and escalate, not improvise.
- Color values in `src/app/globals.css` and in Section 3 must never diverge; any change is a paired, documented change.

---

# 28. Quick-reference prohibitions

The fastest drift-prevention checklist. Everything here is expanded in the sections above.

- No large gradient-filled page backgrounds (gradients are signals, not surfaces).
- No section flooded with brand color (85–95% neutral).
- No dense SaaS-dashboard styling of editorial content.
- No borders on everything; no shadows as fake hierarchy; no glass by default.
- No per-section radius/style invention; one radius family.
- No decorative icon grids; no illustration robots/blobs; no icon-style mixing.
- No AI-fabricated client evidence; real screenshots remain the portfolio authority.
- No gradient blobs, particle fields, star fields, cyberpunk, neon, holographic environments, AI orbs, or glowing brains.
- No random bounce, excessive spring, perpetual loops without justification, heavy parallax, or scroll hijacking.
- No hover-only critical content; no color-only or animation-only meaning.
- No WebGL / particle engines / new animation libraries without explicit approval.
- No mobile-as-shrunken-desktop.
- No new section pattern without checking it against this system.

---

# 29. Change control

- This document changes only through an explicit documentation task that states what is changing, why, and which sections are affected. Small clarifications may ship as v1.x; changes to locked colors, gradients, philosophy, or typography character require a major version and explicit approval.
- Application work governed by this document must also satisfy `BLOGSPAGE_AI_HOMEPAGE_MASTER_BLUEPRINT_v2.0.md` (homepage strategy), `BLOGSPAGE_AI_HOMEPAGE_MASTER_REFINEMENT_STRATEGY_OUTCOME_PLAN_v1.0.md` (homepage execution), `blogspage-architecture-report.md` (dependencies), and `seo-audit-report.md` (SEO protection).
- When this document and a protection rule conflict, the protection rule wins.

---

**End of canonical document — BLOGSPAGE AI MASTER VISUAL DESIGN SYSTEM v1.0.**

> North Star: **Start simple. Build properly. Grow from there.** Every visual decision should make Blogspage feel like a premium digital build partner that a business owner can trust — calm, editorial, technically credible, unmistakably Blogspage in both light and dark.







