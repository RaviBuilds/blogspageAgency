// Fills missing SEO fields on posts shown in Studio > Posts > "Needs SEO attention".
// Uses setIfMissing, so existing values are never overwritten.
//
// Dry run (default): node --env-file=.env.local scripts/fix-seo.js
// Apply:             node --env-file=.env.local scripts/fix-seo.js --apply
//
// Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN.
import {createClient} from '@sanity/client'

const APPLY = process.argv.includes('--apply')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  perspective: 'raw', // include drafts.* documents
})

// Same condition as the Studio list in src/sanity/structure.ts.
const QUERY = `*[_type == "post" && (!defined(metaDescription) && !defined(excerpt))]
  {_id, _rev, "slug": slug.current, excerpt, metaDescription, seoTitle, seoKeywords, focusKeyword}`

// excerpt = description shown on cards; metaDescription = search snippet.
const COPY = {
  'movie-app-with-next-js-15-sanity': {
    excerpt:
      'Build a fast movie app with Next.js 15 and Sanity, and learn how to fix the async searchParams breaking change that trips up many App Router projects.',
    metaDescription:
      'See how a movie database was built with Next.js 15, Sanity and shadcn/ui in 48 hours, plus the fix for the async searchParams TypeScript errors.',
    seoTitle: 'Build a Movie App with Next.js 15 and Sanity',
    seoKeywords: ['Next.js 15', 'Sanity CMS', 'searchParams', 'App Router', 'shadcn/ui'],
  },
  'quick-and-easy-backend-development-environment-setup': {
    excerpt:
      'Set up a Node.js backend environment in VS Code step by step, from package.json and folder structure to dot files, packages and server.js. For front-end devs.',
    metaDescription:
      'New to backend work? Follow this VS Code walkthrough to create package.json, install packages and set up app.js and server.js for your Node.js project.',
    seoTitle: 'Backend Development Environment Setup in VS Code',
    seoKeywords: ['backend setup', 'Node.js', 'package.json', 'VS Code', 'npm init'],
  },
  'react-components-simplified-the-complete-beginners-guide': {
    excerpt:
      'Learn what React components are, how they split a page into reusable blocks, and how to write, export and link your first functional components.',
    metaDescription:
      'New to React? This beginner guide explains components in plain language, from JSX and imports to functional components and how they connect.',
    seoTitle: "React Components Explained: A Beginner's Guide",
    seoKeywords: ['React components', 'React for beginners', 'functional components', 'JSX', 'React basics'],
  },
  'create-an-image-gallery-with-filter-buttons-in-just-10-minutes': {
    excerpt:
      'Build an image gallery with filter buttons using HTML, CSS and JavaScript in about 10 minutes. Full code included, with a clear look at how the filtering works.',
    metaDescription:
      'Follow this step-by-step tutorial to build a filterable image gallery with plain HTML, CSS and JavaScript, using buttons and data-key attributes.',
    seoTitle: 'Image Gallery with Filter Buttons in 10 Minutes',
    seoKeywords: ['image gallery', 'filter buttons', 'HTML CSS JavaScript', 'data attributes', 'front-end tutorial'],
  },
  'how-to-connect-a-react-app-to-mongodb-database-easily': {
    excerpt:
      'Connect a React app to a MongoDB database step by step. Build a React form, an Express backend and a Mongoose model that saves student data. Beginner friendly.',
    metaDescription:
      'Learn how a React front end, Express backend and MongoDB database work together, with a working form example that saves user data to the database.',
    seoTitle: 'Connect a React App to MongoDB: Step by Step',
    seoKeywords: ['React MongoDB', 'Express.js', 'Mongoose', 'MERN stack', 'database connection'],
  },
  'react-fiber-vs-virtual-dom-how-react-optimizes-ui-updates': {
    excerpt:
      'React Fiber vs the Virtual DOM explained in simple terms. See how React tracks changes, why Fiber was introduced, and how it keeps UI updates fast.',
    metaDescription:
      'Confused by React Fiber vs Virtual DOM? Learn how each one works, why Fiber replaced the old reconciliation process, and how it speeds up UI updates.',
    seoTitle: 'React Fiber vs Virtual DOM: How Updates Work',
    seoKeywords: ['React Fiber', 'Virtual DOM', 'reconciliation', 'React performance', 'fiber node'],
  },
  'effortlessly-create-website-slider-with-html-css-swiper-js': {
    excerpt:
      'Create a responsive website slider in about 5 minutes with HTML, CSS and Swiper.js. Learn the CDN setup and the basic code for a polished banner slider.',
    metaDescription:
      'Add a smooth, responsive slider to your site with Swiper.js. This tutorial covers the CDN setup, HTML structure, CSS styles and the basic JavaScript.',
    seoTitle: 'Create a Website Slider with HTML, CSS and Swiper.js',
    seoKeywords: ['Swiper.js', 'website slider', 'image slider', 'HTML and CSS', 'JavaScript library'],
  },
  '10-tips-to-write-css-faster-for-new-web-developers': {
    excerpt:
      'Write CSS faster with 10 practical tips for new web developers, from importing fonts and universal styles to utility classes and a mobile-first approach.',
    metaDescription:
      'New to CSS? These 10 practical tips help you write CSS faster and keep stylesheets clean, readable and easy for teammates to understand and maintain.',
    seoTitle: '10 Tips to Write CSS Faster for New Developers',
    seoKeywords: ['write CSS faster', 'CSS tips', 'CSS for beginners', 'mobile-first CSS', 'web development'],
  },
  'everything-you-need-to-know-about-javascript-functions-beginner-to-pro': {
    excerpt:
      'Master JavaScript functions from basics to advanced: parameters, arrow functions, callbacks, closures, currying and generators, with clear examples.',
    metaDescription:
      'A complete guide to JavaScript functions. Go from declarations and parameters to arrow functions, higher-order functions, closures and ES6 features.',
    seoTitle: 'JavaScript Functions: Beginner to Pro Guide',
    seoKeywords: ['JavaScript functions', 'arrow functions', 'closures', 'higher-order functions', 'ES6'],
  },
  'javascript-data-types-in-web-technology-for-begginers': {
    excerpt:
      'Understand JavaScript data types with examples. Learn the primitive types (Number, String, Boolean, BigInt, Symbol) and non-primitives like objects and arrays.',
    metaDescription:
      'A beginner guide to JavaScript data types with examples. Learn how primitive and non-primitive types differ and how each is stored in memory.',
    seoTitle: 'JavaScript Data Types Explained for Beginners',
    seoKeywords: ['JavaScript data types', 'primitive types', 'non-primitive types', 'JavaScript for beginners', 'BigInt and Symbol'],
  },
}

