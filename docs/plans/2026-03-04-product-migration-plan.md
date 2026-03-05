# Product Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Import 33 product categories, 3 tags, and 138 products from `product-data.sql` into Payload CMS via the Local API, including image download from the old CDN.

**Architecture:** A standalone TypeScript script (`src/scripts/seed-products.ts`) runs via `pnpm payload run`, which bootstraps the Payload config. Two utility modules — a SQL VALUES parser and an HTML→Lexical JSON converter — handle the data transformation. The script executes 7 sequential phases with idempotency checks and non-fatal error handling.

**Tech Stack:** Payload 3.77.0 Local API, `@payloadcms/db-postgres`, `jsdom` (already in devDependencies), TypeScript, `pnpm payload run`, Vitest (tests in `tests/int/**/*.int.spec.ts`).

---

### Task 1: SQL Parser Utility

**Files:**
- Create: `src/scripts/lib/parse-sql.ts`
- Test: `tests/int/scripts/parse-sql.int.spec.ts`

**What it does:** Reads INSERT lines from the SQL dump and parses the VALUES tuple into typed arrays. Must handle: quoted strings (with `''` as escaped single-quote), NULL, booleans (`true`/`false`), integers, and long embedded JSON/HTML strings.

**Step 1: Create the test file**

```typescript
// tests/int/scripts/parse-sql.int.spec.ts
import { describe, it, expect } from 'vitest'
import { parseSqlValues, parseSqlInserts } from '../../../src/scripts/lib/parse-sql'

describe('parseSqlValues', () => {
  it('parses integers', () => {
    expect(parseSqlValues('(1, 2, 3)')).toEqual([1, 2, 3])
  })

  it('parses quoted strings', () => {
    expect(parseSqlValues("(1, 'hello', 'world')")).toEqual([1, 'hello', 'world'])
  })

  it('parses empty string', () => {
    expect(parseSqlValues("(1, '', 2)")).toEqual([1, '', 2])
  })

  it('parses NULL', () => {
    expect(parseSqlValues('(1, NULL, 3)')).toEqual([1, null, 3])
  })

  it('parses booleans', () => {
    expect(parseSqlValues('(true, false)')).toEqual([true, false])
  })

  it('handles escaped single quotes inside strings', () => {
    expect(parseSqlValues("(1, 'it''s here', 2)")).toEqual([1, "it's here", 2])
  })

  it('handles JSON string values', () => {
    const input = `(1, '{"uploadId":210,"alt":""}', 3)`
    const result = parseSqlValues(input)
    expect(result[1]).toBe('{"uploadId":210,"alt":""}')
  })

  it('handles HTML content with embedded quotes', () => {
    const html = `<p>Wall-mounted it''s here</p>`
    const input = `(1, '${html}')`
    const result = parseSqlValues(input)
    expect(result[1]).toBe("<p>Wall-mounted it's here</p>")
  })
})

describe('parseSqlInserts', () => {
  it('extracts rows for a given table', () => {
    const sql = [
      `INSERT INTO product_tags VALUES (1, 'en', 'abc', 'New', '1', '', '', 1000, 2000);`,
      `INSERT INTO product_tags VALUES (2, 'en', 'def', 'Old', '2', '', '', 3000, 4000);`,
      `INSERT INTO other_table VALUES (99, 'skip');`,
    ].join('\n')

    const rows = parseSqlInserts(sql, 'product_tags')
    expect(rows).toHaveLength(2)
    expect(rows[0][0]).toBe(1)
    expect(rows[0][3]).toBe('New')
    expect(rows[1][3]).toBe('Old')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test:int 2>&1 | grep -A 5 "parse-sql"
```
Expected: FAIL — module not found.

**Step 3: Implement the parser**

