# Import a block from payloadcms/website

Port a block from the Payload CMS website GitHub repo into this project, adapting
schema, styles, and imports to our stack (Tailwind v4, slate design system,
`RichText`, `lexicalEditor`).

**Argument:** `$ARGUMENTS` — the exact PascalCase block name as it appears in
`payloadcms/website/src/blocks/` or `src/components/blocks/`.

Example: `/import-payload-block CaseStudiesHighlight`

---

## Step 0 — Read project context

Before fetching anything, read these files so you know the live patterns:

- `src/blocks/RenderBlocks.tsx` — registered block map
- `src/collections/Pages/index.ts` — layout blocks array and import style
- `src/payload.config.ts` — collections array
- `src/blocks/HoverHighlights/config.ts` + `src/blocks/HoverHighlights/Component.tsx` — reference block

Announce your plan at the start:
> "Fetching **$ARGUMENTS** from payloadcms/website…"
> List any dependencies you detect (missing collections, missing packages) as you discover them.

---

## Step 1 — Fetch source files from GitHub

Use `WebFetch` on the GitHub Contents API. The API returns JSON; the file content
is in the `content` field, base64-encoded. Use a JavaScript `atob()` equivalent
(ask Bash: `echo '<base64>' | base64 -d`) to decode when needed, or read the
`content` field and decode it yourself inline.

**Try these paths in order (stop at first 200):**

### Schema / config

```
https://api.github.com/repos/payloadcms/website/contents/src/blocks/$ARGUMENTS/index.ts
https://api.github.com/repos/payloadcms/website/contents/src/blocks/$ARGUMENTS/config.ts
```

### Component

```
https://api.github.com/repos/payloadcms/website/contents/src/components/blocks/$ARGUMENTS/index.tsx
https://api.github.com/repos/payloadcms/website/contents/src/blocks/$ARGUMENTS/Component.tsx
```

### Styles (fetch only if referenced in the component)

```
https://api.github.com/repos/payloadcms/website/contents/src/components/blocks/$ARGUMENTS/index.module.scss
```

If the block folder contains sub-files (variants), list the folder via:
```
https://api.github.com/repos/payloadcms/website/contents/src/blocks/$ARGUMENTS
https://api.github.com/repos/payloadcms/website/contents/src/components/blocks/$ARGUMENTS
```
and fetch each relevant file.

When a fetch returns 404, move to the next candidate. If all candidates 404,
tell the user and stop.

---

## Step 2 — Dependency analysis (run before writing any files)

### A. Missing Payload collections

Scan the fetched schema for `type: 'relationship', relationTo: '<slug>'`.
For each `relationTo` value:

1. Check if `src/collections/<PascalCase>/` exists locally.
2. If **missing**, fetch it from the website repo:
   ```
   https://api.github.com/repos/payloadcms/website/contents/src/collections/<slug>.ts
   https://api.github.com/repos/payloadcms/website/contents/src/collections/<slug>/index.ts
   ```
3. Adapt and create it (see Phase 5 below).
4. Recurse — check the new collection for its own `relationTo` dependencies.

### B. Missing npm packages

Scan all `import` statements in the fetched component(s). For each package not
found in `package.json`:

```bash
pnpm add <package>
```

### C. Missing internal components / graphics

Scan for imports like `@components/SomeWidget`, `@graphics/SomeLogo`, or
`../SomeHelper`. For each:

- If it exists at `src/components/…`, use the local version.
- If it is a simple SVG/icon, replace it with a `lucide-react` equivalent.
- If it is complex and unavailable, add a `// TODO: replace <X>` comment and skip it.

Announce all findings before writing files:
> "Detected: missing collection `case-studies`, missing package `@faceless-ui/mouse-info`. Will create collection and install package."

---

## Step 3 — Schema adaptation rules

Transform the source schema into our block config format.

