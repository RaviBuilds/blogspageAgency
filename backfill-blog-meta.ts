import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "node:path";

/**
 * One-off backfill for the redesigned blog schema.
 *
 * Populates `excerpt` for existing posts (now a required field) by deriving it
 * from the meta description, or failing that the first paragraph of content.
 * Idempotent: skips posts that already have an excerpt.
 *
 * Run a preview first:   npx tsx backfill-blog-meta.ts --dry-run
 * Then apply:            npx tsx backfill-blog-meta.ts
 */

config({ path: resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-06-14";

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
if (!token) throw new Error("Missing SANITY_WRITE_TOKEN in .env.local");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

type Block = { _type?: string; children?: { text?: string }[] };
type Post = {
  _id: string;
  title?: string;
  excerpt?: string;
  metaDescription?: string;
  content?: Block[];
};

function portableTextToPlain(blocks?: Block[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b) => b?._type === "block")
    .map((b) => (b.children ?? []).map((c) => c?.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveExcerpt(post: Post): string | null {
  if (post.excerpt) return null; // already set

  if (post.metaDescription) {
    return post.metaDescription.slice(0, 200).trim();
  }

  const plain = portableTextToPlain(post.content);
  if (!plain) return null;

  // Take the first ~180 chars, cut on a word boundary.
  const slice = plain.slice(0, 180);
  const trimmed = slice.slice(0, slice.lastIndexOf(" ") > 50 ? slice.lastIndexOf(" ") : slice.length);
  return `${trimmed.trim()}…`;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const posts = await client.fetch<Post[]>(
    `*[_type == "post"]{ _id, title, excerpt, metaDescription, content }`,
  );

  console.log(`Found ${posts.length} post(s).${dryRun ? " (dry run)" : ""}\n`);

  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    const excerpt = deriveExcerpt(post);
    if (!excerpt) {
      skipped++;
      continue;
    }

    console.log(`• ${post.title ?? post._id}\n  → "${excerpt}"`);

    if (!dryRun) {
      await client.patch(post._id).set({ excerpt }).commit();
    }
    updated++;
  }

  console.log(`\nDone. Updated: ${updated} · Skipped (already set / empty): ${skipped}`);
}

main().catch((error) => {
  console.error("Backfill failed:", error);
  process.exit(1);
});