```typescript
// src/scripts/lib/parse-sql.ts

type SqlValue = string | number | boolean | null

/** Parse the VALUES(...) tuple from one INSERT statement into an array of JS values. */
export function parseSqlValues(valuesClause: string): SqlValue[] {
  // Strip outer parens: "(a, b, c)" → "a, b, c"
  const inner = valuesClause.trim().replace(/^\(/, '').replace(/\);?$/, '').replace(/\)$/, '')
  const result: SqlValue[] = []
  let i = 0

  while (i < inner.length) {
    // Skip whitespace and commas between values
    if (inner[i] === ',' || inner[i] === ' ') { i++; continue }

    if (inner[i] === "'") {
      // Quoted string — collect until closing unescaped quote
      let str = ''
      i++ // skip opening quote
      while (i < inner.length) {
        if (inner[i] === "'" && inner[i + 1] === "'") {
          str += "'"
          i += 2
        } else if (inner[i] === "'") {
          i++ // skip closing quote
          break
        } else {
          str += inner[i]
          i++
        }
      }
      result.push(str)
    } else if (inner.slice(i, i + 4) === 'NULL') {
      result.push(null)
      i += 4
    } else if (inner.slice(i, i + 4) === 'true') {
      result.push(true)
      i += 4
    } else if (inner.slice(i, i + 5) === 'false') {
      result.push(false)
      i += 5
    } else {
      // Number (possibly negative)
      let num = ''
      if (inner[i] === '-') { num += '-'; i++ }
      while (i < inner.length && inner[i] !== ',' && inner[i] !== ')') {
        num += inner[i]
        i++
      }
      result.push(Number(num))
    }
  }

  return result
}

/** Extract all INSERT rows for a given table from the full SQL dump string. */
export function parseSqlInserts(sql: string, tableName: string): SqlValue[][] {
  const prefix = `INSERT INTO ${tableName} VALUES `
  const rows: SqlValue[][] = []

  for (const line of sql.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith(prefix)) continue
    const valuesClause = trimmed.slice(prefix.length)
    rows.push(parseSqlValues(valuesClause))
  }

  return rows
}
```

**Step 4: Run tests**

```bash
pnpm test:int 2>&1 | grep -A 10 "parse-sql"
```
Expected: All passing.

**Step 5: Commit**

```bash
git add src/scripts/lib/parse-sql.ts tests/int/scripts/parse-sql.int.spec.ts
git commit -m "feat(migration): add SQL VALUES parser utility"
```

---

### Task 2: HTML-to-Lexical Converter

**Files:**
- Create: `src/scripts/lib/html-to-lexical.ts`
- Test: `tests/int/scripts/html-to-lexical.int.spec.ts`

**What it does:** Converts an HTML string into Payload Lexical editor JSON. Handles the tags present in product descriptions: `<p>`, `<h2>`–`<h4>`, `<strong>`, `<em>`, `<a>`, `<ul>`, `<ol>`, `<li>`, `<br>`. Uses `jsdom` for DOM parsing (already installed).

**Lexical JSON structure reference:**

```
root                       { type: "root", children: [...], direction: "ltr", format: "", indent: 0, version: 1 }
  paragraph                { type: "paragraph", children: [...], direction: "ltr", format: "", indent: 0, version: 1 }
  heading (h2/h3/h4)       { type: "heading", tag: "h2", children: [...], direction: "ltr", format: "", indent: 0, version: 1 }
  list (ul/ol)             { type: "list", listType: "bullet"|"number", tag: "ul"|"ol", start: 1, children: [...], direction: "ltr", format: "", indent: 0, version: 1 }
    listitem               { type: "listitem", value: N, children: [...], direction: "ltr", format: "", indent: 0, version: 1 }
  text                     { type: "text", text: "...", format: 0, detail: 0, mode: "normal", style: "", version: 1 }
  link                     { type: "link", fields: { linkType: "custom", url: "...", newTab: false }, children: [...], direction: "ltr", format: "", indent: 0, version: 2 }
  linebreak                { type: "linebreak", version: 1 }

Text format flags (bitwise): bold=1, italic=2, strikethrough=4, underline=8
```

**Step 1: Create the test file**

