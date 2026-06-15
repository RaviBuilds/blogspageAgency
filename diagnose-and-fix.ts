/**
 * Surgical Portable Text diagnose-and-fix for a single post.
 *
 * Inspect only (default):
 *   npx tsx diagnose-and-fix.ts
 *
 * Write fix to production:
 *   npx tsx diagnose-and-fix.ts --apply
 */

import dotenv from 'dotenv'
import {createClient} from '@sanity/client'
import {randomUUID} from 'crypto'

dotenv.config({path: '.env.local'})

const TARGET_SLUG = 'javascript-data-types-in-web-technology-for-begginers'

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
  href?: string
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
  blocks?: unknown[]
  [key: string]: unknown
}

type ContentItem = Block | Record<string, unknown>

type Post = {
  _id: string
  _rev: string
  title?: string
  slug?: string
  content?: unknown
}

type IssueCode =
  | 'nested_array_in_children'
  | 'non_span_child'
  | 'block_object_in_children'
  | 'div_or_unknown_in_children'
  | 'illegal_markDef'
  | 'orphan_mark_reference'
  | 'nonstandard_block_field'

type DiagnosticIssue = {
  code: IssueCode
  path: string
  node: unknown
}

const BLOCK_SCHEMA_KEYS = new Set([
  '_type',
  '_key',
  'style',
  'listItem',
  'level',
  'children',
  'markDefs',
])

const DECORATOR_MARKS = new Set([
  'strong',
  'em',
  'underline',
  'strike-through',
  'code',
])

function isDecoratorMark(mark: string): boolean {
  return DECORATOR_MARKS.has(mark)
}

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

function isNormalStyle(style: string | undefined): boolean {
  return style === undefined || style === 'normal'
}

function ensureKey<T extends {_key?: string}>(item: T): T {
  return item._key ? item : {...item, _key: generateKey()}
}

function isValidLinkMarkDef(def: unknown): def is MarkDef {
  if (typeof def !== 'object' || def === null) return false
  const d = def as MarkDef
  return (
    typeof d._key === 'string' &&
    d._type === 'link' &&
    typeof d.href === 'string' &&
    d.href.length > 0
  )
}

// ---------------------------------------------------------------------------
// diagnoseContent
// ---------------------------------------------------------------------------

function diagnoseBlockChildren(
  block: Block,
  blockPath: string,
  issues: DiagnosticIssue[],
): void {
  const style = block.style
  const children = block.children

  if (!Array.isArray(children)) return

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const childPath = `${blockPath}.children[${i}]`

    if (Array.isArray(child)) {
      issues.push({
        code: 'nested_array_in_children',
        path: childPath,
        node: child,
      })
      continue
    }

    if (!isSpan(child)) {
      issues.push({
        code: 'non_span_child',
        path: childPath,
        node: child,
      })

      if (isBlock(child)) {
        issues.push({
          code: 'block_object_in_children',
          path: childPath,
          node: child,
        })
      } else if (
        typeof child === 'object' &&
        child !== null &&
        '_type' in child
      ) {
        const childType = (child as {_type: string})._type
        if (childType === 'div' || childType === 'blockquote' || childType !== 'span') {
          issues.push({
            code: 'div_or_unknown_in_children',
            path: childPath,
            node: child,
          })
        }
      }
    }

    if (isBlock(child)) {
      diagnoseBlock(child, childPath, issues)
    }
  }
}

function diagnoseMarkDefs(block: Block, blockPath: string, issues: DiagnosticIssue[]): void {
  const markDefs = block.markDefs
  if (!Array.isArray(markDefs)) return

  const validKeys = new Set<string>()

  for (let i = 0; i < markDefs.length; i++) {
    const def = markDefs[i]
    const defPath = `${blockPath}.markDefs[${i}]`

    if (!isValidLinkMarkDef(def)) {
      issues.push({
        code: 'illegal_markDef',
        path: defPath,
        node: def,
      })
      continue
    }

    validKeys.add(def._key)
  }

  const children = Array.isArray(block.children) ? block.children : []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (!isSpan(child) || !Array.isArray(child.marks)) continue

    for (const mark of child.marks) {
      if (!isDecoratorMark(mark) && !validKeys.has(mark)) {
        issues.push({
          code: 'orphan_mark_reference',
          path: `${blockPath}.children[${i}].marks`,
          node: {mark, span: child},
        })
      }
    }
  }
}

