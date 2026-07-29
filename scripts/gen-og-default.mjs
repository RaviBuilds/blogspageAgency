// Regenerates public/og-default.png — the static 1200x630 fallback Social_Preview_Image
// referenced by src/lib/seo.ts (ogImageUrl) and the src/app/og/route.tsx failure/timeout path.
// Run with: node scripts/gen-og-default.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0f" />
      <stop offset="100%" stop-color="#14141f" />
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="none" stroke="#27272a" stroke-width="2" />
  <text x="90" y="330" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="700" fill="#f5f5f7">Blogspage</text>
  <text x="90" y="400" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="500" fill="#a1a1aa" letter-spacing="2">AI AGENCY</text>
  <text x="90" y="560" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" fill="#71717a">blogspage.com</text>
</svg>
`;

const outputPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "og-default.png"
);

const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(outputPath, buffer);

const meta = await sharp(buffer).metadata();
console.log(`Wrote ${outputPath} (${meta.width}x${meta.height}, ${buffer.length} bytes)`);