```typescript
// tests/int/scripts/html-to-lexical.int.spec.ts
import { describe, it, expect } from 'vitest'
import { htmlToLexical } from '../../../src/scripts/lib/html-to-lexical'

describe('htmlToLexical', () => {
  it('returns a valid root document for empty input', () => {
    const result = htmlToLexical('')
    expect(result.root.type).toBe('root')
    expect(result.root.version).toBe(1)
  })

  it('converts a paragraph', () => {
    const result = htmlToLexical('<p>Hello world</p>')
    const para = result.root.children[0]
    expect(para.type).toBe('paragraph')
    expect(para.children[0].type).toBe('text')
    expect(para.children[0].text).toBe('Hello world')
  })

  it('converts h2 heading', () => {
    const result = htmlToLexical('<h2>Title</h2>')
    expect(result.root.children[0].type).toBe('heading')
    expect(result.root.children[0].tag).toBe('h2')
    expect(result.root.children[0].children[0].text).toBe('Title')
  })

  it('converts bold text', () => {
    const result = htmlToLexical('<p><strong>Bold</strong></p>')
    const text = result.root.children[0].children[0]
    expect(text.type).toBe('text')
    expect(text.text).toBe('Bold')
    expect(text.format).toBe(1) // bold flag
  })

  it('converts italic text', () => {
    const result = htmlToLexical('<p><em>Italic</em></p>')
    const text = result.root.children[0].children[0]
    expect(text.format).toBe(2) // italic flag
  })

  it('converts unordered list', () => {
    const result = htmlToLexical('<ul><li>Item 1</li><li>Item 2</li></ul>')
    const list = result.root.children[0]
    expect(list.type).toBe('list')
    expect(list.listType).toBe('bullet')
    expect(list.children).toHaveLength(2)
    expect(list.children[0].type).toBe('listitem')
    expect(list.children[0].children[0].text).toBe('Item 1')
  })

  it('converts ordered list', () => {
    const result = htmlToLexical('<ol><li>First</li></ol>')
    expect(result.root.children[0].listType).toBe('number')
    expect(result.root.children[0].tag).toBe('ol')
  })

  it('converts anchor links', () => {
    const result = htmlToLexical('<p><a href="https://example.com">Click</a></p>')
    const link = result.root.children[0].children[0]
    expect(link.type).toBe('link')
    expect(link.fields.url).toBe('https://example.com')
    expect(link.children[0].text).toBe('Click')
  })

  it('converts line breaks', () => {
    const result = htmlToLexical('<p>Line 1<br>Line 2</p>')
    const children = result.root.children[0].children
    expect(children[1].type).toBe('linebreak')
  })

  it('normalizes &nbsp; to regular space', () => {
    const result = htmlToLexical('<p>Hello&nbsp;world</p>')
    const text = result.root.children[0].children[0].text
    expect(text).toBe('Hello world')
  })

  it('skips empty paragraphs', () => {
    const result = htmlToLexical('<p>Real</p><p></p><p>Content</p>')
    expect(result.root.children).toHaveLength(2)
  })
})
```

**Step 2: Run to verify failure**

```bash
pnpm test:int 2>&1 | grep -A 5 "html-to-lexical"
```
Expected: FAIL — module not found.

**Step 3: Implement the converter**

```typescript
// src/scripts/lib/html-to-lexical.ts
import { JSDOM } from 'jsdom'

// ── Lexical node types ──────────────────────────────────────────────────────

type TextNode = {
  type: 'text'; text: string; format: number
  detail: number; mode: string; style: string; version: 1
}

type LinebreakNode = { type: 'linebreak'; version: 1 }

type InlineNode = TextNode | LinebreakNode | LinkNode

type LinkNode = {
  type: 'link'; version: 2
  fields: { linkType: 'custom'; url: string; newTab: boolean }
  children: TextNode[]
  direction: 'ltr'; format: string; indent: number
}

type ParagraphNode = {
  type: 'paragraph'; children: InlineNode[]
  direction: 'ltr'; format: string; indent: number; version: 1
}

type HeadingNode = {
  type: 'heading'; tag: 'h2' | 'h3' | 'h4'; children: InlineNode[]
  direction: 'ltr'; format: string; indent: number; version: 1
}

type ListitemNode = {
  type: 'listitem'; value: number; children: InlineNode[]
  direction: 'ltr'; format: string; indent: number; version: 1
}

type ListNode = {
  type: 'list'; listType: 'bullet' | 'number'; tag: 'ul' | 'ol'
  start: number; children: ListitemNode[]
  direction: 'ltr'; format: string; indent: number; version: 1
}

type BlockNode = ParagraphNode | HeadingNode | ListNode

type LexicalDocument = {
  root: {
    type: 'root'; children: BlockNode[]
    direction: 'ltr'; format: string; indent: number; version: 1
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const EMPTY_BLOCK_DEFAULTS = { direction: 'ltr' as const, format: '', indent: 0 }

function makeText(text: string, format = 0): TextNode {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

function normalizeText(text: string): string {
  return text.replace(/\u00a0/g, ' ') // &nbsp; → regular space
}

// ── Inline node extraction ───────────────────────────────────────────────────

function extractInline(node: ChildNode, inheritedFormat = 0): InlineNode[] {
  if (node.nodeType === 3 /* TEXT_NODE */) {
    const text = normalizeText(node.textContent ?? '')
    if (!text) return []
    return [makeText(text, inheritedFormat)]
  }

  if (node.nodeType !== 1 /* ELEMENT_NODE */) return []

  const el = node as Element
  const tag = el.tagName.toLowerCase()

  if (tag === 'br') return [{ type: 'linebreak', version: 1 }]

  if (tag === 'strong' || tag === 'b') {
    return Array.from(el.childNodes).flatMap(c => extractInline(c, inheritedFormat | 1))
  }
  if (tag === 'em' || tag === 'i') {
    return Array.from(el.childNodes).flatMap(c => extractInline(c, inheritedFormat | 2))
  }

  if (tag === 'a') {
    const url = el.getAttribute('href') ?? ''
    const children = Array.from(el.childNodes)
      .flatMap(c => extractInline(c, inheritedFormat))
      .filter((n): n is TextNode => n.type === 'text')
    return [{
      type: 'link', version: 2,
      fields: { linkType: 'custom', url, newTab: false },
      children,
      ...EMPTY_BLOCK_DEFAULTS,
    }]
  }

  // Fallthrough: recurse into children (handles <span> etc.)
  return Array.from(el.childNodes).flatMap(c => extractInline(c, inheritedFormat))
}

// ── Block node extraction ────────────────────────────────────────────────────

function convertElement(el: Element): BlockNode | null {
  const tag = el.tagName.toLowerCase()

  if (tag === 'p') {
    const children = Array.from(el.childNodes).flatMap(c => extractInline(c))
    if (children.length === 0) return null
    return { type: 'paragraph', children, ...EMPTY_BLOCK_DEFAULTS, version: 1 }
  }

  if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
    const children = Array.from(el.childNodes).flatMap(c => extractInline(c))
    return { type: 'heading', tag, children, ...EMPTY_BLOCK_DEFAULTS, version: 1 }
  }

  if (tag === 'ul' || tag === 'ol') {
    const listType = tag === 'ul' ? 'bullet' : 'number'
    const items = Array.from(el.querySelectorAll(':scope > li'))
    const children: ListitemNode[] = items.map((li, idx) => ({
      type: 'listitem',
      value: idx + 1,
      children: Array.from(li.childNodes).flatMap(c => extractInline(c)),
      ...EMPTY_BLOCK_DEFAULTS,
      version: 1,
    }))
    return { type: 'list', listType, tag, start: 1, children, ...EMPTY_BLOCK_DEFAULTS, version: 1 }
  }

  return null
}

// ── Public API ───────────────────────────────────────────────────────────────

export function htmlToLexical(html: string): LexicalDocument {
  const dom = new JSDOM(`<body>${html}</body>`)
  const body = dom.window.document.body

  const children: BlockNode[] = Array.from(body.children)
    .map(el => convertElement(el))
    .filter((n): n is BlockNode => n !== null)

  // Ensure at least one paragraph so Payload's required validation passes
  if (children.length === 0) {
    children.push({ type: 'paragraph', children: [], ...EMPTY_BLOCK_DEFAULTS, version: 1 })
  }

  return {
    root: { type: 'root', children, ...EMPTY_BLOCK_DEFAULTS, version: 1 },
  }
}
```