function diagnoseNonstandardFields(
  block: Block,
  blockPath: string,
  issues: DiagnosticIssue[],
): void {
  for (const key of Object.keys(block)) {
    if (BLOCK_SCHEMA_KEYS.has(key)) continue
    if (key === 'blocks' && Array.isArray(block.blocks)) {
      issues.push({
        code: 'nonstandard_block_field',
        path: `${blockPath}.${key}`,
        node: block.blocks,
      })
    } else if (key !== 'blocks') {
      issues.push({
        code: 'nonstandard_block_field',
        path: `${blockPath}.${key}`,
        node: block[key],
      })
    }
  }
}

function diagnoseBlock(block: Block, blockPath: string, issues: DiagnosticIssue[]): void {
  diagnoseNonstandardFields(block, blockPath, issues)
  diagnoseMarkDefs(block, blockPath, issues)
  diagnoseBlockChildren(block, blockPath, issues)
}

export function diagnoseContent(
  content: unknown,
  basePath = 'content',
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = []

  if (!Array.isArray(content)) {
    return issues
  }

  for (let i = 0; i < content.length; i++) {
    const item = content[i]
    const itemPath = `${basePath}[${i}]`

    if (Array.isArray(item)) {
      issues.push({
        code: 'nested_array_in_children',
        path: itemPath,
        node: item,
      })
      continue
    }

    if (isBlock(item)) {
      diagnoseBlock(item, itemPath, issues)
    }
  }

  return issues
}

function logDiagnostics(issues: DiagnosticIssue[], label: string): void {
  console.log(`\n=== ${label} (${issues.length} issue(s)) ===\n`)

  if (issues.length === 0) {
    console.log('No issues found.')
    return
  }

  for (const issue of issues) {
    console.log(`[${issue.path}] ${issue.code}`)
    console.log(JSON.stringify(issue.node, null, 2))
    console.log('')
  }

  const grouped = issues.reduce<Record<string, number>>((acc, issue) => {
    acc[issue.code] = (acc[issue.code] ?? 0) + 1
    return acc
  }, {})

  console.log('Summary by code:')
  for (const [code, count] of Object.entries(grouped)) {
    console.log(`  ${code}: ${count}`)
  }
}

// ---------------------------------------------------------------------------
// fixContent
// ---------------------------------------------------------------------------

function flattenChildrenArrays(children: unknown[]): unknown[] {
  const result: unknown[] = []

  for (const child of children) {
    if (Array.isArray(child)) {
      result.push(...flattenChildrenArrays(child))
    } else {
      result.push(child)
    }
  }

  return result
}

function extractSpansFromNode(node: unknown, markDefs: MarkDef[] = []): Span[] {
  if (isSpan(node)) {
    return [ensureKey(node)]
  }

  if (isBlock(node)) {
    const children = Array.isArray(node.children) ? flattenChildrenArrays(node.children) : []
    return children.flatMap((child) => extractSpansFromNode(child, markDefs))
  }

  if (typeof node === 'object' && node !== null) {
    const obj = node as Record<string, unknown>

    if (obj._type === 'div' || obj._type === 'blockquote') {
      if (Array.isArray(obj.children)) {
        return flattenChildrenArrays(obj.children).flatMap((child) =>
          extractSpansFromNode(child, markDefs),
        )
      }
    }

    if (typeof obj.text === 'string') {
      return [createSpan(obj.text as string)]
    }
  }

  return []
}

function createSpan(text: string, marks: string[] = []): Span {
  return ensureKey({
    _type: 'span',
    text,
    marks: marks.length > 0 ? marks : undefined,
  })
}

function sanitizeMarkDefs(markDefs: MarkDef[] | undefined): {
  markDefs: MarkDef[]
  removed: MarkDef[]
} {
  const valid: MarkDef[] = []
  const removed: MarkDef[] = []

  if (!Array.isArray(markDefs)) {
    return {markDefs: [], removed: []}
  }

  for (const def of markDefs) {
    if (isValidLinkMarkDef(def)) {
      valid.push({_key: def._key, _type: 'link', href: def.href})
    } else if (def) {
      removed.push(def)
    }
  }

  return {markDefs: valid, removed}
}

