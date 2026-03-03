# Block Styleguide Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create two reference files — a full rule-book styleguide and a condensed AI-prompt cheat sheet — that govern how every new Payload CMS block is designed, coded, and shipped in this project.

**Architecture:** Two static markdown files: `docs/BLOCK_STYLEGUIDE.md` (master, ~700 lines, rule-book format WHY → RULE → EXAMPLE) and `docs/BLOCK_REFERENCE.md` (cheat sheet, ~120 lines, rules + snippets only). No code changes. No migrations needed.

**Tech Stack:** Payload CMS 3.x, Next.js 15, TailwindCSS v4, motion/react, lucide-react, shadcn/ui

**Reference source:** `docs/plans/2026-03-03-block-styleguide-design.md` — read this first before implementing any task.

---

### Task 1: Create master styleguide — Sections 1–3 (Design Tokens, Typography, Spacing)

**Files:**
- Create: `docs/BLOCK_STYLEGUIDE.md`

**Step 1: Create the file with header and first three sections**

Create `docs/BLOCK_STYLEGUIDE.md` with this exact content:

```markdown
# iNELS Content Studio — Block Styleguide

> **Rule-book format:** Each rule follows WHY → RULE → EXAMPLE.
> This document is the source of truth for all new Payload CMS blocks.
> See `docs/BLOCK_REFERENCE.md` for the condensed AI-prompt cheat sheet.

---

## 1. Design Tokens

### 1.1 Colors

**WHY:** We use semantic CSS variables so every component responds to theme switching automatically without needing to know which raw palette color is active.

**RULE:** Always use semantic token names (`--primary`, `--muted`, `--card`, `--border`) in Tailwind classes. Never reference raw palette steps (`brand-500`, `neutral-200`) directly in components.

**Exception:** Use raw palette only when a value must override a semantic token for a specific design intent (e.g., a forced dark tint on a media overlay).

**Semantic tokens available:**
| Token | Light value | Dark value | Use |
|---|---|---|---|
| `bg-background` | neutral-0 (white) | neutral-950 | Page background |
| `bg-card` | neutral-0 | neutral-900 | Card surfaces |
| `bg-muted` | neutral-100 | neutral-800 | Subtle card / chip bg |
| `text-foreground` | neutral-950 | neutral-50 | Primary text |
| `text-muted-foreground` | neutral-500 | neutral-400 | Placeholder, captions |
| `border-border` | neutral-200 | neutral-700 | Borders, dividers |
| `bg-primary` | brand-500 | brand-400 | Primary CTA, icons |
| `text-primary` | brand-500 | brand-400 | Accent text, icons |
| `text-type-heading` | neutral-950 | neutral-50 | All headings |
| `text-type-body` | neutral-800 | neutral-200 | Body copy |
| `text-type-secondary` | neutral-500 | neutral-400 | Supporting text |
| `text-type-tertiary` | neutral-400 | neutral-600 | Captions, metadata |

**EXAMPLE:**
```tsx
// ✅ Correct
<div className="bg-card border border-border text-type-body">

// ❌ Wrong — hardcoded palette
<div className="bg-neutral-0 border border-neutral-200 text-neutral-800">
```

---

### 1.2 Section Themes

**WHY:** Blocks can sit on different background contexts. Three section themes let a block invert or brand its background without custom CSS.

**RULE:** Apply `data-section-theme` on the block's outermost wrapper when the block needs a non-default background. Never hardcode dark backgrounds with `bg-slate-900` etc.

| Value | Background | Text |
|---|---|---|
| `light` | neutral-0 (white) | neutral-950 |
| `dark` | brand-950 | brand-50 |
| `brand` | brand-600 | brand-100/200 |

**EXAMPLE:**
```tsx
<section data-section-theme="dark" className="py-24">
  {/* All text/bg tokens auto-invert */}
