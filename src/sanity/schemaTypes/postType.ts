import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & Metadata'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'author',
      type: 'reference',
      group: 'content',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      group: 'content',
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
    defineField({
      name: 'categories',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Optional override for the browser tab and search result title.',
      validation: (rule) =>
        rule.max(60).warning('SEO titles over 60 characters may be truncated in search results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Core description shown in search engine results.',
      validation: (rule) =>
        rule
          .required()
          .min(120)
          .max(160)
          .error('Meta description must be between 120 and 160 characters for optimal search rendering.'),
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      group: 'seo',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'seo',
      description:
        'Optional override for LinkedIn, Twitter, and other social previews. Falls back to Main Image when blank.',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