| Source pattern | Our pattern |
|---|---|
| `blockFields({ name, fields })` wrapper | Flat `fields` array directly on the block |
| `richText()` factory call | Full `lexicalEditor(…)` config (see template below) |
| `settings` group (theme/bg color) | **Drop** — we don't use theme switching |
| Missing `interfaceName` | Add `interfaceName: '$ARGUMENTSBlock'` |
| Missing `labels` | Add `labels: { singular: '...', plural: '...' }` |
| `blockType` field | **Drop** — Payload adds this automatically |
| Complex access control hooks | **Drop** for blocks (not applicable) |
| `admin.hidden: true` fields | Keep if meaningful; drop cosmetic ones |

**richText field template:**

```typescript
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

// Section-level intro (heading + body):
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

// Item-level content (replaces separate title + description):
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

**Config file template:**

```typescript
import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const $ARGUMENTS: Block = {
  slug: '<camelCaseSlug>',
  interfaceName: '$ARGUMENTSBlock',
  labels: { singular: '<Human Name>', plural: '<Human Name>s' },
  fields: [
    // adapted fields
  ],
}
```

---

## Step 4 — Component adaptation rules

### Styling: SCSS → Tailwind

| SCSS / CSS-in-JS pattern | Tailwind equivalent |
|---|---|
| `@include h1` / `@include h2` | `text-5xl font-semibold text-slate-700` |
| `@include large-body` | `text-xl font-light text-slate-600` |
| `@include shadow-lg` / `box-shadow: ...` | `shadow-lg` |
| `var(--block-spacing)` | `py-16 md:py-32` |
| `var(--theme-bg)` | `bg-background` |
| Gutter / max-width container | `mx-auto max-w-5xl px-6` |
| `padding-top: 56.25%` (16:9 ratio) | `aspect-video` |
| `opacity: 0.3` → `1` on hover | `opacity-30 hover:opacity-100` |
| `transform: translate3d(0, -1rem, 0)` on hover | `hover:-translate-y-4` |
| `transition: all 200ms ease-out` | `transition-all duration-200 ease-out` |
| SCSS module `classes.someClass` | Inline Tailwind className string |

### Import remapping

| Source import | Our import |
|---|---|
| `@components/Gutter` | Remove; use `mx-auto max-w-5xl px-6` inline |
| `@components/RichText` or `../RichText` | `import RichText from '@/components/RichText'` |
| `@root/payload-types` or `../../payload-types` | `@/payload-types` |
| `@components/Media` or `../Media` | `import { Media } from '@/components/Media'` |
| `@components/CMSLink` or link helpers | `import { CMSLink } from '@/components/Link'` |
| SCSS module import | **Remove** — replace with Tailwind |
| `PayloadIcon`, `@graphics/*` | Replace with nearest `lucide-react` icon or drop |
| `@faceless-ui/*` | Install via `pnpm add` and keep as-is |

### RichText rendering

```tsx
import RichText from '@/components/RichText'

{intro && (
  <RichText
    data={intro}
    enableGutter={false}
    className="[&_h2]:text-5xl [&_h2]:text-slate-700 [&_h2]:leading-[1.1] [&_h2]:font-semibold [&_h2]:mb-6 [&_p]:text-slate-600 [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light"
  />
)}
```

### Section wrapper pattern

```tsx
<section className="py-16 md:py-32">
  <div className="mx-auto max-w-5xl px-6">
    {/* content */}
  </div>
</section>
```

### Upload field guard (always required before `<Media>`)

```tsx
{typeof someImage === 'object' && someImage && (
  <Media resource={someImage} imgClassName="w-full h-auto object-cover" />
)}
```

### Add `'use client'` only when needed

Add at the top if the component uses React hooks (`useState`, `useEffect`, `useRef`),
mouse/scroll events, or any browser-only APIs. Omit it otherwise.

### Component file template

```tsx
// 'use client'  ← add only if needed
import React from 'react'
import type { $ARGUMENTSBlock as $ARGUMENTSBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const $ARGUMENTSBlock: React.FC<
  $ARGUMENTSBlockType & { disableInnerContainer?: boolean }
> = ({ intro, items, links }) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* adapted JSX */}
      </div>
    </section>
  )
}
```

---

## Step 5 — Collection adaptation rules (when a missing collection is needed)

Create `src/collections/<PascalCase>/index.ts`:

```typescript
import type { CollectionConfig } from 'payload'

