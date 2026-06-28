import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Category — top-level topical taxonomy for posts.
 *
 * DECISION: kept intentionally FLAT (no parent/child hierarchy).
 * Blogspage runs a small, curated set of broad categories (Web Development,
 * AI & Automation, Programming, Tech Insights). Nested category trees add
 * editorial overhead, ambiguous canonical paths, and crawl-budget dilution
 * with no ranking benefit at this scale. Fine-grained topics are handled by
 * the post-level `seoKeywords` tags instead. Revisit hierarchy only if the
 * catalogue grows past ~15 categories.
 */
export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Used on category landing/listing surfaces and as category meta description.',
      validation: (rule) => rule.max(200),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
