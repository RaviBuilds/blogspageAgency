import {defineType, defineArrayMember, defineField} from 'sanity'
import {ImageIcon, CodeBlockIcon} from '@sanity/icons'

/**
 * Block content for the post body.
 *
 * Improvements over the starter schema:
 *  - `internalLink` annotation — links to other posts by reference. This is the
 *    backbone of internal linking / topic clusters: references stay valid even
 *    if a slug changes, and crawlers get clean, resolvable internal links.
 *  - External `link` now carries new-tab + nofollow/sponsored controls so
 *    outbound links can be marked correctly for SEO.
 *  - Images gain a caption (rendered + usable for ImageObject schema).
 *  - `codeBlock` for syntax-highlightable snippets (this is a developer blog).
 */
export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike-through', value: 'strike-through'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          {
            title: 'Internal link',
            name: 'internalLink',
            type: 'object',
            fields: [
              defineField({
                name: 'reference',
                type: 'reference',
                title: 'Post',
                to: [{type: 'post'}],
                validation: (rule) => rule.required(),
              }),
            ],
          },
          {
            title: 'External link',
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (rule) =>
                  rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
              }),
              defineField({
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              }),
              defineField({
                title: 'Nofollow / sponsored',
                name: 'nofollow',
                type: 'boolean',
                description: 'Add rel="nofollow" — use for paid, affiliate, or untrusted links.',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              if (parent?.asset && !value) {
                return 'Alternative text is required for in-content images.'
              }
              return true
            }),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code block',
      icon: CodeBlockIcon,
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              {title: 'Plain text', value: 'text'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'JavaScript', value: 'javascript'},
              {title: 'TSX / JSX', value: 'tsx'},
              {title: 'JSON', value: 'json'},
              {title: 'Bash / Shell', value: 'bash'},
              {title: 'CSS', value: 'css'},
              {title: 'HTML', value: 'html'},
              {title: 'GROQ', value: 'groq'},
              {title: 'SQL', value: 'sql'},
            ],
          },
          initialValue: 'text',
        }),
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 8,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'filename',
          title: 'Filename (optional)',
          type: 'string',
        }),
      ],
      preview: {
        select: {language: 'language', filename: 'filename', code: 'code'},
        prepare({language, filename, code}) {
          return {
            title: filename || `${language ?? 'text'} snippet`,
            subtitle: code ? code.slice(0, 50) : '',
          }
        },
      },
    }),
    defineArrayMember({
      type: 'ctaBlock',
    }),
  ],
})
