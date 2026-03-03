# Block Reference — AI Prompt Cheat Sheet

> Condensed rules for `inels-content-studio` Payload CMS blocks.
> Full reference: `docs/BLOCK_STYLEGUIDE.md`
> Reference implementation: `src/blocks/FeatureShowcase/`

---

## Colors — Use Semantic Tokens Only
- `bg-background`, `bg-card`, `bg-muted` — surfaces
- `text-type-heading`, `text-type-body`, `text-type-secondary`, `text-type-tertiary` — text
- `bg-primary`, `text-primary` — brand accent
- `border-border` — borders
- Never use raw palette (`brand-500`, `neutral-200`) in components

## Section Themes
- `data-section-theme="light|dark|brand"` on block wrapper
- Never hardcode dark backgrounds

## Dark Mode Images
```tsx
{imageLight && <Media resource={imageLight} className="dark:hidden" />}
{imageDark && <Media resource={imageDark} className="hidden dark:block" />}
```

---

## Typography — Never Use Raw text-* Classes

| Utility | Use |
|---|---|
| `type-headline-1` | Section primary heading (h2) |
| `type-headline-2` | Major section heading |
| `type-headline-3` | Subsection / feature heading (h3) |
| `type-title-md` | Card title |
| `type-body-xl` | Section intro paragraph |
| `type-body-md` | Standard body |
| `type-body-sm` | Supporting / caption |
| `type-label-lg` | Eyebrow / badge |
| `type-stat-xl` | Stat number |

## RichText className Overrides
```tsx
// Section intro
className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"

// Feature card
className="[&_h3]:type-title-md [&_h3]:text-type-heading [&_p]:type-body-sm [&_p]:text-type-secondary"
```

---

## Layout

- Container: `mx-auto max-w-7xl px-6 md:px-8`
- Block padding: `py-16 md:py-24` — NO `my-*` (RenderBlocks adds `my-16`)
- Card: `bg-muted px-6 py-8 rounded-none`

## Grids
```tsx
grid grid-cols-2 md:grid-cols-4 gap-4          // Feature items
md:grid md:grid-cols-2 md:gap-32               // 2-col content split
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 // 3-col cards
```

---

## Block File Structure
```
src/blocks/BlockName/
  config.ts       # Payload fields
  Component.tsx   # Variant router
  VariantA/index.tsx
```

## config.ts Pattern
```typescript
export const BlockName: Block = {
  slug: 'blockName',
  interfaceName: 'BlockNameBlock',
  fields: [
    { name: 'variant', type: 'select', defaultValue: 'a', options: [...] },
    { name: 'intro', type: 'richText', required: false, editor: lexicalEditor({
      features: ({ rootFeatures }) => [...rootFeatures,
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
        FixedToolbarFeature(), InlineToolbarFeature()],
    })},
    { name: 'items', type: 'array', minRows: 1, maxRows: 8, fields: [...] },
    { type: 'collapsible', label: 'Images', fields: [
      { name: 'imageLight', type: 'upload', relationTo: 'media', required: false },
      { name: 'imageDark',  type: 'upload', relationTo: 'media', required: false },
    ]},
  ],
}
```

## Field Naming
| Purpose | Name |
|---|---|
| Section intro | `intro` |
| Items array | `items` |
| Layout selector | `variant` |
| Light image | `imageLight` |
| Dark image | `imageDark` |
| Foreground image | `imageForeground` |
| Icon picker | `icon` |

## Field Rules
- `variant`: always has `defaultValue`
- `intro`: always `required: false`
- `items`: always set `minRows` + `maxRows`
- Uploads: always `relationTo: 'media'`, `required: false`
- Links: use `linkGroup()` helper, never manual link fields
- Icons: import `ICON_OPTIONS` from `@/blocks/shared/featureIcons.ts`

---

## CTAs
| Variant | Use |
|---|---|
| `default` | Primary (solid azure) |
| `outline` | Secondary |
| `ghost` | Tertiary |
| `link` | Inline prose link |

- Size: `lg` for block-level, `default` inline, `sm` for cards
- CMS link → `<CMSLink appearance="default" size="lg" {...link} />`
- UI only → `<Button variant="outline" size="sm">`
- CTA field: `linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } })`

---

## Animations
```tsx
'use client'  // Required with motion
import { motion, useInView } from 'motion/react'

const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-100px' })

<motion.div ref={ref}
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
/>

// Stagger: delay={Math.min(index * 0.1, 0.5)}
```

---

## Migrations
```bash
pnpm payload migrate:create --name add-blockname-field
pnpm payload migrate
```
- Additive only: adding fields = safe; rename/remove/retype = breaking
- Rename: add new → migrate data → hide old → remove old (2 PRs)
- Commit migration files with feature branch

---

## Register New Block
1. `src/blocks/RenderBlocks.tsx` → import + add to `blockComponents`
2. `src/collections/Pages/index.ts` → add to `blocks` array

---

## Quick Checklist
- [ ] Config: slug, interfaceName, defaultValue on variant, required: false on intro + images
- [ ] Component: 'use client', py-16 md:py-24, max-w-7xl container, RichText className overrides
- [ ] Register in RenderBlocks + Pages
- [ ] Migration: create + apply
- [ ] Test: light/dark/section-theme, mobile 375px, desktop 1280px