**Step 4: Run tests**

```bash
pnpm test:int 2>&1 | grep -A 10 "html-to-lexical"
```
Expected: All passing.

**Step 5: Commit**

```bash
git add src/scripts/lib/html-to-lexical.ts tests/int/scripts/html-to-lexical.int.spec.ts
git commit -m "feat(migration): add HTML-to-Lexical JSON converter"
```

---

### Task 3: Seed Script — Setup + Category Phase

**Files:**
- Create: `src/scripts/seed-products.ts`

**What it does:** Bootstraps Payload, reads and parses the SQL file, uploads category images, then seeds categories in two passes (roots first, then children) to resolve the parent hierarchy.

**Step 1: Create the script file**

```typescript
// src/scripts/seed-products.ts
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSqlInserts, type SqlValue } from './lib/parse-sql'
import { htmlToLexical } from './lib/html-to-lexical'

// ── Types ────────────────────────────────────────────────────────────────────

type Row = SqlValue[]

interface CategoryRow {
  oldId: number
  name: string
  slug: string
  description: string
  parentOldId: number | null
  imageUploadId: number | null
  imageAlt: string
  sortOrder: number
  color: string
}

interface TagRow {
  oldId: number
  label: string
  value: string
}

interface ProductRow {
  oldId: number
  slug: string
  name: string
  description: string
  productCode: string
  subtitle: string
  gallery: Array<{ uploadId: number; alt: string }>
  ean: string
  categoryOldId: number | null
  price: number
  currency: string
  instructionManual: string
  threeDModel: string
  dataSheet: string
  ecDeclaration: Array<{ url: string }>
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function mapCategoryRow(row: Row): CategoryRow {
  let imageUploadId: number | null = null
  let imageAlt = ''
  if (row[10] && typeof row[10] === 'string' && row[10] !== 'NULL') {
    try {
      const img = JSON.parse(row[10] as string)
      imageUploadId = img.uploadId ?? null
      imageAlt = img.alt ?? ''
    } catch { /* ignore */ }
  }
  return {
    oldId: row[0] as number,
    name: (row[3] as string) || '',
    slug: (row[4] as string) || '',
    description: (row[5] as string) || '',
    parentOldId: row[8] != null ? (row[8] as number) : null,
    imageUploadId,
    imageAlt,
    sortOrder: (row[11] as number) ?? 0,
    color: (row[12] as string) || '#FFFFFF',
  }
}

function mapTagRow(row: Row): TagRow {
  return {
    oldId: row[0] as number,
    label: (row[3] as string) || '',
    value: (row[4] as string) || '',
  }
}

function mapProductRow(row: Row): ProductRow {
  let gallery: Array<{ uploadId: number; alt: string }> = []
  if (row[17] && typeof row[17] === 'string' && row[17] !== '[]') {
    try {
      const raw = JSON.parse(row[17] as string) as Array<{ image?: { uploadId?: number; alt?: string }; alt?: string }>
      gallery = raw
        .filter(g => g.image?.uploadId != null)
        .map(g => ({ uploadId: g.image!.uploadId!, alt: g.alt || g.image?.alt || '' }))
    } catch { /* ignore */ }
  }

  let ecDeclaration: Array<{ url: string }> = []
  if (row[32] && typeof row[32] === 'string' && row[32] !== '[]') {
    try { ecDeclaration = JSON.parse(row[32] as string) } catch { /* ignore */ }
  }

  return {
    oldId: row[0] as number,
    slug: ((row[3] as string) || '').replace(/^\//, ''),
    name: (row[6] as string) || '',
    description: (row[8] as string) || '',
    productCode: (row[15] as string) || '',
    subtitle: (row[16] as string) || '',
    gallery,
    ean: (row[18] as string) || '',
    categoryOldId: row[20] != null ? (row[20] as number) : null,
    price: (row[22] as number) ?? 0,
    currency: (row[23] as string) || 'EUR',
    instructionManual: (row[24] as string) || '',
    threeDModel: (row[26] as string) || '',
    dataSheet: (row[31] as string) || '',
    ecDeclaration,
  }
}

// ── Image upload ──────────────────────────────────────────────────────────────

const OLD_MEDIA_BASE = (process.env.OLD_CMS_MEDIA_BASE_URL || '').replace(/\/$/, '')

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

async function uploadImage(
  payload: Payload,
  uploadId: number,
  alt: string,
  mediaMap: Map<number, string>,
  failedImages: string[],
  urlHint?: string,
): Promise<string | null> {
  if (mediaMap.has(uploadId)) return mediaMap.get(uploadId)!

  const urls = urlHint ? [urlHint] : []
  if (urls.length === 0) return null

  for (const url of urls) {
    const buffer = await downloadImage(url)
    if (!buffer) continue
    const ext = url.split('.').pop() || 'jpg'
    const name = `migration-${uploadId}.${ext}`
    try {
      const media = await payload.create({
        collection: 'media',
        data: { alt },
        file: { data: buffer, mimetype: `image/${ext}`, name, size: buffer.length },
      })
      mediaMap.set(uploadId, String(media.id))
      return String(media.id)
    } catch (err) {
      payload.logger.error(`Failed to upload image ${url}: ${err}`)
    }
  }

  failedImages.push(`uploadId=${uploadId}`)
  return null
}

// ── Category URL builder ──────────────────────────────────────────────────────

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildCategoryImageUrls(
  catRow: CategoryRow,
  parentRow: CategoryRow | undefined,
): string[] {
  const catSlug = slugify(catRow.name)
  const parentSlug = parentRow ? slugify(parentRow.name) : null
  if (parentSlug) {
    return [
      `${OLD_MEDIA_BASE}/${parentSlug}/${catSlug}.png`,
      `${OLD_MEDIA_BASE}/${catSlug}.png`,
    ]
  }
  return [`${OLD_MEDIA_BASE}/${catSlug}.png`]
}

// ── Phase 3 & 4: Seed categories ─────────────────────────────────────────────

async function seedCategories(
  payload: Payload,
  categories: CategoryRow[],
  mediaMap: Map<number, string>,
  failedImages: string[],
): Promise<Map<number, string>> {
  const catMap = new Map<number, string>() // oldId → newPayloadId
  const catById = new Map(categories.map(c => [c.oldId, c]))

  // Pass 1: roots
  for (const cat of categories.filter(c => c.parentOldId === null)) {
    await upsertCategory(payload, cat, null, catMap, catById, mediaMap, failedImages)
  }

  // Pass 2: children (depth 1)
  for (const cat of categories.filter(c => c.parentOldId !== null)) {
    const parentNewId = catMap.get(cat.parentOldId!) ?? null
    await upsertCategory(payload, cat, parentNewId, catMap, catById, mediaMap, failedImages)
  }

  return catMap
}

async function upsertCategory(
  payload: Payload,
  cat: CategoryRow,
  parentNewId: string | null,
  catMap: Map<number, string>,
  catById: Map<number, CategoryRow>,
  mediaMap: Map<number, string>,
  failedImages: string[],
): Promise<void> {
  const slug = cat.slug || slugify(cat.name)

  const existing = await payload.find({
    collection: 'product-categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    catMap.set(cat.oldId, String(existing.docs[0].id))
    payload.logger.info(`  [skip] category "${cat.name}" already exists`)
    return
  }

  // Upload image if present
  let imageId: string | null = null
  if (cat.imageUploadId !== null) {
    const parentRow = cat.parentOldId != null ? catById.get(cat.parentOldId) : undefined
    const urls = buildCategoryImageUrls(cat, parentRow)
    for (const url of urls) {
      const buf = await downloadImage(url)
      if (buf) {
        const ext = url.split('.').pop() || 'png'
        try {
          const media = await payload.create({
            collection: 'media',
            data: { alt: cat.imageAlt || cat.name },
            file: { data: buf, mimetype: `image/${ext}`, name: `cat-${cat.oldId}.${ext}`, size: buf.length },
          })
          imageId = String(media.id)
          mediaMap.set(cat.imageUploadId, imageId)
          break
        } catch { /* ignore */ }
      }
    }
    if (!imageId) failedImages.push(`category "${cat.name}" uploadId=${cat.imageUploadId}`)
  }

  const data: Record<string, unknown> = {
    name: cat.name,
    slug,
    description: cat.description || undefined,
    sortOrder: cat.sortOrder,
    color: cat.color,
    ...(parentNewId ? { parent: parentNewId } : {}),
    ...(imageId ? { image: imageId } : {}),
  }

  const created = await payload.create({ collection: 'product-categories', data })
  catMap.set(cat.oldId, String(created.id))
  payload.logger.info(`  ✓ category "${cat.name}" → ${created.id}`)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config })

  payload.logger.info('=== Product migration starting ===')

  // Parse SQL
  const sqlPath = resolve(process.cwd(), 'product-data.sql')
  const sql = readFileSync(sqlPath, 'utf-8')
  const catRows = parseSqlInserts(sql, 'product_categories').map(mapCategoryRow)
  const tagRows = parseSqlInserts(sql, 'product_tags').map(mapTagRow)
  const productRows = parseSqlInserts(sql, 'products').map(mapProductRow)

  payload.logger.info(`Parsed: ${catRows.length} categories, ${tagRows.length} tags, ${productRows.length} products`)

  const mediaMap = new Map<number, string>()  // oldUploadId → newMediaId
  const failedImages: string[] = []
  const failedProducts: string[] = []
  let createdProducts = 0
  let skippedProducts = 0

  // Phase 3 & 4: Seed categories
  payload.logger.info('--- Seeding categories ---')
  const catMap = await seedCategories(payload, catRows, mediaMap, failedImages)

  // Phases 5–7 continue in Tasks 4 & 5...
  // (placeholder: tags + images + products)

  payload.logger.info('=== Migration complete ===')
  payload.logger.info(`Categories: ${catMap.size}/${catRows.length}`)
  payload.logger.info(`Failed images: ${failedImages.length}`)

  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
```