</section>
```

---

### 1.3 Dark Mode

**WHY:** Dark mode is driven by `data-theme="dark"` on `<html>`. Components must not assume a default theme.

**RULE:** Use `dark:` Tailwind prefix for theme-specific overrides. For image variants (light/dark), pass both `imageLight` and `imageDark` fields and toggle with `.dark:hidden` / `.dark:block`.

**EXAMPLE:**
```tsx
{imageLight && (
  <Media resource={imageLight} className="dark:hidden" />
)}
{imageDark && (
  <Media resource={imageDark} className="hidden dark:block" />
)}
```

---

## 2. Typography

### 2.1 Type Scale

**WHY:** The project has a complete fluid type system. Using ad-hoc `text-2xl` or `text-lg` classes bypasses it and creates inconsistency.

**RULE:** Always use the project type utilities. Never use raw Tailwind text-size classes for headings or body copy.

**Full type scale:**
| Utility | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `type-display` | 5.25rem | 600 | 1.05 | -0.03em | Hero display (rare) |
| `type-headline-1` | 3.75rem | 600 | 1.1 | -0.025em | Page/section primary heading |
| `type-headline-2` | 3rem | 600 | 1.15 | -0.02em | Major section heading |
| `type-headline-3` | 2.25rem | 600 | 1.2 | -0.015em | Subsection heading |
| `type-headline-4` | 1.875rem | 600 | 1.25 | -0.01em | Feature card heading |
| `type-title-xl` | 1.75rem | 600 | 1.3 | -0.005em | Large title, sub-hero |
| `type-title-lg` | 1.25rem | 600 | 1.35 | — | Card title, nav heading |
| `type-title-md` | 1.125rem | 500 | 1.4 | — | Small card title |
| `type-title-sm` | 1rem | 500 | 1.4 | — | Tight title, badge label |
| `type-body-xl` | 1.25rem | 400 | 1.75 | — | Section intro paragraph |
| `type-body-lg` | 1.125rem | 400 | 1.7 | — | Card body text |
| `type-body-md` | 1rem | 400 | 1.65 | — | Standard body text |
| `type-body-sm` | 0.875rem | 400 | 1.6 | — | Secondary/caption body |
| `type-body-xs` | 0.75rem | 400 | 1.5 | — | Micro text, metadata |
| `type-label-lg` | 0.875rem | 500 | 1.4 | 0.08em | Section label / eyebrow |
| `type-label-md` | 0.75rem | 500 | 1.4 | 0.1em | Badge label |
| `type-label-sm` | 0.6875rem | 500 | 1.4 | 0.1em | Tiny tag/chip |
| `type-stat` | 4.5rem | 700 | 1 | -0.04em | Stat numbers |
| `type-stat-xl` | 6rem | 700 | 1 | -0.04em | Hero stat numbers |
| `type-quote` | 1.25rem | 400 | 1.75 | — | Testimonial / pull quote |

---

### 2.2 Type Color Semantics

**RULE:** Pair every type utility with its appropriate color token. Headings = `text-type-heading`, body = `text-type-body`, supporting = `text-type-secondary`.

**Heading hierarchy in a block:**
```tsx
<h2 className="type-headline-1 text-type-heading">Section Title</h2>
<p className="type-body-xl text-type-secondary">Supporting intro sentence.</p>
```

---

### 2.3 RichText className Override Pattern

**WHY:** The `RichText` component renders arbitrary CMS content. We override heading/paragraph sizes via Tailwind's arbitrary group selector so each block controls its own typographic context.

**RULE:** Always pass a `className` to `<RichText>` that maps headings and paragraphs to your block's intended sizes. Never rely on the default prose styles for block intros.

**Standard patterns:**
```tsx
// Section intro (h2 block heading + body paragraph)
<RichText
  data={intro}
  enableGutter={false}
  className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"
/>

// Feature card body (h3/h4 + tighter paragraph)
<RichText
  data={richText}
  enableGutter={false}
  className="[&_h3]:type-title-md [&_h3]:text-type-heading [&_p]:type-body-sm [&_p]:text-type-secondary"
/>

// Stats block (h3 = number, h4 = label)
<RichText
  data={stat}
  enableGutter={false}
  className="[&_h3]:type-stat-xl [&_h3]:leading-none [&_h4]:type-label-lg [&_p]:type-body-sm"
