import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   R7.1 — INDUSTRY SYSTEM VISUALS (conceptual, 7 industries)

   One distinct miniature product/system composition per industry without
   verified client work. These are clearly CONCEPTUAL representations of the
   digital system Blogspage could build -- they must never read as client
   screenshots or imply completed projects. The three proof-backed industries
   render verified owner-supplied screenshots instead (RealWorkVisual in
   `industry-visual.tsx`).

   Shared language: clean UI geometry, editorial card surfaces, restrained
   cyan/blue/violet accents (<= 0.6 alpha), no gradients, no particles.
   All decorative: aria-hidden at the frame, static (no motion), so reduced
   motion is trivially satisfied.
   ─────────────────────────────────────────────────────────────────────────── */

const CYAN = "rgba(14,116,144,";
const BLUE = "rgba(67,83,201,";
const VIOLET = "rgba(124,58,237,";
const INK = "var(--border-strong)";
const HAIR = "var(--border-subtle)";

function VisualFrame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        focusable="false"
        role="presentation"
      >
        {children}
      </svg>
    </div>
  );
}

/* Pet Care — pet profile + booking calendar + reminder state. */
function PetCareVisual() {
  return (
    <VisualFrame>
      <rect x="16" y="28" width="120" height="144" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      <circle cx="44" cy="56" r="14" style={{ stroke: CYAN + "0.6)" }} strokeWidth="1.5" />
      <line x1="28" y1="84" x2="112" y2="84" style={{ stroke: INK }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="102" x2="96" y2="102" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="28" y="118" width="64" height="16" rx="8" style={{ stroke: CYAN + "0.55)" }} strokeWidth="1.5" />
      <path d="M38 126 l5 5 9 -10" style={{ stroke: CYAN + "0.8)" }} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="160" y="28" width="144" height="118" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      <rect x="160" y="28" width="144" height="22" rx="8" style={{ fill: "rgba(14,116,144,0.06)" }} />
      {[0, 1, 2, 3, 4, 5, 6].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={col + "-" + row}
            x={170 + col * 19}
            y={62 + row * 24}
            width="14"
            height="12"
            rx="2"
            style={{ fill: col === 2 && row === 1 ? "rgba(14,116,144,0.35)" : "rgba(14,116,144,0.08)" }}
          />
        )),
      )}
      <circle cx="292" cy="166" r="9" style={{ stroke: VIOLET + "0.6)" }} strokeWidth="1.5" />
      <path d="M292 162 v5 h4" style={{ stroke: VIOLET + "0.8)" }} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="160" y1="166" x2="272" y2="166" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
    </VisualFrame>
  );
}

/* Consulting — ROI calculator + discovery-call pipeline. */
function ConsultingVisual() {
  return (
    <VisualFrame>
      <rect x="16" y="24" width="140" height="152" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      <line x1="30" y1="44" x2="108" y2="44" style={{ stroke: INK }} strokeWidth="2.5" strokeLinecap="round" />
      {[64, 98, 132].map((y, i) => (
        <g key={y}>
          <line x1="30" y1={y} x2="142" y2={y} style={{ stroke: HAIR }} strokeWidth="3" strokeLinecap="round" />
          <circle cx={56 + i * 34} cy={y} r="6" style={{ fill: "rgba(67,83,201,0.75)" }} />
          <rect x="118" y={y - 8} width="24" height="16" rx="8" style={{ stroke: BLUE + "0.5)" }} strokeWidth="1.25" />
        </g>
      ))}
      <rect x="30" y="152" width="112" height="18" rx="9" style={{ fill: "rgba(67,83,201,0.08)", stroke: BLUE + "0.55)" }} strokeWidth="1.25" />
      <line x1="186" y1="40" x2="186" y2="140" style={{ stroke: HAIR }} strokeWidth="2" />
      {[40, 90, 140].map((cy, i) => (
        <g key={cy}>
          {i < 2 && <line x1="186" y1={cy + 14} x2="186" y2={cy + 36} style={{ stroke: "rgba(67,83,201,0.4)" }} strokeWidth="1.5" />}
          <circle cx="186" cy={cy} r={i === 0 ? 10 : 8} style={{ fill: i === 0 ? "rgba(67,83,201,0.8)" : "var(--card)", stroke: BLUE + (i === 0 ? "0.9)" : "0.5)") }} strokeWidth="1.5" />
          <line x1="206" y1={cy} x2="286" y2={cy} style={{ stroke: i === 0 ? INK : HAIR }} strokeWidth={i === 0 ? 2.5 : 2} strokeLinecap="round" />
        </g>
      ))}
    </VisualFrame>
  );
}