**Step 2: Add `seed:products` npm script to `package.json`**

Add inside `"scripts"`:
```json
"seed:products": "cross-env NODE_OPTIONS=--no-deprecation payload run src/scripts/seed-products.ts",
```

**Step 3: Smoke test — categories only**

Make sure `OLD_CMS_MEDIA_BASE_URL` is set in `.env.local`, then run against a dev database:
```bash
pnpm seed:products 2>&1 | head -60
```
Expected: Parses 33 categories, inserts roots then children, logs each created category.

**Step 4: Commit**

```bash
git add src/scripts/seed-products.ts package.json
git commit -m "feat(migration): seed script — categories phase"
```

---

### Task 4: Seed Script — Tags + Product Images Phase

**Files:**
- Modify: `src/scripts/seed-products.ts`

**What it does:** Adds the tags seeding phase and the product image upload phase to the main function.

**Step 1: Add `seedTags` function above `main`**

```typescript
// ── Phase 5: Seed tags ────────────────────────────────────────────────────────

async function seedTags(
  payload: Payload,
  tags: TagRow[],
): Promise<Map<number, string>> {
  const tagMap = new Map<number, string>()

  for (const tag of tags) {
    const existing = await payload.find({
      collection: 'product-tags',
      where: { value: { equals: tag.value } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      tagMap.set(tag.oldId, String(existing.docs[0].id))
      payload.logger.info(`  [skip] tag "${tag.label}" already exists`)
      continue
    }

    const created = await payload.create({
      collection: 'product-tags',
      data: { label: tag.label, value: tag.value },
    })
    tagMap.set(tag.oldId, String(created.id))
    payload.logger.info(`  ✓ tag "${tag.label}" → ${created.id}`)
  }

  return tagMap
}
```