/>
```

**Context guide:**
| Block context | h2 | h3 | h4 | p |
|---|---|---|---|---|
| Section intro | `type-headline-1` or `type-headline-2` | `type-headline-3` | — | `type-body-xl` |
| Feature item card | — | `type-title-md` | `type-title-sm` | `type-body-sm` |
| CTA richText | — | `type-headline-3` | — | `type-body-lg` |
| Stat number | — | `type-stat-xl` | `type-stat` | `type-label-lg` |
| Testimonial quote | — | `type-quote` | — | `type-body-md` |

---

## 3. Spacing & Layout

### 3.1 Container

**WHY:** All blocks must align to the same horizontal grid. The project uses a capped, centered container.

**RULE:** Wrap block content in `mx-auto max-w-7xl px-6 md:px-8`. Never use `container` (Tailwind default) or custom max-widths.

**EXAMPLE:**
```tsx
<section className="py-24">
  <div className="mx-auto max-w-7xl px-6 md:px-8">
    {/* block content */}
  </div>
</section>
```

---

### 3.2 Block Vertical Rhythm

**WHY:** `RenderBlocks` wraps each block in `my-16` (64px). Blocks should NOT add outer vertical margin — that creates doubled spacing.

**RULE:** Blocks handle their own inner vertical padding (`py-*`). They must NOT add `my-*` or `mb-*` on their outermost element.

**EXAMPLE:**
```tsx
// ✅ Block controls inner padding
<section className="py-16 md:py-24">

// ❌ Block fighting RenderBlocks margin
<section className="my-24 py-16">
```

---

### 3.3 Internal Spacing

**Standard spacings:**

| Context | Class |
|---|---|
| Between intro and content body | `mt-8 md:mt-12` |
| Between section blocks (vertical stack) | `space-y-8 md:space-y-12` |
| Feature section gap (2-col split) | `gap-16 md:gap-32` |
| Card grid gap | `gap-4 md:gap-6` |
| Card internal padding | `px-6 py-8` |

---

### 3.4 Card Style Rules

**RULE:** All card surfaces use these exact classes unless there is a strong design reason to deviate:
- Background: `bg-card` or `bg-muted`
- Border: `border border-border` (optional, omit for borderless cards)
- Radius: `rounded-none` — project design token is sharp corners
- Padding: `px-6 py-8`

**EXAMPLE:**
```tsx
<div className="bg-muted px-6 py-8 rounded-none">
  {/* card content */}
</div>
```
```

**Step 2: Commit**

```bash
git add docs/BLOCK_STYLEGUIDE.md
git commit -m "docs: add block styleguide sections 1-3 (tokens, typography, spacing)"
```

---

### Task 2: Master styleguide — Sections 4–5 (Block Architecture, Field Standards)

**Files:**
- Modify: `docs/BLOCK_STYLEGUIDE.md`

**Step 1: Append sections 4 and 5**

Append to `docs/BLOCK_STYLEGUIDE.md`:

```markdown
---

## 4. Block Architecture

### 4.1 File Structure

**RULE:** Every block lives in its own directory under `src/blocks/`. The structure is:

```
src/blocks/BlockName/
  config.ts              # Payload CMS field definitions
  Component.tsx          # Entry point: variant router or direct component
  VariantA/
    index.tsx            # Variant implementation
  VariantB/
    index.tsx
```

Single-variant blocks: skip the variant subdirectory, put the implementation directly in `Component.tsx`.

---

### 4.2 config.ts Shape

**RULE:** Every config.ts exports a named `Block` constant matching this shape:

```typescript
import type { Block } from 'payload'
import { lexicalEditor, HeadingFeature, FixedToolbarFeature, InlineToolbarFeature } from '@payloadcms/richtext-lexical'

export const BlockName: Block = {
  slug: 'blockName',                    // camelCase, matches RenderBlocks key
  interfaceName: 'BlockNameBlock',      // PascalCase + Block suffix
  labels: {
    singular: 'Block Name',
    plural: 'Block Names',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',          // Always provide a defaultValue
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Alternate', value: 'alternate' },
      ],
    },
    {
      name: 'intro',
      type: 'richText',
      required: false,                  // Intro is always optional
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: ICON_OPTIONS,         // From src/blocks/shared/featureIcons.ts
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
    // Optional image group — use collapsible
    {
      type: 'collapsible',
      label: 'Images',
      fields: [
        { name: 'imageLight', type: 'upload', relationTo: 'media', required: false },
        { name: 'imageDark',  type: 'upload', relationTo: 'media', required: false },
      ],
    },
  ],
}
```

---

### 4.3 Component.tsx — Variant Router

**RULE:** When a block has multiple variants, Component.tsx is a thin router. All logic lives in the variant files.

```typescript
import React from 'react'
import type { BlockNameBlock } from '@/payload-types'
import { VariantA } from './VariantA'
import { VariantB } from './VariantB'

