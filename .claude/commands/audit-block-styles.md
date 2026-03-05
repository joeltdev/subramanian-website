# Audit and fix block style inconsistencies

Audit an existing Payload CMS block against the iNELS Content Studio styleguide and fix all violations.

**Arguments:** `$ARGUMENTS` — block name or path (e.g. `FeatureShowcase` or `src/blocks/FeatureShowcase`)

---

## Design Language & Visual Rules

These rules are non-negotiable. Every violation must be fixed.

### Colors — Semantic Tokens Only

Always use semantic tokens. Never use raw palette values in component classes.

| ✅ Use | ❌ Never use |
|---|---|
| `bg-background`, `bg-card`, `bg-muted` | `bg-white`, `bg-neutral-0`, `bg-neutral-900` |
| `text-type-heading` | `text-neutral-950`, `text-slate-900` |
| `text-type-body` | `text-neutral-800` |
| `text-type-secondary` | `text-neutral-500`, `text-gray-500` |
| `text-type-tertiary` | `text-neutral-400` |
| `bg-primary`, `text-primary` | `bg-brand-500`, `text-azure-500` |
| `border-border` | `border-neutral-200`, `border-gray-200` |

Section backgrounds via `data-section-theme="light|dark|brand"` — never hardcode dark backgrounds with `bg-slate-900`, `bg-gray-950`, etc.

### Typography — Type Utilities Only

Never use raw Tailwind text-size classes (`text-2xl`, `text-lg`, etc.) for headings or body copy. Use the project's fluid type system:

| Utility | Use case |
|---|---|
| `type-display` | Hero display (rare) |
| `type-headline-1` | Section primary heading (h2) |
| `type-headline-2` | Major section heading |
| `type-headline-3` | Subsection / feature heading (h3) |
| `type-headline-4` | Feature card heading |
| `type-title-xl`, `type-title-lg` | Large titles, sub-hero, nav heading |
| `type-title-md`, `type-title-sm` | Card titles |
| `type-body-xl` | Section intro paragraph |
| `type-body-lg` | Card body text |
| `type-body-md` | Standard body text |
| `type-body-sm` | Secondary / caption body |
| `type-body-xs` | Micro text, metadata |
| `type-label-lg` | Section label / eyebrow |
| `type-label-md` | Badge label |
| `type-stat-xl`, `type-stat` | Stat numbers |
| `type-quote` | Testimonial / pull quote |

Pair every type utility with the correct color token:
- Headings → `text-type-heading`
- Body copy → `text-type-body`
- Supporting text → `text-type-secondary`
- Captions / metadata → `text-type-tertiary`

### RichText className Overrides

Every `<RichText>` call must have a `className` that maps headings and paragraphs to the block's typographic context. Never rely on default prose styles.

```tsx
// Section intro
className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"

// Feature card body
className="[&_h3]:type-title-md [&_h3]:text-type-heading [&_p]:type-body-sm [&_p]:text-type-secondary"

// CTA richText
className="[&_h3]:type-headline-3 [&_h3]:text-type-heading [&_p]:type-body-lg [&_p]:text-type-secondary"

// Stats (number + label)
className="[&_h3]:type-stat-xl [&_h3]:leading-none [&_h4]:type-label-lg [&_p]:type-body-sm"

// Testimonial
className="[&_p]:type-quote [&_p]:text-type-secondary"
```

Also ensure `enableGutter={false}` on all block-level RichText.

### Layout

**Container:** `mx-auto max-w-7xl px-6 md:px-8` — never use Tailwind's `container` class or custom max-widths.

**Block padding:** `py-16 md:py-24` on the outermost `<section>`. No `my-*` or `mb-*` on the outermost element — `RenderBlocks` already adds `my-16`.

```tsx
// ✅ Correct
<section className="py-16 md:py-24">

// ❌ Wrong
<section className="my-24 py-16">
```

**Internal spacing:**
| Context | Class |
|---|---|
| Between intro and body | `mt-8 md:mt-12` |
| Vertical stack of sections | `space-y-8 md:space-y-12` |
| 2-col split gap | `gap-16 md:gap-32` |
| Card grid gap | `gap-4 md:gap-6` |