**Step 2: Add `buildProductImageUrls` function and `uploadProductImages` function**

```typescript
// ── Phase 6: Upload product images ───────────────────────────────────────────

function buildProductImageUrls(
  product: ProductRow,
  catRow: CategoryRow | undefined,
  parentCatRow: CategoryRow | undefined,
): string[] {
  const productSlug = product.slug  // already has leading / stripped
  const catSlug = catRow ? slugify(catRow.name) : null
  const parentSlug = parentCatRow ? slugify(parentCatRow.name) : null

  const urls: string[] = []
  if (parentSlug && catSlug) {
    urls.push(`${OLD_MEDIA_BASE}/${parentSlug}/${catSlug}/${productSlug}.png`)
  }
  if (catSlug) {
    urls.push(`${OLD_MEDIA_BASE}/${catSlug}/${productSlug}.png`)
  }
  urls.push(`${OLD_MEDIA_BASE}/${productSlug}.png`)
  return urls
}

async function uploadProductImages(
  payload: Payload,
  products: ProductRow[],
  catRows: CategoryRow[],
  mediaMap: Map<number, string>,
  failedImages: string[],
): Promise<void> {
  const catById = new Map(catRows.map(c => [c.oldId, c]))

  // Collect all unique uploadIds across all product galleries
  const toUpload = new Map<number, { productSlug: string; catRow?: CategoryRow; parentRow?: CategoryRow; alt: string }>()

  for (const product of products) {
    const catRow = product.categoryOldId != null ? catById.get(product.categoryOldId) : undefined
    const parentRow = catRow?.parentOldId != null ? catById.get(catRow.parentOldId) : undefined
    for (const g of product.gallery) {
      if (!mediaMap.has(g.uploadId) && !toUpload.has(g.uploadId)) {
        toUpload.set(g.uploadId, { productSlug: product.slug, catRow, parentRow, alt: g.alt })
      }
    }
  }

  payload.logger.info(`Uploading ${toUpload.size} unique product images...`)

  for (const [uploadId, info] of toUpload) {
    const urls = buildProductImageUrls(
      { slug: info.productSlug } as ProductRow,
      info.catRow,
      info.parentRow,
    )

    let uploaded = false
    for (const url of urls) {
      const buffer = await downloadImage(url)
      if (!buffer) continue
      try {
        const ext = url.split('.').pop() || 'png'
        const media = await payload.create({
          collection: 'media',
          data: { alt: info.alt },
          file: { data: buffer, mimetype: `image/${ext}`, name: `prod-${uploadId}.${ext}`, size: buffer.length },
        })
        mediaMap.set(uploadId, String(media.id))
        payload.logger.info(`  ✓ image uploadId=${uploadId} → ${media.id} (${url})`)
        uploaded = true
        break
      } catch (err) {
        payload.logger.warn(`  upload failed for ${url}: ${err}`)
      }
    }

    if (!uploaded) {
      failedImages.push(`uploadId=${uploadId} tried: ${urls.join(', ')}`)
      payload.logger.warn(`  ✗ image uploadId=${uploadId} not found at any URL`)
    }
  }
}
```