/* __R71_VISUALS_B__ */

/* Education — course player + lesson list + completion progress. */
function EducationVisual() {
  return (
    <VisualFrame>
      <rect x="16" y="32" width="168" height="104" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      <path d="M92 72 l22 12 -22 12 z" style={{ fill: "rgba(124,58,237,0.7)" }} />
      <rect x="196" y="32" width="108" height="104" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      {[48, 78, 108].map((y, i) => (
        <g key={y}>
          <circle cx="212" cy={y} r="4" style={{ fill: i === 0 ? "rgba(124,58,237,0.8)" : "rgba(124,58,237,0.25)" }} />
          <line x1="224" y1={y} x2="292" y2={y} style={{ stroke: i === 0 ? INK : HAIR }} strokeWidth={i === 0 ? 2.5 : 2} strokeLinecap="round" />
        </g>
      ))}
      <rect x="16" y="156" width="288" height="8" rx="4" style={{ fill: "rgba(124,58,237,0.12)" }} />
      <rect x="16" y="156" width="188" height="8" rx="4" style={{ fill: "rgba(124,58,237,0.6)" }} />
      <line x1="16" y1="172" x2="120" y2="172" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
    </VisualFrame>
  );
}

/* Gym & Fitness — membership card + pause-credit ledger + occupancy. */
function GymVisual() {
  return (
    <VisualFrame>
      <rect x="16" y="36" width="128" height="88" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      <line x1="30" y1="56" x2="104" y2="56" style={{ stroke: INK }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="72" x2="88" y2="72" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      {[0, 1, 2].map((col) =>
        [0, 1, 2].map((row) => (
          <rect key={col + "-" + row} x={92 + col * 8} y={86 + row * 8} width="6" height="6" style={{ fill: "rgba(14,116,144,0.5)" }} />
        )),
      )}
      <rect x="158" y="36" width="146" height="88" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      <line x1="172" y1="54" x2="236" y2="54" style={{ stroke: INK }} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="246" y="46" width="46" height="14" rx="7" style={{ stroke: VIOLET + "0.6)" }} strokeWidth="1.25" />
      <line x1="172" y1="78" x2="290" y2="78" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="172" y1="96" x2="266" y2="96" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="172,150 200,142 228,146 256,132 288,126" style={{ stroke: CYAN + "0.7)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {[172, 200, 228, 256, 284].map((x, i) => (
        <rect key={x} x={x} y={158 - i * 4} width="10" height={12 + i * 4} rx="2" style={{ fill: "rgba(14,116,144,0.25)" }} />
      ))}
    </VisualFrame>
  );
}

