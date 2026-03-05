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
