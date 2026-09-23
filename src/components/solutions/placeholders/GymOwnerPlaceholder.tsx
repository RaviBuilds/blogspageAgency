import type { SVGProps } from "react";

/**
 * Inline placeholder preview for the gym owner executive analytics pillar.
 * Converted from `public/gym-owner-placeholder.svg` so it renders as a
 * plain React SVG component instead of going through the Next.js image
 * pipeline (see design.md "Security headers and image configuration").
 */
export function GymOwnerPlaceholder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1280"
      height="800"
      viewBox="0 0 1280 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gym owner executive analytics dashboard preview"
      {...props}
    >
      <defs>
        <linearGradient id="bgO" x1="0" y1="0" x2="1280" y2="800" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c0c0f" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="accO" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5e6ad2" />
          <stop offset="1" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id="areaO" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#5e6ad2" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5e6ad2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1280" height="800" fill="url(#bgO)" />

      {/* header */}
      <rect x="64" y="56" width="280" height="26" rx="8" fill="#f7f8f8" opacity="0.9" />
      <rect x="64" y="94" width="180" height="12" rx="6" fill="#ffffff" opacity="0.3" />
      <rect x="1040" y="60" width="176" height="36" rx="10" fill="#ffffff" opacity="0.08" />
      <rect x="1064" y="72" width="128" height="12" rx="6" fill="#ffffff" opacity="0.4" />

      {/* revenue stat row */}
      <g>
        <rect x="64" y="148" width="272" height="120" rx="16" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="88" y="172" width="130" height="12" rx="6" fill="#ffffff" opacity="0.4" />
        <rect x="88" y="196" width="140" height="32" rx="8" fill="#f7f8f8" opacity="0.92" />
        <rect x="88" y="240" width="70" height="10" rx="5" fill="#28c840" opacity="0.85" />
      </g>
      <g>
        <rect x="360" y="148" width="272" height="120" rx="16" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="384" y="172" width="110" height="12" rx="6" fill="#ffffff" opacity="0.4" />
        <rect x="384" y="196" width="110" height="32" rx="8" fill="#f7f8f8" opacity="0.92" />
        <rect x="384" y="240" width="60" height="10" rx="5" fill="#28c840" opacity="0.85" />
      </g>
      <g>
        <rect x="656" y="148" width="272" height="120" rx="16" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="680" y="172" width="120" height="12" rx="6" fill="#ffffff" opacity="0.4" />
        <rect x="680" y="196" width="90" height="32" rx="8" fill="#f7f8f8" opacity="0.92" />
        <rect x="680" y="240" width="60" height="10" rx="5" fill="#ff5f57" opacity="0.8" />
      </g>
      <g>
        <rect x="952" y="148" width="264" height="120" rx="16" fill="url(#accO)" />
        <rect x="976" y="172" width="120" height="12" rx="6" fill="#ffffff" opacity="0.7" />
        <rect x="976" y="196" width="120" height="32" rx="8" fill="#ffffff" opacity="0.95" />
        <rect x="976" y="240" width="70" height="10" rx="5" fill="#ffffff" opacity="0.7" />
      </g>

      {/* revenue area chart */}
      <rect x="64" y="300" width="744" height="436" rx="18" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
      <rect x="96" y="332" width="200" height="16" rx="8" fill="#f7f8f8" opacity="0.85" />
      <rect x="96" y="360" width="140" height="12" rx="6" fill="#ffffff" opacity="0.3" />
      {/* gridlines */}
      <line x1="96" y1="440" x2="776" y2="440" stroke="#ffffff" strokeOpacity="0.05" />
      <line x1="96" y1="520" x2="776" y2="520" stroke="#ffffff" strokeOpacity="0.05" />
      <line x1="96" y1="600" x2="776" y2="600" stroke="#ffffff" strokeOpacity="0.05" />
      <line x1="96" y1="680" x2="776" y2="680" stroke="#ffffff" strokeOpacity="0.05" />
      {/* area + line */}
      <path
        d="M96 640 L186 600 L276 612 L366 540 L456 558 L546 470 L636 500 L726 420 L776 408 L776 680 L96 680 Z"
        fill="url(#areaO)"
      />
      <path
        d="M96 640 L186 600 L276 612 L366 540 L456 558 L546 470 L636 500 L726 420 L776 408"
        fill="none"
        stroke="#5e6ad2"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="546" cy="470" r="6" fill="#ffffff" />
      <circle cx="776" cy="408" r="6" fill="#9333ea" />

      {/* audit log panel */}
      <rect x="832" y="300" width="384" height="436" rx="18" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
      <rect x="860" y="332" width="160" height="16" rx="8" fill="#f7f8f8" opacity="0.85" />
      <rect x="1116" y="330" width="72" height="22" rx="11" fill="#5e6ad2" opacity="0.2" />
      <g>
        <circle cx="872" cy="400" r="6" fill="#28c840" />
        <rect x="892" y="386" width="220" height="11" rx="5.5" fill="#ffffff" opacity="0.5" />
        <rect x="892" y="404" width="120" height="9" rx="4.5" fill="#ffffff" opacity="0.25" />
      </g>
      <g>
        <circle cx="872" cy="460" r="6" fill="#5e6ad2" />
        <rect x="892" y="446" width="200" height="11" rx="5.5" fill="#ffffff" opacity="0.5" />
        <rect x="892" y="464" width="140" height="9" rx="4.5" fill="#ffffff" opacity="0.25" />
      </g>
      <g>
        <circle cx="872" cy="520" r="6" fill="#febc2e" />
        <rect x="892" y="506" width="230" height="11" rx="5.5" fill="#ffffff" opacity="0.5" />
        <rect x="892" y="524" width="110" height="9" rx="4.5" fill="#ffffff" opacity="0.25" />
      </g>
      <g>
        <circle cx="872" cy="580" r="6" fill="#28c840" />
        <rect x="892" y="566" width="190" height="11" rx="5.5" fill="#ffffff" opacity="0.5" />
        <rect x="892" y="584" width="150" height="9" rx="4.5" fill="#ffffff" opacity="0.25" />
      </g>
      <g>
        <circle cx="872" cy="640" r="6" fill="#ff5f57" />
        <rect x="892" y="626" width="210" height="11" rx="5.5" fill="#ffffff" opacity="0.5" />
        <rect x="892" y="644" width="120" height="9" rx="4.5" fill="#ffffff" opacity="0.25" />
      </g>
      <g>
        <circle cx="872" cy="700" r="6" fill="#5e6ad2" />
        <rect x="892" y="686" width="180" height="11" rx="5.5" fill="#ffffff" opacity="0.5" />
        <rect x="892" y="704" width="140" height="9" rx="4.5" fill="#ffffff" opacity="0.25" />
      </g>
    </svg>
  );
}
