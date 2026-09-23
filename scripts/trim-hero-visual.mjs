/**
 * One-off asset prep for the hero visual.
 *
 * The source render (`hero-visual-original.png`) is a 1536x1024 canvas where the
 * artwork only occupies a 767x554 region offset toward the right. That padding
 * makes CSS positioning unpredictable: `object-contain` letterboxes the empty
 * canvas, not the art. This trims the fully transparent border so the file's box
 * equals the artwork's box, and the component can position it precisely.
 *
 * Run: node scripts/trim-hero-visual.mjs
 */
import { existsSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import sharp from "sharp";

const LIVE = "public/hero-visual.png";
const ORIGINAL = "public/hero-visual-original.png";

// Preserve the untrimmed render once so this script is idempotent and reversible.
if (!existsSync(ORIGINAL)) {
  await copyFile(LIVE, ORIGINAL);
  console.log(`Backed up ${LIVE} -> ${ORIGINAL}`);
}

const out = await sharp(ORIGINAL)
  .ensureAlpha()
  // threshold 0 => trim only pixels that are fully transparent, keeping the
  // soft glow falloff that lets the render blend into the dark hero.
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
  .png({ compressionLevel: 9 })
  .toFile(LIVE);

console.log(`Wrote ${LIVE}: ${out.width}x${out.height}`);
console.log(`Aspect ratio: ${(out.width / out.height).toFixed(4)}`);