const variants = {
  variantA: VariantA,
  variantB: VariantB,
}

export const BlockNameComponent: React.FC<BlockNameBlock> = (props) => {
  const Variant = variants[props.variant ?? 'variantA'] ?? VariantA
  return <Variant {...props} />
}
```

---

### 4.4 Variant index.tsx Shape

```typescript
'use client'  // Required if using motion, hooks, or browser APIs

import React from 'react'
import { motion, useScroll, useTransform, useInView } from 'motion/react'
import type { BlockNameBlock } from '@/payload-types'
import { RichText } from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const VariantA: React.FC<BlockNameBlock> = ({ intro, items, imageLight, imageDark }) => {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {intro && (
          <RichText
            data={intro}
            enableGutter={false}
            className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"
          />
        )}
        {/* main content */}
      </div>
    </section>
  )
}
```

---

### 4.5 Registration

After creating the block, register it in two places:

**`src/blocks/RenderBlocks.tsx`** — add import and entry to `blockComponents`:
```typescript
import { BlockNameComponent as BlockNameBlock } from './BlockName/Component'

const blockComponents = {
  // ...existing blocks
  blockName: BlockNameBlock,
}
```

**`src/collections/Pages/index.ts`** — add to `blocks` array in the layout field:
```typescript
import { BlockName } from '@/blocks/BlockName/config'

// Inside fields → layout → blocks array:
blocks: [
  // ...existing blocks
  BlockName,
],
```

---

## 5. Field Standards

### 5.1 Admin UI Structure

**RULE — flat vs collapsible vs tabs:**

| Situation | Pattern |
|---|---|
| ≤ 5 fields, single concern | Flat field list |
| Optional related fields (images, settings) | `type: 'collapsible'` |
| 2+ distinct concerns (content / media / settings) | `type: 'tabs'` with named tabs |

**RULE:** Always add `label` and `description` on fields that editors interact with. They have no code context.

```typescript
{
  name: 'variant',
  type: 'select',
  label: 'Layout Variant',
  admin: {
    description: 'Controls the visual layout of this block.',
  },
  defaultValue: 'split',
  options: [...],
}
```

---

### 5.2 Field Naming Conventions

**RULE:** Use these canonical names. Never invent synonyms.

| Field purpose | Name |
|---|---|
| Section intro richText | `intro` |
| Array of feature/card items | `items` |
| Primary image | `image` |
| Light-mode background image | `imageLight` |
| Dark-mode background image | `imageDark` |
| Foreground layered image | `imageForeground` |
| Layout/style selector | `variant` |
| Icon picker (select) | `icon` |
| Single link field | `link` |
| Multiple links (linkGroup) | `links` |
| Background color/theme | `theme` |
| Badge / eyebrow label | `badge` |

---

### 5.3 RichText Defaults by Context

Configure the Lexical editor based on where the richText lives:

| Context | Enabled headings | Toolbar |
|---|---|---|
| Section intro | `h2`, `h3` | Fixed + Inline |
| Feature/card body | `h3`, `h4` | Inline only |
| CTA richText | `h3` only | Inline only |
| Stats (number + label) | `h3`, `h4` | Inline only |
| Testimonial / quote | none | Inline only |

---

### 5.4 Field Rules

- `variant` select: **always** has `defaultValue`
- `intro` richText: **always** `required: false` — blocks must work without a heading
- `items` arrays: **always** set both `minRows` and `maxRows`
- Upload fields: **always** `relationTo: 'media'`, `required: false`
- Image fields: **never** mark as `required: true` — editors need to save drafts without images
- Link fields: use `linkGroup()` helper from `@/fields/linkGroup`; never build link fields manually
- Icon select: import `ICON_OPTIONS` from `@/blocks/shared/featureIcons.ts`
```

