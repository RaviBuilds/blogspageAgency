/**
 * One-off asset prep for the brand logo and the Best100Movies screenshot.
 *
 * Both files were committed at their authoring resolution and cost far more
 * than they can ever deliver:
 *
 * - `blogspage-logo.png` was 2156x647 / 1894 KB. It renders at `h-11` in the
 *   navbar and `h-10` in the footer — about 147 CSS px wide, so ~441 px even at
 *   DPR 3. The file also carries a baked near-black backing plate whose dither
 *   spans 50,994 unique RGB values, which is why PNG could not compress it.
 *   The plate is load-bearing: the mark is light-on-dark (mean luma 139), and
 *   the navbar pill turns light on scroll, so the plate is what keeps the mark
 *   legible there. It is preserved; only the resolution changes.
 *
 * - `movieDB.png` was 1266x922 / 1299 KB with a measured 0.00% transparency —
 *   both fully and partially transparent pixels. The alpha channel was pure
 *   overhead on an opaque screenshot, while its four siblings are JPEGs at
 *   115-179 KB.
 *
 * Reversibility: the pre-optimisation bytes live in git history. Recover with
 *   git show HEAD:public/blogspage-logo.png > public/blogspage-logo.png
 *
 * Run: node scripts/optimize-brand-assets.mjs
 */
import { rename, unlink } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";

const kb = (file) => Math.round(statSync(file).size / 1024);

/**
 * Sharp cannot write to the file it is reading, so every transform lands on a
 * sibling temp path and is swapped in only after it succeeds.
 */
async function replaceInPlace(file, build) {
  if (!existsSync(file)) {
    console.log(`skip ${file} — not present`);
    return;
  }
  const before = kb(file);
  const tmp = `${file}.tmp`;
  await build(sharp(file), tmp);
  const after = kb(tmp);
  await unlink(file);
  await rename(tmp, file);
  console.log(
    `${file}: ${before} KB -> ${after} KB  (-${Math.round((1 - after / before) * 100)}%)`,
  );
}

/*
 * 862 px keeps ~2x headroom over the 441 px a DPR-3 phone requests, so the
 * navbar and footer marks stay pin-sharp while the source stops being a
 * multi-megabyte upload. Aspect ratio 3.3323 is preserved exactly, which is
 * what keeps the existing width/height props (320x96, 400x120) CLS-free.
 */
await replaceInPlace("public/blogspage-logo.png", (img, out) =>
  img.resize({ width: 862 }).png({ compressionLevel: 9, effort: 10 }).toFile(out),
);

/*
 * q90 / 4:4:4 rather than a smaller q: this file is a *source* that
 * `next/image` re-encodes to AVIF/WebP per request, so faithfulness here buys
 * quality in every derived size. Full chroma keeps the UI text in the
 * screenshot crisp. Measured cost vs the PNG: mean 1.73/255, p99 13.
 */
const MOVIE_PNG = "public/movieDB.png";
const MOVIE_JPG = "public/movieDB.jpg";
if (existsSync(MOVIE_PNG)) {
  const before = kb(MOVIE_PNG);
  await sharp(MOVIE_PNG)
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(MOVIE_JPG);
  await unlink(MOVIE_PNG);
  console.log(
    `${MOVIE_PNG} -> ${MOVIE_JPG}: ${before} KB -> ${kb(MOVIE_JPG)} KB  (-${Math.round((1 - kb(MOVIE_JPG) / before) * 100)}%)`,
  );
} else {
  console.log(`skip ${MOVIE_PNG} — already converted`);
}