**Step 3: Wire into `main`** — replace the placeholder comment with:

```typescript
  // Phase 5: Seed tags
  payload.logger.info('--- Seeding tags ---')
  const tagMap = await seedTags(payload, tagRows)

  // Phase 6: Upload product images
  payload.logger.info('--- Uploading product images ---')
  await uploadProductImages(payload, productRows, catRows, mediaMap, failedImages)
```

**Step 4: Test tags + images**

```bash
pnpm seed:products 2>&1 | grep -E "(tag|image|✓|✗)"
```
Expected: 3 tags created, images attempted with logged results.

**Step 5: Commit**

```bash
git add src/scripts/seed-products.ts
git commit -m "feat(migration): seed script — tags and image upload phases"
```

---

### Task 5: Seed Script — Products Phase + Summary

**Files:**
- Modify: `src/scripts/seed-products.ts`

**What it does:** Adds the final product seeding phase and the end-of-run summary.

**Step 1: Add `seedProducts` function**

```typescript
// ── Phase 7: Seed products ────────────────────────────────────────────────────

async function seedProducts(
  payload: Payload,
  products: ProductRow[],
  catMap: Map<number, string>,
  mediaMap: Map<number, string>,
  failedProducts: string[],
): Promise<{ created: number; skipped: number }> {
  let created = 0
  let skipped = 0

  for (const product of products) {
    try {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: product.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        payload.logger.info(`  [skip] product "${product.slug}" already exists`)
        skipped++
        continue
      }

      const categoryId = product.categoryOldId != null
        ? catMap.get(product.categoryOldId) ?? null
        : null

      const productGallery = product.gallery
        .map(g => {
          const newId = mediaMap.get(g.uploadId)
          if (!newId) return null
          return { image: newId, alt: g.alt }
        })
        .filter((g): g is { image: string; alt: string } => g !== null)

      const ecDeclaration = product.ecDeclaration.length > 0
        ? product.ecDeclaration
        : undefined

      const data: Record<string, unknown> = {
        name: product.name,
        slug: product.slug,
        _status: 'published',
        subtitle: product.subtitle || undefined,
        description: htmlToLexical(product.description),
        productCode: product.productCode || undefined,
        ean: product.ean || undefined,
        price: product.price || undefined,
        currency: product.currency || undefined,
        instructionManual: product.instructionManual || undefined,
        threeDModel: product.threeDModel || undefined,
        dataSheet: product.dataSheet || undefined,
        ...(productGallery.length > 0 ? { productGallery } : {}),
        ...(ecDeclaration ? { ecDeclaration } : {}),
        ...(categoryId ? { category: categoryId } : {}),
      }

      const doc = await payload.create({ collection: 'products', data })
      payload.logger.info(`  ✓ product "${product.slug}" → ${doc.id}`)
      created++
    } catch (err) {
      payload.logger.error(`  ✗ product "${product.slug}" FAILED: ${err}`)
      failedProducts.push(product.slug)
    }
  }

  return { created, skipped }
}
```