**Step 2: Commit**

```bash
git add docs/BLOCK_STYLEGUIDE.md
git commit -m "docs: add block styleguide sections 4-5 (architecture, field standards)"
```

---

### Task 3: Master styleguide — Sections 6–8 (CTA, Responsiveness, Animations)

**Files:**
- Modify: `docs/BLOCK_STYLEGUIDE.md`

**Step 1: Append sections 6, 7, and 8**

Append to `docs/BLOCK_STYLEGUIDE.md`:

```markdown
---

## 6. CTA & Links

### 6.1 Button Variants → Use Cases

| Variant | Use case | Example context |
|---|---|---|
| `default` | Primary action (solid azure) | Hero CTA, main block action |
| `outline` | Secondary action | Secondary block CTA alongside `default` |
| `ghost` | Tertiary / subtle | Nav-level, card hover action |
| `link` | Inline text link in prose | "Learn more" within body copy |
| `secondary` | Card-surface soft action | Card CTA, form secondary action |
| `destructive` | Destructive confirm | Delete, remove actions |

**Sizes:**
| Size | Use |
|---|---|
| `xl` | Hero / above-fold primary CTA |
| `lg` | Block-level CTAs |
| `default` | Standard inline actions |
| `sm` | Card CTAs, tight contexts |
| `xs` | Badge-level actions |
| `icon` / `icon-sm` / `icon-lg` | Icon-only buttons |

---

### 6.2 CMSLink vs Button

**RULE:** Use `CMSLink` whenever the link source comes from CMS fields (handles internal page reference vs external URL resolution). Use `Button` only for purely UI-driven actions with no CMS source.

```tsx
// ✅ CMS-sourced link
<CMSLink
  appearance="default"   // matches Button variant names
  size="lg"
  {...link}              // spread CMS link object (has url, reference, newTab, label)
/>

// ✅ UI-only action (no CMS field behind it)
<Button variant="outline" size="sm" onClick={handler}>
  Cancel
</Button>
```

---

### 6.3 Standard CTA Field

Always use the `linkGroup` helper for CTA fields:

```typescript
import { linkGroup } from '@/fields/linkGroup'

// In block config fields array:
linkGroup({
  appearances: ['default', 'outline'],
  overrides: { maxRows: 2 },
})
```

This generates a properly configured link array field with appearance selection baked in.

---

## 7. Responsiveness

### 7.1 Breakpoints

**RULE:** Mobile-first. The primary responsive boundary is `md:` (768px). Use `sm:`, `lg:`, `xl:`, `2xl:` only when `md:` is insufficient.

| Prefix | Breakpoint | Common use |
|---|---|---|
| _(base)_ | 0px | Mobile layout |
| `sm:` | 640px | Tablet adjustments (rare) |
| `md:` | 768px | Primary desktop layout switch |
| `lg:` | 1024px | Wide adjustments |
| `xl:` | 1280px | Large screen refinements |
| `2xl:` | 1376px | Max-width refinements |

---

### 7.2 Grid Column Patterns

**Standard grid patterns — copy exactly:**

```tsx
// Feature items (icons + text cards)
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

// 2-column content split (text + image)
<div className="md:grid md:grid-cols-2 md:gap-32 space-y-12 md:space-y-0">

// 3-column card grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

// 2-up card grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// Centered single column (content sections)
<div className="mx-auto max-w-3xl text-center">
```

---

### 7.3 Images

**RULE:** Use `fill` with a positioned parent for fluid responsive images. Use fixed aspect ratio containers for cards.

```tsx
// ✅ Fluid fill (hero, split layout)
<div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
  <Media resource={image} fill className="object-cover" />
</div>

// ✅ Fixed aspect card image
<div className="relative aspect-video overflow-hidden rounded-none">
  <Media resource={image} fill className="object-cover" />
</div>
```

**RULE:** Never manually add responsive text size overrides (`text-sm md:text-lg`). The type scale is already fluid via CSS clamp — just use the type utility.

---

### 7.4 Prose Responsiveness

```tsx
// Always add md:prose-md for proper scaling
<RichText
  data={intro}
  className="prose md:prose-md [&_h2]:type-headline-1 ..."