export const <PascalCase>: CollectionConfig = {
  slug: '<kebab-case-slug>',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    // adapted fields from source
  ],
}
```

Rules for adapting source collections:
- **Replace** complex access control functions with `() => true` for `read`; omit write access (defaults to admin-only).
- **Drop** `versions`, `hooks`, `endpoints` unless they are trivially simple.
- **Drop** `blockFields` wrappers → use flat fields.
- **Keep** `relationTo` references and adapt them recursively (Step 2A).

Then register in `src/payload.config.ts`:
1. Add import: `import { <PascalCase> } from './collections/<PascalCase>'`
2. Add to the `collections` array.

---

## Step 6 — Write all files

Write in this order:
1. Any new collection files (`src/collections/<Name>/index.ts`)
2. Block config (`src/blocks/$ARGUMENTS/config.ts`)
3. Block component (`src/blocks/$ARGUMENTS/Component.tsx`)
4. Variant components if the source has sub-folders (`src/blocks/$ARGUMENTS/<Variant>/index.tsx`)

**Do not overwrite existing files without telling the user.**
If a file already exists at the target path, read it first and ask whether to overwrite.

---

## Step 7 — Registration

### `src/blocks/RenderBlocks.tsx`

Add import line (keep alphabetical order by variable name):
```typescript
import { $ARGUMENTSBlock } from '@/blocks/$ARGUMENTS/Component'
```

Add entry to `blockComponents`:
```typescript
<camelCaseSlug>: $ARGUMENTSBlock,
```

### `src/collections/Pages/index.ts`

Add import:
```typescript
import { $ARGUMENTS } from '../../blocks/$ARGUMENTS/config'
```

Add to the `blocks` array inside the layout field (keep the existing block list intact,
just append to it).

### `src/payload.config.ts` (only if a new collection was created)

Add import and add to `collections` array.

---

## Step 8 — Install packages and generate types

If any packages were installed in Step 2B, confirm they are in `package.json` before
proceeding.

Run type generation:
```bash
pnpm payload generate:types
```

Then check TypeScript:
```bash
pnpm exec tsc --noEmit
```

Fix any errors before reporting done. Common issues:
- `typeof upload === 'object' && upload` guard missing before `<Media>`
- Array `.map()` items missing `key` prop
- `'use client'` missing on files with hooks
- Import path typos

---

## Step 9 — Generate migration

```bash
pnpm payload migrate:create --name add_$ARGUMENTS_block
```

Verify the generated file in `src/migrations/` contains the expected tables
(`pages_blocks_<slug>`, `_pages_v_blocks_<slug>`) and any collection tables.

---

## Step 10 — Final checklist

Report back with a checklist:

- [ ] Source schema fetched and decoded
- [ ] Source component fetched and decoded
- [ ] All `relationTo` dependencies resolved (collections created or confirmed existing)
- [ ] All missing npm packages installed
- [ ] Schema adapted: no `blockFields` wrapper, `interfaceName` present, richText uses `lexicalEditor`
- [ ] Component adapted: no SCSS, all imports remapped, Tailwind classes used
- [ ] All upload fields guarded with `typeof x === 'object' && x`
- [ ] `'use client'` added only where needed
- [ ] `Media` used for all image rendering (not `<img>`)
- [ ] `CMSLink` used for all links (not `<a>`)
- [ ] Block registered in `RenderBlocks.tsx` and `Pages/index.ts`
- [ ] New collections registered in `payload.config.ts` (if any)
- [ ] `pnpm payload generate:types` ran successfully
- [ ] `tsc --noEmit` passes clean
- [ ] Migration file generated

Report: block name, fields defined, files created, files modified, packages installed,
collections created (if any).
