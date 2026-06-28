import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Author — powers the schema.org Person/author signal that underpins E-E-A-T
 * (Experience, Expertise, Authoritativeness, Trust). Search engines and LLMs
 * increasingly weight who wrote a piece, so role, bio, and verifiable profile
 * links (sameAs) materially help ranking and AI attribution.
 *
 * Backward compatible: name, slug, image, bio are unchanged. New fields are
 * additive and optional.
 */
export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job title / Role',
      type: 'string',
      description: 'e.g. "Senior Front-End Engineer". Emitted as schema.org Person.jobTitle.',
    }),
    defineField({
      name: 'image',
      title: 'Profile image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      description: 'Short author biography. Reinforces topical authority.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'URL'}],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'sameAs',
      title: 'Profile links (sameAs)',
      type: 'array',
      description:
        'Public profile URLs (LinkedIn, X, GitHub, personal site). Emitted as schema.org Person.sameAs — verifiable identity links that strengthen E-E-A-T.',
      of: [defineArrayMember({type: 'url'})],
      validation: (rule) =>
        rule.unique().max(8).custom((urls?: string[]) => {
          if (!urls) return true
          const invalid = urls.some((u) => !/^https?:\/\//.test(u))
          return invalid ? 'Profile links must be absolute http(s) URLs.' : true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'jobTitle',
      media: 'image',
    },
  },
})