/>
```

---

## 8. Animations

### 8.1 Library & Setup

**RULE:** Use `motion/react` (Framer Motion). Always add `'use client'` to any file that imports from `motion/react`.

```typescript
import { motion, useScroll, useTransform, useInView } from 'motion/react'
```

---

### 8.2 Entry Animations

**Standard entry animation (use for most blocks):**
```tsx
const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-100px' })

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
>
```

**Staggered items (for arrays of cards/features):**
```tsx
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{
      duration: 0.5,
      delay: Math.min(index * 0.1, 0.5),  // Cap at 0.5s max delay
      ease: [0.16, 1, 0.3, 1],
    }}
  >
```

---

### 8.3 Parallax Scrolling

**Standard parallax pattern:**
```tsx
const containerRef = useRef(null)
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start end', 'end start'],
})

// Background image drifts down
const bgY = useTransform(scrollYProgress, [0, 1], ['0px', '30px'])
// Foreground image counter-drifts up
const fgY = useTransform(scrollYProgress, [0, 1], ['0px', '-50px'])

<div ref={containerRef}>
  <motion.div style={{ y: bgY }}>
    <Media resource={imageDark} />
  </motion.div>
  <motion.div style={{ y: fgY }}>
    <Media resource={imageForeground} />
  </motion.div>
</div>
```

**RULE:** Only use `useScroll` for parallax. Never use CSS `transform` on scroll via JS events — it causes layout jank.

---

### 8.4 Animation Rules

- `once: true` on `useInView` — animations trigger once, do not re-animate on scroll up
- Easing: always use `[0.16, 1, 0.3, 1]` for a natural feel
- Max stagger delay: `Math.min(index * 0.1, 0.5)` — cap at 500ms for large arrays
- Background parallax: `'0px' → '30px'` (subtle drift)
- Foreground parallax: `'0px' → '-50px'` (stronger counter-drift for depth)
- `useInView` margin: `'-100px'` to trigger slightly before element enters viewport
```

**Step 2: Commit**

```bash
git add docs/BLOCK_STYLEGUIDE.md
git commit -m "docs: add block styleguide sections 6-8 (CTA, responsiveness, animations)"
```

---

### Task 4: Master styleguide — Sections 9–10 (Migrations, Checklist)

**Files:**
- Modify: `docs/BLOCK_STYLEGUIDE.md`

**Step 1: Append sections 9 and 10**

Append to `docs/BLOCK_STYLEGUIDE.md`:

```markdown
---

## 9. Payload Migrations

### 9.1 When to Run Migrations

**RULE:** Run `pnpm payload migrate:create` after ANY change to a block's fields in `config.ts`. This includes adding fields, changing labels, or modifying options.

```bash
# After changing block config:
pnpm payload migrate:create --name add-featureShowcase-badge-field

# Apply locally before testing:
pnpm payload migrate
```

Migration files are auto-generated in `src/migrations/`. Always commit them with the feature branch.

---

### 9.2 Additive-Only Rule

**RULE:** Only additive changes are safe without data migration scripts. Anything else requires a migration plan.

| Change type | Safe? | Action required |
|---|---|---|
| Add a new field | ✅ Safe | Create migration, default value optional |
| Add a new select option | ✅ Safe | Create migration |
| Add a new variant | ✅ Safe | Create migration, update component |
| Rename a field | ❌ Breaking | See rename pattern below |
| Remove a field | ❌ Breaking | See removal pattern below |
| Change field `type` | ❌ Breaking | Create new field, migrate, remove old |
| Reorder fields | ✅ Safe (UI only) | No migration needed |

---

### 9.3 Field Rename Pattern

Never rename a field directly — it destroys existing content.

```
Step 1: Add new field with the new name
Step 2: Create migration → pnpm payload migrate:create --name rename-fieldOld-to-fieldNew
Step 3: Write data migration in the migration file to copy old → new values
Step 4: Mark old field as hidden: admin: { hidden: true }
Step 5: Create final migration to remove old field after data confirmed
Step 6: Remove old field from config.ts
```

---

### 9.4 Deployment Order

**RULE:** Always run migrations before deploying new component code.

```
1. Deploy migration (pnpm payload migrate) on staging
2. Verify data in admin UI
3. Deploy component code
4. Test in staging
5. Repeat for production
```

---

## 10. New Block Checklist

Copy this checklist when creating a new block.

```
## Block: [BlockName]
### Slug: [blockName]

