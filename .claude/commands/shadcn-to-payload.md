# Convert shadcn block(s) to Payload CMS block

Convert one or more shadcn/tailark components into a fully integrated Payload CMS block.

**Arguments:** `$ARGUMENTS` — one or more shadcn component identifiers, e.g. `@tailark/logo-cloud-1 @tailark/logo-cloud-3`, or a conceptual block name like `PricingBlock`.

---

## Step 0 — Read project context first

Before doing anything, read these files to understand current patterns:
- `src/blocks/RenderBlocks.tsx` — registered blocks map
- `src/collections/Pages/index.ts` — layout blocks array
- `src/blocks/Hero/config.ts` + `src/blocks/Hero/RenderHero.tsx` — multi-variant pattern
- `src/blocks/CallToAction/config.ts` — single-variant pattern
- `src/blocks/Hero/Section1/index.tsx` — component pattern

---

## Step 1 — Install shadcn component(s)

For each component identifier in $ARGUMENTS:

```bash
pnpm dlx shadcn add <identifier> --overwrite
```

Read every generated file under `src/components/`. Note what it imports and renders.

**Critical import path fix:** The tailark registry generates imports pointing to
`@/components/motion-primitives/...` but this project stores primitives at
`@/components/ui/`. Check every generated file and fix any `motion-primitives` imports
to `ui` before proceeding. Then delete the raw generated file(s) from
`src/components/` — the block components will replace them.

---

## Step 2 — Decide block structure

Ask yourself:
- **Single variant?** → one `Component.tsx`, no sub-folders, no `type` select field.
- **Multiple variants?** (e.g. logo-cloud-1 AND logo-cloud-3) → one block with a `type`
  select, a `RenderXxx.tsx` router, and one `SectionN/index.tsx` per variant.
  Name variants after the tailark number: `section1`, `section3`, etc.

---

## Step 3 — Design Payload fields

Walk through the shadcn component JSX and identify every piece of **dynamic content**:

| JSX element | Payload field type |
|---|---|
| Text / heading / label | `text` or `richText` |
| `<img src=...>` / logo / image | `upload` → `relationTo: 'media'` |
| Repeating items (logos, cards) | `array` of sub-fields |
| CTA buttons / links | use `linkGroup()` from `@/fields/linkGroup` |
| Boolean toggles | `checkbox` |
| Enum/style choices | `select` |

Do NOT carry over hardcoded demo URLs or placeholder text as fields — those become
the admin's job to fill in.

Add `admin.description` hints on non-obvious fields.

---

## Step 4 — Create block files

### `src/blocks/<BlockName>/config.ts`

```ts
import type { Block } from 'payload'

export const BlockName: Block = {
  slug: 'camelCaseSlug',
  interfaceName: 'BlockNameBlock',
  fields: [ /* designed fields from Step 3 */ ],
  labels: { singular: '...', plural: '...' },
}
```

### For multi-variant: `src/blocks/<BlockName>/SectionN/index.tsx`

```tsx
// Add 'use client' only if the component uses hooks, motion, or browser APIs
import React from 'react'
import type { BlockNameBlock } from '@/payload-types'
import { Media } from '@/components/Media'          // for upload fields
import { CMSLink } from '@/components/Link'         // for link fields
import RichText from '@/components/RichText'        // for richText fields

export const SectionNBlockName: React.FC<BlockNameBlock> = ({ heading, logos, ... }) => {
  // Implement using the shadcn JSX as a template, replacing hardcoded values
  // with props. Use <Media resource={logo} imgClassName="..." /> for images.
  // Check typeof upload === 'object' && upload before rendering Media.
}
```

### For multi-variant: `src/blocks/<BlockName>/Component.tsx`

```tsx
import React from 'react'
import type { BlockNameBlock as T } from '@/payload-types'
import { Section1BlockName } from './Section1'
import { Section3BlockName } from './Section3'

const sections = { section1: Section1BlockName, section3: Section3BlockName }

export const BlockNameBlock: React.FC<T & { disableInnerContainer?: boolean }> = (props) => {
  const Section = sections[props.type as keyof typeof sections]
  if (!Section) return null
  return <Section {...props} />
}
```

---

## Step 5 — Register the block

**`src/collections/Pages/index.ts`**
1. Add import: `import { BlockName } from '../../blocks/BlockName/config'`
2. Add to the `blocks` array in the layout field.

**`src/blocks/RenderBlocks.tsx`**
1. Add import: `import { BlockNameBlock } from '@/blocks/BlockName/Component'`
2. Add to `blockComponents`: `camelCaseSlug: BlockNameBlock`

---

## Step 6 — Generate types & verify

```bash
pnpm payload generate:types
pnpm exec tsc --noEmit
```

Fix any TypeScript errors before continuing. Common issues:
- `typeof upload === 'object' && upload` guard before passing to `<Media>`
- Array items need `.map(({ id, field }) => ...)` with `key={id}`
- `'use client'` required on any file importing motion/react, InfiniteSlider, ProgressiveBlur, etc.

---

## Step 7 — Generate migration

```bash
pnpm payload migrate:create --name add_<block_name>_block
```

Verify the generated migration in `src/migrations/` contains the expected new tables
(`pages_blocks_<slug>`, `_pages_v_blocks_<slug>`) and FKs.

---

## Step 8 — Final checklist

- [ ] No hardcoded image URLs or placeholder text in components
- [ ] All upload fields guarded with `typeof x === 'object' && x`
- [ ] `'use client'` on any file using motion, sliders, or browser APIs
- [ ] `Media` component used for all image/logo rendering (not `<img>`)
- [ ] `CMSLink` used for all links (not `<a>`)
- [ ] Block slug registered in both `Pages/index.ts` AND `RenderBlocks.tsx`
- [ ] `tsc --noEmit` passes clean
- [ ] Migration file generated and verified

Report a summary: block name, variants created, fields defined, files created/modified.
