import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-06-14";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
}

if (!token) {
  throw new Error("Missing SANITY_WRITE_TOKEN in .env.local");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function portableTextBlock(text: string, key: string) {
  return {
    _type: "block" as const,
    _key: key,
    style: "normal" as const,
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: `${key}-span`,
        text,
        marks: [] as string[],
      },
    ],
  };
}

const author = {
  _id: "author-ravi",
  _type: "author" as const,
  name: "Ravi",
  slug: { _type: "slug" as const, current: "ravi" },
  bio: [
    portableTextBlock(
      "Top Rated Front-End Developer and AI Automation Expert specializing in Next.js, headless architecture, and scalable web solutions.",
      "bio-1"
    ),
  ],
};

const categories = [
  {
    title: "Web Development",
    description:
      "Expert tutorials, modern frontend architecture, and full-stack engineering practices.",
  },
  {
    title: "AI & Automation",
    description:
      "Strategies and tools for leveraging Artificial Intelligence to automate workflows and scale business operations.",
  },
  {
    title: "Programming",
    description:
      "Comprehensive coding guides, language fundamentals, and software engineering concepts.",
  },
  {
    title: "Tech Insights",
    description:
      "Industry trends, SaaS architecture, and deep-dives into the modern technology landscape.",
  },
].map((category) => {
  const slug = slugify(category.title);

  return {
    _id: `category-${slug}`,
    _type: "category" as const,
    title: category.title,
    slug: { _type: "slug" as const, current: slug },
    description: category.description,
  };
});

async function seed() {
  console.log(`Seeding Sanity dataset "${dataset}" (project: ${projectId})...\n`);

  const authorResult = await client.createOrReplace(author);
  console.log(`✓ Author: ${authorResult.name} (${authorResult._id})`);

  for (const category of categories) {
    const result = await client.createOrReplace(category);
    console.log(`✓ Category: ${result.title} (${result._id})`);
  }

  console.log("\nSeed complete.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