### Cards

All card surfaces: `bg-muted px-6 py-8 rounded-none`
- Radius is always `rounded-none` — project design language uses sharp corners
- Border optional: `border border-border`
- Never use `rounded-lg`, `rounded-xl`, `rounded-2xl`, etc.

### Images

**Fluid fill:** `<div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">`
**Card image:** `<div className="relative aspect-video overflow-hidden rounded-none">`
Always use `<Media resource={x} fill className="object-cover" />` — never `<img>`.

**Dark/light variants:**
```tsx
{imageLight && <Media resource={imageLight} className="dark:hidden" />}
{imageDark && <Media resource={imageDark} className="hidden dark:block" />}
```

### Animations

```tsx
// ✅ Correct entry animation
const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-100px' })

<motion.div ref={ref}
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
/>
```

Rules:
- `once: true` — never re-animate on scroll up
- Easing must be `[0.16, 1, 0.3, 1]`
- Stagger delay: `Math.min(index * 0.1, 0.5)` — cap at 500ms
- Parallax only via `useScroll` — never CSS transform via JS scroll events
- `'use client'` required on any file importing from `motion/react`

### CTAs

- CMS-sourced links → `<CMSLink appearance="..." size="..." {...link} />`
- UI-only buttons → `<Button variant="..." size="...">`
- Never use `<a>` or `<Link>` directly for CMS content
- CTA fields always via `linkGroup()` helper — never manual link field construction

### Field Naming (config.ts)

| Purpose | Canonical name |
|---|---|
| Section intro richText | `intro` |
| Items array | `items` |
| Layout/style selector | `variant` |
| Light-mode image | `imageLight` |
| Dark-mode image | `imageDark` |
| Foreground layered image | `imageForeground` |
| Icon picker | `icon` |
| Single CTA link | `link` |
| Multiple CTA links | `links` |
| Section theme | `theme` |
| Eyebrow badge | `badge` |

---

## Process

### Phase 1 — Audit (do not change any code yet)

1. Read every file in `src/blocks/$ARGUMENTS/` — config.ts, Component.tsx, all variant index.tsx files
2. Check against every rule above
3. Output a violations report in this exact format:

```
### Violations: src/blocks/<BlockName>

**Colors**
- Component.tsx:42 — `bg-slate-900` → use `data-section-theme="dark"` or `bg-background`
- Grid/index.tsx:18 — `text-gray-500` → `text-type-secondary`

**Typography**
- Grid/index.tsx:31 — `text-2xl font-semibold` on h2 → `type-headline-2 text-type-heading`
- Grid/index.tsx:44 — `text-sm` on p → `type-body-sm text-type-secondary`

**Layout**
- Grid/index.tsx:12 — `my-24` on outermost section → remove, use `py-16 md:py-24` only
- Grid/index.tsx:15 — `container mx-auto` → `mx-auto max-w-7xl px-6 md:px-8`

**RichText**
- Grid/index.tsx:28 — `<RichText data={intro} />` missing className overrides

**Cards**
- Grid/index.tsx:55 — `rounded-lg` → `rounded-none`
- Grid/index.tsx:55 — `bg-gray-100 p-4` → `bg-muted px-6 py-8 rounded-none`

**Animations**
- Grid/index.tsx:71 — `once` missing on useInView → `{ once: true, margin: '-100px' }`
- Grid/index.tsx:78 — easing `ease-in-out` → `[0.16, 1, 0.3, 1]`

**Field naming**
- config.ts:14 — field named `title` → should be `intro` (richText)
- config.ts:22 — field named `cards` → should be `items`

Total: N violations
```

4. **Stop here.** Wait for confirmation before making any changes.

### Phase 2 — Fix (after confirmation)

Fix all violations in-place. Style and naming corrections only — do not change logic, component structure, or functionality.

After fixing, output a summary:
```
Fixed N violations across X files:
- Component.tsx: N fixes
- Grid/index.tsx: N fixes
- config.ts: N fixes
```

If field names in config.ts were changed, remind the user:
> Field renames in config.ts are breaking changes. Run `pnpm payload migrate:create --name rename-<old>-to-<new>` and write a data migration before deploying.
