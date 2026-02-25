# Convert shadcn block(s) to Payload CMS block

Convert one or more shadcn/tailark components into a fully integrated Payload CMS block.

**Arguments:** `$ARGUMENTS` — one or more shadcn component identifiers separated by spaces.

- **Single arg** → one block, single variant (no `type` select field).
  Example: `@tailark/logo-cloud-1`
- **Multiple args** → one block, each arg becomes a variant (with `type` select field).
  Example: `@tailark/logo-cloud-1 @tailark/logo-cloud-3 @tailark/logo-cloud-5`

When multiple args are passed, derive a shared block name from the common concept
(e.g. `logo-cloud-1`, `logo-cloud-3` → block name `LogoCloud`). Ask yourself: what
is the shared category? Use that as the block name.

---

## Step 0 — Read project context first

Before doing anything, read these files to understand current patterns:
- `src/blocks/RenderBlocks.tsx` — registered blocks map
- `src/collections/Pages/index.ts` — layout blocks array
- `src/blocks/Hero/config.ts` + `src/blocks/Hero/RenderHero.tsx` — multi-variant pattern
- `src/blocks/CallToAction/config.ts` — single-variant pattern
- `src/blocks/Hero/Section1/index.tsx` — component pattern
- `src/blocks/FeatureCards/config.ts` + `src/blocks/FeatureCards/Grid/index.tsx` — richText field pattern

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

## Step 2 — Determine block structure

**Rule: the number of $ARGUMENTS determines the structure.**

| # of args | Structure |
|---|---|
| 1 | Single-variant block — one `Component.tsx`, no sub-folders, no `type` select. |
| 2+ | Multi-variant block — one `type` select field, one `SectionN/index.tsx` per arg, one `Component.tsx` router. |

For multi-variant blocks, name each variant after the component's number or a
short human-readable label (prefer human-readable if it's obvious, e.g. `grid`,
`carousel`, `minimal`; fall back to `section1`, `section3`, etc. from the tailark
number).

---

## Step 3 — Design Payload fields

Walk through **all** shadcn components and collect the superset of dynamic content.
Fields used by only some variants get `admin.condition` to show/hide based on `type`.

| JSX element | Payload field type |
|---|---|
| Section heading + body text | `intro` **richText** with `HeadingFeature h2/h3` + toolbars (see pattern below) |
| Repeating item content (title + body) | single `richText` field — do NOT split into separate `title` + `description` fields |
| `<img src=...>` / logo / image | `upload` → `relationTo: 'media'` |
| Repeating items (logos, cards) | `array` of sub-fields |
| CTA buttons / links | use `linkGroup()` from `@/fields/linkGroup` |
| Boolean toggles | `checkbox` |
| Enum/style choices | `select` |

**richText field pattern** — always use `lexicalEditor` from `@payloadcms/richtext-lexical`:

```ts
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

// Section-level intro (heading + supporting text):
{
  name: 'intro',
  type: 'richText',
  label: 'Intro',
  admin: { description: 'Section heading and supporting text' },
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
},

// Item-level content (single richText replaces separate title + description):
{
  name: 'richText',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
},
```

**Rendering richText in components** — import and use `RichText`:

```tsx
import RichText from '@/components/RichText'

// Section intro:
{intro && <RichText data={intro} enableGutter={false} />}

// Item content (single richText, title + body combined):
{richText && <RichText data={richText} enableGutter={false} />}
```

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

For multi-variant blocks add a `type` select as the **first field**:

```ts
{
  name: 'type',
  type: 'select',
  defaultValue: 'section1',
  options: [
    { label: 'Variant Label 1', value: 'section1' },
    { label: 'Variant Label 2', value: 'section3' },
  ],
},
```

Fields only used by specific variants use `admin.condition`:

```ts
{
  name: 'someField',
  type: 'text',
  admin: {
    condition: (_, siblingData) => ['section1', 'section3'].includes(siblingData?.type),
  },
},
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

Create one `SectionN/index.tsx` per variant (one per arg passed to the skill).

### `src/blocks/<BlockName>/Component.tsx`

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

For a single-variant block, `Component.tsx` renders the component directly (no router).

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
- [ ] Section heading/body uses `intro` richText (h2/h3 + toolbars), rendered with `<RichText>`
- [ ] Repeating items use a single `richText` field (h3/h4 + toolbars) — no split `title` + `description`
- [ ] Block slug registered in both `Pages/index.ts` AND `RenderBlocks.tsx`
- [ ] `tsc --noEmit` passes clean
- [ ] Migration file generated and verified

Report a summary: block name, variants created (one per arg), fields defined, files created/modified.
