import type { SVGProps } from "react";

/**
 * Inline placeholder preview for the gym member portal pillar.
 * Converted from `public/gym-member-placeholder.svg` so it renders as a
 * plain React SVG component instead of going through the Next.js image
 * pipeline (see design.md "Security headers and image configuration").
 */
export function GymMemberPlaceholder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1280"
      height="800"
      viewBox="0 0 1280 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gym member portal preview"
      {...props}
    >
      <defs>
        <linearGradient id="bgM" x1="0" y1="0" x2="1280" y2="800" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c0c0f" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="accM" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5e6ad2" />
          <stop offset="1" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      <rect width="1280" height="800" fill="url(#bgM)" />

      {/* sidebar */}
      <rect x="0" y="0" width="248" height="800" fill="#0f1011" />
      <line x1="248" y1="0" x2="248" y2="800" stroke="#ffffff" strokeOpacity="0.06" />
      <circle cx="68" cy="64" r="16" fill="url(#accM)" />
      <rect x="96" y="56" width="96" height="16" rx="8" fill="#f7f8f8" opacity="0.85" />
      <rect x="40" y="150" width="168" height="40" rx="10" fill="#5e6ad2" opacity="0.18" />
      <rect x="64" y="162" width="110" height="14" rx="7" fill="#f7f8f8" opacity="0.85" />
      <rect x="64" y="222" width="120" height="12" rx="6" fill="#ffffff" opacity="0.35" />
      <rect x="64" y="270" width="100" height="12" rx="6" fill="#ffffff" opacity="0.35" />
      <rect x="64" y="318" width="130" height="12" rx="6" fill="#ffffff" opacity="0.35" />
      <rect x="64" y="366" width="90" height="12" rx="6" fill="#ffffff" opacity="0.35" />

      {/* header */}
      <rect x="288" y="48" width="220" height="24" rx="8" fill="#f7f8f8" opacity="0.9" />
      <rect x="288" y="82" width="160" height="12" rx="6" fill="#ffffff" opacity="0.3" />

      {/* membership card */}
      <rect x="288" y="132" width="600" height="180" rx="18" fill="url(#accM)" />
      <rect x="320" y="164" width="120" height="14" rx="7" fill="#ffffff" opacity="0.7" />
      <rect x="320" y="196" width="240" height="26" rx="8" fill="#ffffff" opacity="0.95" />
      <rect x="320" y="252" width="160" height="12" rx="6" fill="#ffffff" opacity="0.6" />
      <circle cx="820" cy="232" r="44" fill="#ffffff" opacity="0.12" />
      <circle
        cx="820"
        cy="232"
        r="44"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="6"
        strokeDasharray="180 100"
      />

      {/* BMI / health stat */}
      <rect x="912" y="132" width="304" height="180" rx="18" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
      <rect x="940" y="160" width="120" height="12" rx="6" fill="#ffffff" opacity="0.4" />
      <rect x="940" y="190" width="90" height="34" rx="8" fill="#5e6ad2" />
      <rect x="940" y="248" width="248" height="40" rx="12" fill="#ffffff" opacity="0.06" />
      <rect x="956" y="262" width="150" height="12" rx="6" fill="#ffffff" opacity="0.4" />

      {/* supplement store */}
      <rect x="288" y="344" width="928" height="48" rx="10" fill="none" />
      <rect x="288" y="352" width="200" height="18" rx="8" fill="#f7f8f8" opacity="0.85" />
      <g>
        <rect x="288" y="408" width="296" height="320" rx="16" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="312" y="432" width="248" height="150" rx="12" fill="#5e6ad2" opacity="0.15" />
        <rect x="312" y="602" width="160" height="14" rx="7" fill="#f7f8f8" opacity="0.8" />
        <rect x="312" y="628" width="100" height="12" rx="6" fill="#ffffff" opacity="0.35" />
        <rect x="312" y="672" width="248" height="36" rx="10" fill="url(#accM)" />
      </g>
      <g>
        <rect x="604" y="408" width="296" height="320" rx="16" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="628" y="432" width="248" height="150" rx="12" fill="#9333ea" opacity="0.15" />
        <rect x="628" y="602" width="180" height="14" rx="7" fill="#f7f8f8" opacity="0.8" />
        <rect x="628" y="628" width="100" height="12" rx="6" fill="#ffffff" opacity="0.35" />
        <rect x="628" y="672" width="248" height="36" rx="10" fill="url(#accM)" />
      </g>
      <g>
        <rect x="920" y="408" width="296" height="320" rx="16" fill="#141516" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="944" y="432" width="248" height="150" rx="12" fill="#5e6ad2" opacity="0.15" />
        <rect x="944" y="602" width="140" height="14" rx="7" fill="#f7f8f8" opacity="0.8" />
        <rect x="944" y="628" width="100" height="12" rx="6" fill="#ffffff" opacity="0.35" />
        <rect x="944" y="672" width="248" height="36" rx="10" fill="url(#accM)" />
      </g>
    </svg>
  );
}
