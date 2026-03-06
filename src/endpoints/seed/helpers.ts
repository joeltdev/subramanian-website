// src/endpoints/seed/helpers.ts
// Shared lexical rich-text builder helpers for all seed files.

export function lexicalHeading(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4') {
  return {
    type: 'heading' as const,
    children: [
      { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    tag,
    version: 1,
  }
}

export function lexicalParagraph(text: string) {
  return {
    type: 'paragraph' as const,
    children: [
      { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

export function richText(...children: Array<ReturnType<typeof lexicalHeading> | ReturnType<typeof lexicalParagraph>>) {
  return {
    root: {
      type: 'root' as const,
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

/** richText with heading + optional paragraph — the most common intro pattern */
export function rt(heading: string, paragraph?: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2') {
  const children: Array<ReturnType<typeof lexicalHeading> | ReturnType<typeof lexicalParagraph>> = paragraph
    ? [lexicalHeading(heading, tag), lexicalParagraph(paragraph)]
    : [lexicalHeading(heading, tag)]
  return richText(...children)
}

/** richText with h3 + optional paragraph — used for feature item richText */
export function rt3(h3: string, paragraph?: string) {
  return rt(h3, paragraph, 'h3')
}

/** richText with paragraph only */
export function rtp(paragraph: string) {
  return richText(lexicalParagraph(paragraph))
}

/** richText with h3 only */
export function rt3h(h3: string) {
  return rt(h3, undefined, 'h3')
}