function filterSpanMarks(span: Span, validKeys: Set<string>): Span {
  if (!Array.isArray(span.marks) || span.marks.length === 0) {
    const {_key, _type, text} = span
    return ensureKey({_type, text})
  }

  const marks = span.marks.filter((m) => isDecoratorMark(m) || validKeys.has(m))
  const result: Span = {_type: 'span', text: span.text}
  if (marks.length > 0) result.marks = marks
  return ensureKey(result)
}

function makeNormalBlock(
  template: Block,
  spans: Span[],
  markDefs: MarkDef[],
): Block {
  const validKeys = new Set(markDefs.map((d) => d._key))
  const children = spans
    .filter((s) => s.text.trim().length > 0)
    .map((s) => filterSpanMarks(s, validKeys))

  if (children.length === 0) return null as unknown as Block

  return ensureKey({
    _type: 'block',
    style: 'normal',
    children,
    markDefs,
  })
}

function makeBlockquoteBlock(spans: Span[], markDefs: MarkDef[]): Block | null {
  const validKeys = new Set(markDefs.map((d) => d._key))
  const children = spans
    .filter((s) => s.text.trim().length > 0)
    .map((s) => filterSpanMarks(s, validKeys))

  if (children.length === 0) return null

  return ensureKey({
    _type: 'block',
    style: 'blockquote',
    children,
    markDefs,
  })
}

function promoteNestedBlock(nested: Block, parentMarkDefs: MarkDef[]): Block[] {
  const markDefs = Array.isArray(nested.markDefs) && nested.markDefs.length > 0
    ? sanitizeMarkDefs(nested.markDefs).markDefs
    : parentMarkDefs

  const style = nested.style ?? 'normal'
  const children = Array.isArray(nested.children)
    ? flattenChildrenArrays(nested.children)
    : []

  if (style === 'blockquote') {
    const spans = children.flatMap((c) => extractSpansFromNode(c, markDefs))
    const block = makeBlockquoteBlock(spans, markDefs)
    return block ? [block] : []
  }

  if (style !== 'normal') {
    const spans = children.flatMap((c) => extractSpansFromNode(c, markDefs))
    if (spans.length === 0) return []

    const validKeys = new Set(markDefs.map((d) => d._key))
    return [
      ensureKey({
        _type: 'block',
        style,
        listItem: nested.listItem,
        level: nested.level,
        children: spans.map((s) => filterSpanMarks(s, validKeys)),
        markDefs,
      }),
    ]
  }

  return splitNormalBlock(nested, markDefs)
}

function splitNormalBlock(block: Block, inheritedMarkDefs?: MarkDef[]): Block[] {
  const markDefs = sanitizeMarkDefs(
    Array.isArray(block.markDefs) ? block.markDefs : inheritedMarkDefs,
  ).markDefs

  const children = Array.isArray(block.children)
    ? flattenChildrenArrays(block.children)
    : []

  const hasInvalidChildren = children.some((child) => !isSpan(child))
  const nestedBlocksField = Array.isArray(block.blocks) ? block.blocks : []

  if (!hasInvalidChildren && nestedBlocksField.length === 0) {
    const validKeys = new Set(markDefs.map((d) => d._key))
    const spanChildren = children.filter(isSpan).map((s) => filterSpanMarks(s, validKeys))
    if (spanChildren.length === 0) return []

    return [
      ensureKey({
        _type: 'block',
        style: 'normal',
        children: spanChildren,
        markDefs,
        ...(block.listItem ? {listItem: block.listItem, level: block.level} : {}),
      }),
    ]
  }

  const output: Block[] = []
  let spanBuffer: Span[] = []

  const flushSpans = () => {
    const normal = makeNormalBlock(block, spanBuffer, markDefs)
    if (normal) output.push(normal)
    spanBuffer = []
  }

  for (const child of children) {
    if (isSpan(child)) {
      spanBuffer.push(ensureKey(child))
      continue
    }

    flushSpans()

    if (isBlock(child)) {
      output.push(...promoteNestedBlock(child, markDefs))
      continue
    }

    if (typeof child === 'object' && child !== null && '_type' in child) {
      const obj = child as Record<string, unknown>
      const childType = obj._type as string

      if (childType === 'div' || childType === 'blockquote') {
        const spans = extractSpansFromNode(child, markDefs)
        const quote = makeBlockquoteBlock(spans, markDefs)
        if (quote) output.push(quote)
        continue
      }

      if (childType === 'image') {
        output.push(ensureKey(child as Block))
        continue
      }

      const spans = extractSpansFromNode(child, markDefs)
      if (spans.length > 0) {
        const quote = makeBlockquoteBlock(spans, markDefs)
        if (quote) output.push(quote)
      }
    }
  }

  flushSpans()

  for (const nested of nestedBlocksField) {
    if (isBlock(nested)) {
      output.push(...promoteNestedBlock(nested, markDefs))
    } else if (typeof nested === 'object' && nested !== null) {
      const spans = extractSpansFromNode(nested, markDefs)
      const quote = makeBlockquoteBlock(spans, markDefs)
      if (quote) output.push(quote)
    }
  }

  return output
}