const FOCUS = {
  'movie-app-with-next-js-15-sanity': 'Next.js 15 movie app',
  'quick-and-easy-backend-development-environment-setup': 'backend development environment setup',
  'react-components-simplified-the-complete-beginners-guide': 'React components',
  'create-an-image-gallery-with-filter-buttons-in-just-10-minutes': 'image gallery with filter buttons',
  'how-to-connect-a-react-app-to-mongodb-database-easily': 'connect React app to MongoDB',
  'react-fiber-vs-virtual-dom-how-react-optimizes-ui-updates': 'React Fiber vs Virtual DOM',
  'effortlessly-create-website-slider-with-html-css-swiper-js': 'website slider with Swiper.js',
  '10-tips-to-write-css-faster-for-new-web-developers': 'write CSS faster',
  'everything-you-need-to-know-about-javascript-functions-beginner-to-pro': 'JavaScript functions',
  'javascript-data-types-in-web-technology-for-begginers': 'JavaScript data types',
}

const LIMITS = {
  excerpt: [140, 160],
  metaDescription: [140, 160],
  seoTitle: [1, 59],
}

function validate(slug, copy) {
  const errors = []
  for (const [field, [min, max]] of Object.entries(LIMITS)) {
    const len = copy[field].length
    if (len < min || len > max) errors.push(`${slug}.${field} is ${len} chars (want ${min}-${max})`)
  }
  const n = copy.seoKeywords.length
  if (n < 4 || n > 6) errors.push(`${slug}.seoKeywords has ${n} items (want 4-6)`)
  return errors
}

const docs = await client.fetch(QUERY)
const rows = []
const patches = []
const problems = []

for (const doc of docs) {
  const copy = COPY[doc.slug]
  if (!copy) {
    problems.push(`No copy written for slug "${doc.slug}" (${doc._id}); skipped`)
    continue
  }
  problems.push(...validate(doc.slug, copy))

  // Only include fields that are currently empty; setIfMissing guards the rest.
  const set = {}
  if (!doc.excerpt) set.excerpt = copy.excerpt
  if (!doc.metaDescription) set.metaDescription = copy.metaDescription
  if (!doc.seoTitle) set.seoTitle = copy.seoTitle
  if (!doc.seoKeywords || doc.seoKeywords.length === 0) set.seoKeywords = copy.seoKeywords

  if (!doc.focusKeyword) set.focusKeyword = FOCUS[doc.slug]

  for (const [field, value] of Object.entries(set)) {
    rows.push({
      id: doc._id.startsWith('drafts.') ? 'draft' : 'published',
      slug: doc.slug,
      field,
      'new value': Array.isArray(value) ? value.join(', ') : value,
      chars: Array.isArray(value) ? value.length : value.length,
    })
  }
  patches.push({id: doc._id, rev: doc._rev, set})
}

console.log(`Matched ${docs.length} documents (published + drafts). Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}\n`)
console.table(rows)

if (problems.length) {
  console.error('\nProblems:\n- ' + problems.join('\n- '))
  process.exit(1)
}

if (!APPLY) {
  console.log('\nDry run only. Re-run with --apply to write.')
  process.exit(0)
}

let tx = client.transaction()
for (const p of patches) {
  tx = tx.patch(p.id, {ifRevisionID: p.rev, setIfMissing: p.set})
}
const result = await tx.commit()
console.log(`\nPatched ${result.results.length} documents.`)
