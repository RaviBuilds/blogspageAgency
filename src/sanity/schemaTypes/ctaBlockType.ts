import {RocketIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const ctaBlockType = defineType({
  name: 'ctaBlock',
  title: 'Call to Action',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'primaryLabel',
      title: 'Primary button label',
      type: 'string',
      initialValue: 'Start a conversation',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondaryLabel',
      title: 'Secondary button label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondaryHref',
      title: 'Secondary button URL',
      type: 'string',
      description: 'Relative path (e.g. /#services) or full URL.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
      primaryLabel: 'primaryLabel',
    },
    prepare({headline, primaryLabel}) {
      return {
        title: headline || 'Call to Action',
        subtitle: primaryLabel ? `Primary: ${primaryLabel}` : 'CTA block',
      }
    },
  },
})