**Step 2: Wire into `main`** — replace the final placeholder comment:

```typescript
  // Phase 7: Seed products
  payload.logger.info('--- Seeding products ---')
  const { created: createdProducts, skipped: skippedProducts } =
    await seedProducts(payload, productRows, catMap, mediaMap, failedProducts)

  // ── Summary ──────────────────────────────────────────────────────────────────
  payload.logger.info('')
  payload.logger.info('════════════════════════════════')
  payload.logger.info('  Migration Summary')
  payload.logger.info('════════════════════════════════')
  payload.logger.info(`  Categories : ${catMap.size}/${catRows.length}`)
  payload.logger.info(`  Tags       : ${tagMap.size}/${tagRows.length}`)
  payload.logger.info(`  Products   : ${createdProducts} created, ${skippedProducts} skipped, ${failedProducts.length} failed`)
  payload.logger.info(`  Images     : ${mediaMap.size} uploaded, ${failedImages.length} failed`)
  if (failedProducts.length > 0) {
    payload.logger.info('  Failed products:')
    for (const slug of failedProducts) payload.logger.info(`    - ${slug}`)
  }
  if (failedImages.length > 0) {
    payload.logger.info('  Failed images:')
    for (const img of failedImages) payload.logger.info(`    - ${img}`)
  }
  payload.logger.info('════════════════════════════════')
```

**Step 3: Full run**

```bash
pnpm seed:products 2>&1 | tee migration.log
```

Expected output at end:
```
  Categories : 33/33
  Tags       : 3/3
  Products   : 138 created, 0 skipped, 0 failed
  Images     : N uploaded, M failed
```

Check the Payload admin (`/admin/collections/products`) to confirm data.

**Step 4: Verify idempotency** — run again:

```bash
pnpm seed:products 2>&1 | grep -E "(skip|created|skipped)"
```
Expected: All 138 products logged as `[skip]`, counts show `0 created, 138 skipped`.

**Step 5: Final commit**

```bash
git add src/scripts/seed-products.ts
git commit -m "feat(migration): seed script — products phase and summary"
```

---

### Task 6: Cleanup

**Step 1: Add `migration.log` to `.gitignore`**

```bash
echo 'migration.log' >> .gitignore
git add .gitignore
git commit -m "chore: ignore migration.log"
```

**Step 2: Verify tests still pass**

```bash
pnpm test:int
```
Expected: All green.

---

## Notes

- **Column positions** for `products` are derived empirically from parsing the SQL dump. If a product field looks wrong after import, compare `src/scripts/lib/parse-sql.ts` mapping against a raw SQL line.
- **Image URL construction** uses normalized slugs from category names. If some images 404, check `migration.log` for the attempted URLs and adjust `buildProductImageUrls` accordingly.
- **`OLD_CMS_MEDIA_BASE_URL`** must be set in `.env.local` before running the script. Value: `https://new.inels.com/uploads/products_page`
- **`technicalParameters`**, **`buyLink`**, and **`productVideo`** are intentionally left empty — no source data exists for them.