### Config
[ ] Create src/blocks/BlockName/config.ts
    [ ] slug (camelCase)
    [ ] interfaceName = PascalCase + "Block"
    [ ] labels.singular + labels.plural
    [ ] variant field with defaultValue (if multiple variants)
    [ ] intro richText (required: false, h2/h3, Fixed+Inline toolbar)
    [ ] items array with minRows + maxRows (if applicable)
    [ ] icon select uses ICON_OPTIONS from shared/featureIcons.ts
    [ ] upload fields: relationTo: 'media', required: false
    [ ] linkGroup() helper for CTA fields
    [ ] Optional fields grouped in collapsible
    [ ] All fields have label + admin.description

### Component
[ ] Create src/blocks/BlockName/Component.tsx (variant router)
[ ] Create src/blocks/BlockName/VariantName/index.tsx
    [ ] 'use client' at top (if using motion or hooks)
    [ ] Section wrapper: py-16 md:py-24
    [ ] Container: mx-auto max-w-7xl px-6 md:px-8
    [ ] intro wrapped in conditional: {intro && <RichText ... />}
    [ ] RichText has correct className overrides for this context
    [ ] Mobile-first responsive grid
    [ ] Dark/light image variants with dark:hidden / dark:block
    [ ] CMSLink for all CMS-sourced links
    [ ] Cards use: bg-muted px-6 py-8 rounded-none

### Registration
[ ] Add to src/blocks/RenderBlocks.tsx (import + blockComponents entry)
[ ] Add to src/collections/Pages/index.ts (blocks array)

### Migration
[ ] pnpm payload migrate:create --name add-blockname-block
[ ] pnpm payload migrate (apply locally)
[ ] Commit migration file with feature branch

### Testing
[ ] Create block in CMS admin UI
[ ] Fill all fields, verify no console errors
[ ] Check light mode (default)
[ ] Check dark mode (toggle data-theme)
[ ] Check section-theme variants if block supports them
[ ] Verify mobile layout (375px viewport)
[ ] Verify desktop layout (1280px viewport)
[ ] Verify animations trigger on scroll
[ ] Check with all field combinations (empty intro, no images, etc.)
```
```

**Step 2: Commit**

```bash
git add docs/BLOCK_STYLEGUIDE.md
git commit -m "docs: add block styleguide sections 9-10 (migrations, new block checklist)"
```

---

### Task 5: Create cheat sheet — BLOCK_REFERENCE.md

**Files:**
- Create: `docs/BLOCK_REFERENCE.md`

**Step 1: Create the cheat sheet**

Create `docs/BLOCK_REFERENCE.md` with this content:

```markdown
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
```

**Step 2: Commit**

```bash
git add docs/BLOCK_REFERENCE.md
git commit -m "docs: add block reference cheat sheet for AI-assisted block creation"
```

---

### Task 6: Update MEMORY.md to reference the new docs

**Files:**
- Modify: `/Users/nithin/.claude/projects/-Users-nithin-Code-Gigs-inels-payload-inels-content-studio/memory/MEMORY.md`

**Step 1: Add styleguide references to Key Files section**

In the MEMORY.md file, add to the Key Files section:
```markdown
- `docs/BLOCK_STYLEGUIDE.md` — Full block authoring rulebook (design tokens, typography, spacing, fields, migrations)
- `docs/BLOCK_REFERENCE.md` — Condensed AI cheat sheet for new block creation
```

**Step 2: Commit**

```bash
git add /Users/nithin/.claude/projects/-Users-nithin-Code-Gigs-inels-payload-inels-content-studio/memory/MEMORY.md
```

Note: Memory files don't need to be committed to the project repo — they live in the Claude projects directory. Just save the file.

---

## Done

Both files are now in place. When creating a new block:
- Feed `docs/BLOCK_REFERENCE.md` as context to the AI
- Use `docs/BLOCK_STYLEGUIDE.md` for detailed rule lookup
- Follow the checklist at the end of Section 10
