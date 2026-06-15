import dotenv from 'dotenv'
import {createClient} from '@sanity/client'
import {randomUUID} from 'crypto'

dotenv.config({path: '.env.local'})

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_WRITE_TOKEN) {
  throw new Error(
    'Missing required environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_WRITE_TOKEN',
  )
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-06-14',
  useCdn: false,
})

type Span = {
  _type: 'span'
  _key?: string
  text: string
  marks?: string[]
}

type MarkDef = {
  _key: string
  _type: string
  [key: string]: unknown
}

type Block = {
  _type: 'block'
  _key?: string
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
  children?: unknown[]
  markDefs?: MarkDef[]
}

type ContentItem = Block | Record<string, unknown>

type Post = {
  _id: string
  _rev: string
  title?: string
  content?: unknown
}

const BLOCK_LEVEL_STYLES = new Set([
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
])

function generateKey(): string {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

function isSpan(value: unknown): value is Span {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Span)._type === 'span' &&
    typeof (value as Span).text === 'string'
  )
}

function isBlock(value: unknown): value is Block {
  return typeof value === 'object' && value !== null && (value as Block)._type === 'block'
}

function ensureKey<T extends {_key?: string}>(item: T): T {
  return item._key ? item : {...item, _key: generateKey()}
}

function cloneBlock(block: Block, overrides: Partial<Block> = {}): Block {
  return ensureKey({
    ...block,
    ...overrides,
    markDefs: overrides.markDefs ?? block.markDefs ?? [],
    children: overrides.children ?? block.children ?? [],
  })
}

function createSpan(text: string, marks: string[] = [], markDefs: MarkDef[] = []): Span {
  return ensureKey({
    _type: 'span',
    text,
    marks: marks.filter((mark) => markDefs.some((def) => def._key === mark) || mark !== ''),
  })
}

function spansAreEmpty(spans: Span[]): boolean {
  return spans.length === 0 || spans.every((span) => span.text.trim() === '')
}

/**
 * Split a block whose children illegally contain block-level objects.
 * Valid PT blocks may only contain span children.
 */
function splitBlockWithInvalidChildren(block: Block): Block[] {
  const children = Array.isArray(block.children) ? block.children : []
  const markDefs = Array.isArray(block.markDefs) ? block.markDefs : []

  const hasInvalidChildren = children.some((child) => !isSpan(child))
  const nestedBlocksField = Array.isArray((block as Record<string, unknown>).blocks)
    ? ((block as Record<string, unknown>).blocks as unknown[])
    : null

  if (!hasInvalidChildren && !nestedBlocksField) {
    return [normalizeStyleConflicts(block)]
  }

  const output: Block[] = []
  let spanBuffer: Span[] = []

  const flushSpanBuffer = () => {
    if (spansAreEmpty(spanBuffer)) {
      spanBuffer = []
      return
    }

    output.push(
      cloneBlock(block, {
        style: block.style ?? 'normal',
        listItem: undefined,
        level: undefined,
        children: spanBuffer,
        markDefs,
      }),
    )
    spanBuffer = []
  }

  for (const child of children) {
    if (isSpan(child)) {
      spanBuffer.push(ensureKey(child))
      continue
    }

    flushSpanBuffer()

    if (isBlock(child)) {
      output.push(...splitBlockWithInvalidChildren(child))
      continue
    }

    if (typeof child === 'object' && child !== null && '_type' in child) {
      output.push(child as Block)
    }
  }

  flushSpanBuffer()

  if (nestedBlocksField) {
    for (const nested of nestedBlocksField) {
      if (isBlock(nested)) {
        output.push(...splitBlockWithInvalidChildren(nested))
      } else if (typeof nested === 'object' && nested !== null) {
        output.push(nested as Block)
      }
    }
  }

  return output.length > 0 ? output.map(normalizeStyleConflicts) : [normalizeStyleConflicts(block)]
}

/**
 * A "normal" paragraph must not also declare listItem/level.
 * List semantics belong on their own blocks.
 */
function normalizeStyleConflicts(block: Block): Block {
  const style = block.style ?? 'normal'
  const children = (Array.isArray(block.children) ? block.children : []).filter(isSpan)

  if (style === 'normal' && block.listItem) {
    const text = children.map((span) => span.text).join('').trim()

    if (text.length > 0) {
      return cloneBlock(block, {
        children,
        listItem: undefined,
        level: undefined,
      })
    }

    return cloneBlock(block, {
      style: 'normal',
      children: children.length > 0 ? children : [createSpan(' ')],
    })
  }

  if (style === 'normal' && BLOCK_LEVEL_STYLES.has(style)) {
    return block
  }

  return cloneBlock(block, {children})
}

function sanitizePortableTextBlock(block: Block): Block[] {
  const split = splitBlockWithInvalidChildren(block)

  return split.flatMap((item) => {
    const style = item.style ?? 'normal'

    if (style === 'normal') {
      const children = item.children ?? []
      const text = children.filter(isSpan).map((span) => span.text).join('').trim()

      if (
        text.startsWith('"') &&
        text.endsWith('"') &&
        text.length > 2 &&
        children.length === 1
      ) {
        return [
          cloneBlock(item, {
            style: 'blockquote',
            children: [createSpan(text.slice(1, -1), children[0].marks ?? [], item.markDefs ?? [])],
          }),
        ]
      }
    }

    return [item]
  })
}

function flattenContentArray(content: unknown[]): ContentItem[] {
  const flattened: ContentItem[] = []

  for (const item of content) {
    if (Array.isArray(item)) {
      flattened.push(...flattenContentArray(item))
      continue
    }
    flattened.push(item as ContentItem)
  }

  return flattened
}

function sanitizePortableText(content: unknown): ContentItem[] {
  if (!Array.isArray(content)) return []

  const flattened = flattenContentArray(content)
  const sanitized: ContentItem[] = []

  for (const item of flattened) {
    if (!item || typeof item !== 'object') continue

    if (isBlock(item)) {
      sanitized.push(...sanitizePortableTextBlock(item))
      continue
    }

    sanitized.push(ensureKey(item as Block))
  }

  return sanitized.filter(Boolean)
}

function contentChanged(before: unknown, after: ContentItem[]): boolean {
  return JSON.stringify(before) !== JSON.stringify(after)
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  const posts = await client.fetch<Post[]>(
    `*[_type == "post" && defined(content)]{
      _id,
      _rev,
      title,
      content
    }`,
  )

  console.log(`Found ${posts.length} post(s) with content.`)

  let updated = 0
  let unchanged = 0
  let failed = 0

  for (const post of posts) {
    const sanitized = sanitizePortableText(post.content)

    if (!contentChanged(post.content, sanitized)) {
      unchanged++
      continue
    }

    console.log(`Sanitizing: ${post.title ?? post._id}`)

    try {
      if (!dryRun) {
        await client.patch(post._id).set({content: sanitized}).commit()
      }
      updated++
    } catch (error) {
      failed++
      console.error(`Failed to update ${post._id}:`, error)
    }
  }

  console.log('')
  console.log(`Done${dryRun ? ' (dry run — no writes)' : ''}.`)
  console.log(`Updated: ${updated}`)
  console.log(`Unchanged: ${unchanged}`)
  console.log(`Failed: ${failed}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
