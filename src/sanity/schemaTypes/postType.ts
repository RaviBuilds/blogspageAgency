import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Post — the core editorial document for the Blogspage journal.
 *
 * Designed as a production-grade SEO publishing surface. Fields are grouped so
 * the Studio reads top-to-bottom: write the article, curate it editorially,
 * then tune SEO / social / structured-data without scrolling through noise.
 *
 * Backward compatibility: every legacy field name is preserved
 * (title, slug, author, mainImage, categories, publishedAt, content,
 * seoTitle, metaDescription, seoKeywords, ogImage). All new fields are additive
 * and optional, so existing documents and queries keep working.
 */
export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'editorial', title: 'Editorial'},
    {name: 'seo', title: 'SEO'},
    {name: 'social', title: 'Social / Open Graph'},
    {name: 'structuredData', title: 'Structured Data (FAQ)'},
  ],
  fields: [
    // ---------------------------------------------------------------- Content
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'The H1 / headline. Aim for a clear, keyword-led title under ~70 characters.',
      validation: (rule) =>
        rule
          .required()
          .min(15)
          .warning('Titles under 15 characters rarely communicate enough for search.')
          .max(90)
          .warning('Long titles get truncated in search results and social cards.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'The URL path segment. Keep it short, lowercase, and stable — changing it breaks links.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'A one or two sentence summary. Powers blog cards, the meta-description fallback, RSS, and AI/LLM answer extraction. Write it as a standalone snippet.',
      validation: (rule) =>
        rule
          .required()
          .min(50)
          .max(200)
          .error('Excerpt should be between 50 and 200 characters.'),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: {type: 'author'},
      description: 'Bylined author. Drives the schema.org Person/author signal (E-E-A-T).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'content',
      description: 'Hero / featured image. Used in cards, the article header, and as the social fallback.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the image for screen readers and image search. Required.',
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              if (parent?.asset && !value) {
                return 'Alternative text is required when an image is set.'
              }
              return true
            }),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional visible caption rendered beneath the image.',
        }),
        defineField({
          name: 'credit',
          type: 'string',
          title: 'Credit / Source',
          description: 'Optional attribution (photographer, stock source, license).',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
      description: 'One or more topic categories. The first category is treated as primary.',
      validation: (rule) => rule.required().min(1).max(3).unique(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
      description:
        'Publication date. Posts with a future date are hidden from the live site until that time (scheduled publishing).',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      group: 'content',
      validation: (rule) => rule.required(),
    }),

    // -------------------------------------------------------------- Editorial
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'editorial',
      description: 'Surface this post in featured / hero slots on listing pages.',
      initialValue: false,
    }),
    defineField({
      name: 'evergreen',
      title: 'Evergreen',
      type: 'boolean',
      group: 'editorial',
      description:
        'Mark content that stays relevant over time. Evergreen posts use a slower sitemap change frequency and are exempt from freshness nudges.',
      initialValue: false,
    }),
    defineField({
      name: 'lastReviewed',
      title: 'Last reviewed',
      type: 'datetime',
      group: 'editorial',
      description:
        'When the content was last fact-checked / updated. Emitted as schema.org dateModified — a strong freshness signal for Google and Discover.',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related posts',
      type: 'array',
      group: 'editorial',
      description:
        'Hand-pick up to 3 related articles for internal linking and topic clustering. Leave empty to fall back to automatic same-category suggestions.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: {type: 'post'},
          options: {
            // Prevent self-references and duplicates.
            filter: ({document}) => ({
              filter: '_id != $id && !(_id in path("drafts.**"))',
              params: {id: (document as {_id?: string})._id?.replace('drafts.', '') ?? ''},
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(3).unique(),
    }),

    // -------------------------------------------------------------------- SEO
    defineField({
      name: 'focusKeyword',
      title: 'Focus keyword',
      type: 'string',
      group: 'seo',
      description:
        'The single primary phrase this post should rank for. Editorial discipline only — used by the SEO checklist in the preview, not rendered.',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Keywords',
      type: 'array',
      group: 'seo',
      of: [defineArrayMember({type: 'string'})],
      description: 'Supporting / secondary keywords and topical tags.',
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.unique().max(15),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Optional override for the browser tab and search result title. Falls back to Title.',
      validation: (rule) =>
        rule.max(60).warning('SEO titles over 60 characters may be truncated in search results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Search snippet description. Falls back to the Excerpt when blank.',
      validation: (rule) =>
        rule
          .min(120)
          .warning('Meta descriptions under 120 characters under-use the search snippet.')
          .max(160)
          .warning('Meta descriptions over 160 characters get truncated in search results.'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      description:
        'Set only when this content is a copy of, or was first published at, another URL (e.g. migrated/syndicated content). Leave blank to self-canonicalise.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      group: 'seo',
      description: 'Emit a noindex robots tag. Use for thin, outdated, or staging content.',
      initialValue: false,
    }),
    defineField({
      name: 'nofollow',
      title: 'Do not follow links (nofollow)',
      type: 'boolean',
      group: 'seo',
      description: 'Emit a nofollow robots tag. Rarely needed — leave off unless you have a reason.',
      initialValue: false,
    }),

    // -------------------------------------------------------- Social / Open Graph
    defineField({
      name: 'ogTitle',
      title: 'Social title',
      type: 'string',
      group: 'social',
      description: 'Optional title for social shares (Open Graph + X/Twitter). Falls back to SEO Title / Title.',
      validation: (rule) => rule.max(70).warning('Social titles over 70 characters may be clipped.'),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Social description',
      type: 'text',
      rows: 2,
      group: 'social',
      description: 'Optional description for social shares. Falls back to Meta Description / Excerpt.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social image',
      type: 'image',
      group: 'social',
      description:
        'Override for LinkedIn, X/Twitter, and other social previews (1200×630 recommended). Falls back to Main Image. X/Twitter reuses this — no separate Twitter image needed.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),

    // --------------------------------------------------------- Structured data
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'structuredData',
      description:
        'Optional question/answer pairs. Rendered on the page and emitted as FAQPage structured data — eligible for FAQ rich results and AI answer extraction.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'Q&A',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required().max(160),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().min(20),
            }),
          ],
          preview: {
            select: {title: 'question', subtitle: 'answer'},
          },
        }),
      ],
      validation: (rule) => rule.max(10),
    }),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Recently reviewed',
      name: 'lastReviewedDesc',
      by: [{field: 'lastReviewed', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
      featured: 'featured',
      metaDescription: 'metaDescription',
      excerpt: 'excerpt',
    },
    prepare(selection) {
      const {title, author, media, publishedAt, featured, metaDescription, excerpt} = selection
      const future = publishedAt && new Date(publishedAt) > new Date()
      const hasDescription = Boolean(metaDescription || excerpt)
      const flags = [
        featured ? '★ Featured' : null,
        future ? '⏳ Scheduled' : null,
        hasDescription ? null : '⚠ No description',
      ]
        .filter(Boolean)
        .join(' · ')
      const by = author ? `by ${author}` : 'No author'
      return {
        title,
        media,
        subtitle: flags ? `${by} — ${flags}` : by,
      }
    },
  },
})