function fixBlock(block: Block): Block[] {
  const style = block.style ?? 'normal'

  if (isNormalStyle(style)) {
    return splitNormalBlock(block)
  }

  const markDefs = sanitizeMarkDefs(block.markDefs).markDefs
  const children = Array.isArray(block.children)
    ? flattenChildrenArrays(block.children)
    : []

  const hasInvalidChildren = children.some((c) => !isSpan(c))

  if (hasInvalidChildren) {
    return splitNormalBlock({...block, style: 'normal'}, markDefs)
  }

  const validKeys = new Set(markDefs.map((d) => d._key))
  const spanChildren = children.filter(isSpan).map((s) => filterSpanMarks(s, validKeys))

  if (spanChildren.length === 0) return []

  const clean: Block = {
    _type: 'block',
    _key: block._key ?? generateKey(),
    style,
    children: spanChildren,
    markDefs,
  }
  if (block.listItem) clean.listItem = block.listItem
  if (block.level !== undefined) clean.level = block.level

  return [ensureKey(clean)]
}

export function fixContent(content: unknown): {
  fixed: ContentItem[]
  removedMarkDefs: MarkDef[]
} {
  if (!Array.isArray(content)) {
    return {fixed: [], removedMarkDefs: []}
  }

  const fixed: ContentItem[] = []
  const removedMarkDefs: MarkDef[] = []

  const flattened: unknown[] = []
  for (const item of content) {
    if (Array.isArray(item)) {
      flattened.push(...item)
    } else {
      flattened.push(item)
    }
  }

  for (const item of flattened) {
    if (!item || typeof item !== 'object') continue

    if (isBlock(item)) {
      const {removed} = sanitizeMarkDefs(item.markDefs)
      removedMarkDefs.push(...removed)
      fixed.push(...fixBlock(item))
      continue
    }

    fixed.push(ensureKey(item as Block))
  }

  return {fixed: fixed.filter(Boolean), removedMarkDefs}
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  const apply = process.argv.includes('--apply')

  const post = await client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      _rev,
      title,
      "slug": slug.current,
      content
    }`,
    {slug: TARGET_SLUG},
  )

  if (!post) {
    console.error(`Post not found for slug: ${TARGET_SLUG}`)
    process.exit(1)
  }

  console.log('Target document:')
  console.log(`  _id:   ${post._id}`)
  console.log(`  title: ${post.title}`)
  console.log(`  slug:  ${post.slug}`)
  console.log(`  blocks in content: ${Array.isArray(post.content) ? post.content.length : 0}`)

  const beforeIssues = diagnoseContent(post.content)
  logDiagnostics(beforeIssues, 'BEFORE — corrupted nodes')

  const {fixed, removedMarkDefs} = fixContent(post.content)
  const afterIssues = diagnoseContent(fixed)
  logDiagnostics(afterIssues, 'AFTER (in-memory fix) — validation')

  console.log('\n=== Transformation summary ===')
  console.log(`  Blocks before: ${Array.isArray(post.content) ? post.content.length : 0}`)
  console.log(`  Blocks after:  ${fixed.length}`)
  console.log(`  Removed invalid markDefs: ${removedMarkDefs.length}`)
  if (removedMarkDefs.length > 0) {
    console.log(JSON.stringify(removedMarkDefs, null, 2))
  }

  if (afterIssues.length > 0) {
    console.error(
      `\nFix did not resolve all issues (${afterIssues.length} remaining). Aborting write.`,
    )
    process.exit(1)
  }

  if (!apply) {
    console.log('\nDry run complete — no changes written.')
    console.log('To apply: npx tsx diagnose-and-fix.ts --apply')
    return
  }

  console.log('\nApplying patch...')
  await client.patch(post._id).set({content: fixed}).commit()
  console.log('Patch committed successfully.')
  console.log(`Studio: http://localhost:3000/studio/structure/post;${post._id}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
