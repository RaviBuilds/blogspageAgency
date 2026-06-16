# Awwwards-Tier Design System Architecture (Blogspage)

## 1. Core Philosophy
*   **Experiential over Informational:** The website is a narrative. Users scroll to unveil content, not just to read it.
*   **Spatial Tension:** Use extreme contrasts in padding and font sizing. Avoid perfectly symmetrical split-screens. Emphasize massive negative space (`py-32`, `py-48`).
*   **Depth and Materials:** No flat cards. Use glassmorphism, dynamic grain/noise overlays, and sub-pixel borders (`border-white/10`).

## 2. Technical Stack Constraints
*   **Styling:** Tailwind CSS (arbitrary values permitted for micro-adjustments).
*   **Animation Engine:** Framer Motion (`framer-motion`).
*   **Scroll Engine:** Lenis (`@studio-freight/lenis`) for global smooth scrolling.
*   **Icons/Assets:** Lucide React. Minimalist, monochrome.

## 3. Typography Rules
*   **Hero Headings:** Oversized, brutalist typography. Tracking should be extremely tight (`tracking-tighter`), line height compressed (`leading-none` or `leading-[0.85]`).
*   **Body Copy:** High legibility, generous line height (`leading-relaxed`), muted colors (`text-neutral-400`).
*   **Font Pairing:** Assume a highly geometric sans-serif (e.g., PP Neue Montreal, Inter, or Clash Display).
*   **Kinetic Text:** Large headings should never just "appear". They must stagger in by character or by word using Framer Motion's `staggerChildren`.

## 4. Color Palette & Lighting
*   **Background:** Deep Space Black (`#050505` to `#000000`). Never use generic `#111`.
*   **Foreground:** Off-white (`#F5F5F5`). Avoid pure `#FFF` to reduce eye strain.
*   **Accents:** Ethereal gradients. Use CSS Mesh Gradients or radial blurs positioned absolutely behind elements to create a "glowing" effect (e.g., `bg-indigo-500/20 blur-[100px]`).
*   **Borders:** 1px borders with extreme transparency (`border-white/[0.08]`) to define boundaries without adding visual weight.

## 5. Standardized Motion Physics (Framer Motion)
All entrance animations must use spring physics, not linear eases.
*   **The "Premium" Spring:** `transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}`
*   **Scroll Reveals:** Use `whileInView` with `viewport={{ once: true, margin: "-100px" }}`. Elements should slide up (`y: 40`) and fade in (`opacity: 0`).
*   **Micro-interactions:** Buttons must scale down slightly on tap (`whileTap={{ scale: 0.95 }}`) and have magnetic hover effects.

## 6. Structural Components
*   **The Cursor:** Implement a custom global cursor that scales up when hovering over actionable items.
*   **The Navigation:** Minimalist, glassmorphic pill floating at the top/bottom, or a brutalist full-screen overlay menu.
*   **Bento Grids:** If using bento grids, animate them in staggeringly. Use inner `box-shadow` to create debossed depth.

## 7. Strict Content Preservation (The Golden Rule)
*   **Zero Copywriting Changes:** The actual text, paragraphs, headings, button labels, and image sources of the website MUST NOT be altered. 
*   **Visual Wrapping Only:** Your job is to wrap the *existing* content in the Awwwards-tier architecture (Tailwind classes, Framer Motion elements, layout structures). You are not a copywriter; you are a UI Engineer.