/* E-commerce — storefront tiles + checkout steps + order confirmation. */
function EcommerceVisual() {
  return (
    <VisualFrame>
      {[16, 92].map((x) => (
        <g key={x}>
          <rect x={x} y="28" width="66" height="56" rx="6" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
          <rect x={x + 8} y="36" width="50" height="26" rx="3" style={{ fill: "rgba(67,83,201,0.12)" }} />
          <line x1={x + 8} y1="72" x2={x + 44} y2="72" style={{ stroke: INK }} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      <line x1="24" y1="102" x2="120" y2="102" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="160" y="28" width="144" height="86" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      {[184, 216, 248, 280].map((cx, i) => (
        <g key={cx}>
          {i < 3 && <line x1={cx + 10} y1="52" x2={cx + 26} y2="52" style={{ stroke: i < 2 ? "rgba(67,83,201,0.5)" : HAIR }} strokeWidth="1.5" />}
          <circle cx={cx} cy="52" r={i === 1 ? 9 : 7} style={{ fill: i <= 1 ? "rgba(67,83,201,0.75)" : "var(--card)", stroke: BLUE + "0.6)" }} strokeWidth="1.5" />
        </g>
      ))}
      <line x1="176" y1="80" x2="288" y2="80" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="176" y1="98" x2="252" y2="98" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="184" cy="140" r="14" style={{ stroke: CYAN + "0.6)" }} strokeWidth="1.5" />
      <path d="M177 140 l5 5 10 -11" style={{ stroke: CYAN + "0.85)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="210" y1="138" x2="292" y2="136" style={{ stroke: INK }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="210" y1="152" x2="266" y2="151" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
    </VisualFrame>
  );
}

/* __R71_VISUALS_C__ */

/* SaaS Platforms — pricing tiers + metered-usage state. */
function SaasVisual() {
  return (
    <VisualFrame>
      {[16, 122, 228].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={i === 1 ? 32 : 44}
            width="76"
            height={i === 1 ? 96 : 84}
            rx="8"
            style={{
              fill: i === 1 ? "rgba(124,58,237,0.06)" : "var(--card)",
              stroke: i === 1 ? VIOLET + "0.6)" : "var(--border)",
            }}
            strokeWidth={i === 1 ? 1.75 : 1.5}
          />
          <line x1={x + 12} y1={i === 1 ? 52 : 64} x2={x + 52} y2={i === 1 ? 52 : 64} style={{ stroke: i === 1 ? INK : HAIR }} strokeWidth={i === 1 ? 2.5 : 2} strokeLinecap="round" />
          {[0, 1, 2].map((row) => (
            <line key={row} x1={x + 12} y1={(i === 1 ? 68 : 80) + row * 14} x2={x + 62} y2={(i === 1 ? 68 : 80) + row * 14} style={{ stroke: HAIR }} strokeWidth="2" strokeLinecap="round" />
          ))}
        </g>
      ))}
      <rect x="112" y="26" width="50" height="14" rx="7" style={{ fill: "rgba(124,58,237,0.12)" }} />
      <path d="M138 168 a 30 30 0 1 1 44 0" style={{ stroke: "rgba(124,58,237,0.25)" }} strokeWidth="5" strokeLinecap="round" />
      <path d="M138 168 a 30 30 0 0 1 16 -26" style={{ stroke: VIOLET + "0.75)" }} strokeWidth="5" strokeLinecap="round" />
      <line x1="196" y1="166" x2="286" y2="166" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
    </VisualFrame>
  );
}

/* SEO Blogs — editorial publishing + search listing + traffic state. */
function SeoBlogsVisual() {
  return (
    <VisualFrame>
      <rect x="16" y="28" width="160" height="144" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      <line x1="30" y1="50" x2="150" y2="50" style={{ stroke: INK }} strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="64" x2="122" y2="64" style={{ stroke: INK }} strokeWidth="3" strokeLinecap="round" />
      {[80, 94, 108, 122, 136].map((y) => (
        <line key={y} x1="30" y1={y} x2={y % 2 === 0 ? 150 : 138} y2={y} style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      <rect x="190" y="28" width="114" height="120" rx="8" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      {[48, 88, 122].map((y, i) => (
        <g key={y}>
          <circle cx="204" cy={y} r="4" style={{ fill: i === 0 ? "rgba(14,116,144,0.8)" : "rgba(14,116,144,0.25)" }} />
          <line x1="216" y1={y} x2="292" y2={y} style={{ stroke: i === 0 ? INK : HAIR }} strokeWidth={i === 0 ? 2.5 : 2} strokeLinecap="round" />
        </g>
      ))}
      <rect x="216" y="56" width="34" height="14" rx="7" style={{ fill: "rgba(14,116,144,0.12)", stroke: CYAN + "0.6)" }} strokeWidth="1.25" />
      <polyline points="200,188 226,182 252,184 278,174 304,168" style={{ stroke: CYAN + "0.7)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </VisualFrame>
  );
}

/* Drift-safe fallback: the R8 problem->system composition. */
function FallbackSystemVisual() {
  return (
    <VisualFrame>
      <rect x="48" y="40" width="224" height="120" rx="10" style={{ fill: "var(--card)", stroke: "var(--border)" }} strokeWidth="1.5" />
      <line x1="70" y1="70" x2="180" y2="70" style={{ stroke: INK }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="92" x2="240" y2="92" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="112" x2="216" y2="112" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="132" x2="150" y2="132" style={{ stroke: "rgba(67,83,201,0.55)" }} strokeWidth="2.5" strokeLinecap="round" />
    </VisualFrame>
  );
}

/**
 * Dispatcher: one distinct conceptual system visual per industry id.
 * Unknown ids fail safe to the neutral fallback (never a crash, never an
 * invented client artifact).
 */
export function ConceptVisual({ id }: { id: string }) {
  switch (id) {
    case "pet-care":
      return <PetCareVisual />;
    case "consulting":
      return <ConsultingVisual />;
    case "education":
      return <EducationVisual />;
    case "gym-fitness":
      return <GymVisual />;
    case "ecommerce":
      return <EcommerceVisual />;
    case "saas-platform":
      return <SaasVisual />;
    case "seo-blogs":
      return <SeoBlogsVisual />;
    default:
      return <FallbackSystemVisual />;
  }
}
