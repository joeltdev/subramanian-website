# Block Styleguide Design

**Date:** 2026-03-03
**Status:** Approved
**Author:** Brainstorming session

---

## Problem

No single source of truth exists for how new Payload CMS blocks should be designed, coded, and shipped in this project. Without it, new blocks (human- or AI-authored) diverge in field naming, typography choices, spacing, admin UI structure, and migration handling.

## Goal

Produce two files:

1. **`docs/BLOCK_STYLEGUIDE.md`** — Full master reference. Rule-book format: WHY → RULE → EXAMPLE per topic. ~600–800 lines. Audience: developers and AI agents authoring new blocks.
2. **`docs/BLOCK_REFERENCE.md`** — Cheat sheet ~100 lines. Rules only, no prose. Suitable for pasting verbatim as AI context/system prompt when generating a new block.

---

## Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Primary audience | Both humans and AI agents | Styleguide doubles as AI context injection |
| Document structure | Two-file hybrid | Master for depth, cheat sheet for quick AI prompt |
| Content format | Rule-book (WHY → RULE → EXAMPLE) | Best for scannable human lookup + parseable AI rules |
| Reference block | FeatureShowcase | Most complete block — has config, variants, images, richText, icons, animations |
| Migrations scope | Payload CMS DB migrations only | When to run, additive-only rules, what breaks |

---

## Document Structure

### `docs/BLOCK_STYLEGUIDE.md`

#### 1. Design Tokens
- **Colors:** Semantic CSS vars (`--primary`, `--muted`, etc.) vs raw palette (`brand-*`, `neutral-*`). Rule: always use semantic vars in components, never raw palette directly.
- **Section themes:** `data-section-theme="dark|brand|light"` and when to apply.
- **Dark mode:** `data-theme="dark"` on `<html>`. Use `dark:` prefix, never hardcode dark colors.

#### 2. Typography
- Full type scale table: Display → Label-SM with size, weight, line-height, tracking
- Type color semantics: `text-type-heading`, `text-type-body`, `text-type-secondary`, `text-type-tertiary`
- **RichText className override pattern** — how to use `[&_h2]:type-headline-1` etc.
- **Context rules:** which heading size at which semantic level (section intro h2 = headline-1 or headline-2, feature card h3 = title-md or headline-3, etc.)

#### 3. Spacing & Layout
- Container: `mx-auto max-w-7xl px-6 md:px-8`
- Block vertical rhythm: `my-16` wrapper in RenderBlocks
- Internal section spacing: `space-y-8 md:space-y-12`, `gap-4` (cards), `gap-8 md:gap-12` (feature sections)
- Card padding: `px-6 py-8`
- No border radius on cards: `rounded-none` (project design token)

#### 4. Block Architecture
- File structure per block:
  ```
  src/blocks/BlockName/
    config.ts          # Payload field definitions
    Component.tsx      # Variant router (or direct component if no variants)
    VariantA/
      index.tsx        # Actual implementation
    VariantB/
      index.tsx
  ```
- Config conventions: `slug` matches key in RenderBlocks, `interfaceName` = PascalCase + `Block`
- Component.tsx pattern: `const variants = { a: VariantA, b: VariantB }` then `const Variant = variants[props.variant] ?? VariantA`
- Always add `'use client'` when using motion, hooks, or browser APIs
- Register in `RenderBlocks.tsx` and `src/collections/Pages/index.ts`

#### 5. Field Standards

**Admin UI Structure:**
- Flat field list for simple blocks (≤5 fields)
- Collapsible `{ type: 'collapsible', label: 'Images' }` to group optional media fields
- Tabs for complex blocks with 2+ distinct concerns (content / media / settings)
- Always include `label` and `description` on fields for editor UX

**Naming Conventions:**
| Field purpose | Field name |
|---|---|
| Section intro (richText) | `intro` |
| Array of feature/card items | `items` |
| Primary image | `image` |
| Light-mode background image | `imageLight` |
| Dark-mode background image | `imageDark` |
| Foreground layered image | `imageForeground` |
| Layout/style selector | `variant` |
| Icon picker | `icon` |
| Link or links | `link` / `links` |

**RichText Defaults by Context:**

| Context | Heading sizes | Toolbar |
|---|---|---|
| Section intro (h2-level) | `h2`, `h3` | Fixed + Inline |
| Feature card body | `h3`, `h4` | Inline only |
| CTA / short richText | `h3` only or none | Inline only |
| Stats / numbers | `h3`, `h4` (used for number + label) | Inline only |

**Field rules:**
- `variant` select: always has a `defaultValue`
- `intro` richText: always optional (blocks should work without it)
- `items` arrays: always set `minRows` and `maxRows`
- Upload fields: always `relationTo: 'media'`
- Never use `required: true` on image fields (editors need drafts without images)

#### 6. CTA & Links

Button variant → use case mapping:
| Variant | Use case |
|---|---|
| `default` | Primary action (solid azure) |
| `outline` | Secondary action |
| `ghost` | Tertiary / nav-level |
| `link` | Inline text link in prose |
| `secondary` | Card-surface soft action |
| `destructive` | Destructive confirm |

Sizes: `lg` for block-level CTAs, `default` for inline, `sm` for cards/tight contexts.

`CMSLink` vs `Button`: Use `CMSLink` whenever the link source comes from CMS fields (handles internal reference vs external URL). Use `Button` for purely UI-driven actions.

linkGroup field: use `linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } })` as the standard CTA field group.

#### 7. Responsiveness
- Mobile-first: write base styles for mobile, `md:` for desktop
- Primary responsive boundary: `md:` (768px/48rem)
- Grid patterns:
  - Feature items: `grid-cols-2 md:grid-cols-4`
  - Content split: `md:grid md:grid-cols-2 md:gap-32`
  - Card grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Images: use `fill` prop with a positioned parent for responsive media, fixed aspect ratio for cards
- Typography: type scale is already fluid via CSS clamp — do not add manual `text-sm md:text-lg` overrides
- Prose: `prose md:prose-md` for richText containers

#### 8. Animations
- Library: `motion/react` (Framer Motion)
- Entry animations: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Trigger: `useInView` with `{ margin: '-100px' }` offset, `once: true`
- Stagger: `transition={{ delay: index * 0.1 }}` for item arrays (cap at 6 items × 0.1)
- Easing: `[0.16, 1, 0.3, 1]` custom cubic bezier for natural feel
- Parallax: background Y `0 → 30px`, foreground counter-parallax Y `0 → -50px`
- Rule: `'use client'` required on any component using motion
- Rule: always wrap parallax in `useScroll` + `useTransform`, never CSS-only scroll tricks

#### 9. Payload Migrations
- Run `pnpm payload migrate:create --name descriptive-name` after ANY field change
- Run `pnpm payload migrate` to apply locally before testing
- **Additive-only rule:** Adding fields = safe. Renaming, removing, or changing field type = breaking.
- Rename pattern: add new field → migrate data via custom script → mark old field `admin: { hidden: true }` → remove old field in a subsequent migration
- Never change a field's `type` directly — create a new field, migrate, remove old
- Migration files live in `src/migrations/` — commit them with the feature branch
- After merging: always run migrations on staging before production

#### 10. New Block Checklist
```
[ ] Choose slug (camelCase, matches blockType key in RenderBlocks)
[ ] Create src/blocks/BlockName/config.ts
    [ ] slug, interfaceName, labels
    [ ] Fields follow naming conventions
    [ ] variant has defaultValue
    [ ] RichText headings and toolbar configured per context
    [ ] Upload fields use relationTo: 'media'
    [ ] linkGroup for CTAs
[ ] Create src/blocks/BlockName/Component.tsx (variant router or direct)
[ ] Create src/blocks/BlockName/VariantName/index.tsx
    [ ] 'use client' if using motion/hooks
    [ ] mx-auto max-w-7xl container
    [ ] Mobile-first responsive grid
    [ ] Type classes from design system (type-headline-*, type-body-*, etc.)
    [ ] RichText with className overrides
    [ ] CMSLink for CMS-sourced links
[ ] Add to src/blocks/RenderBlocks.tsx
[ ] Add to src/collections/Pages/index.ts blocks array
[ ] Run pnpm payload migrate:create --name add-block-name-block
[ ] Run pnpm payload migrate
[ ] Test in CMS admin UI (create block, fill fields, preview)
[ ] Verify dark mode and both section themes
[ ] Verify mobile (375px) and desktop (1280px)
```

---

### `docs/BLOCK_REFERENCE.md`

Condensed version:
- Rules only, one line each, grouped by topic
- Key code snippets (file structure, config shape, component shape, RichText className pattern)
- Type scale table (compact)
- Button variant table
- Field naming table
- New block checklist (same as above, no prose)

---

## What's Out of Scope

- Specific block designs (this doc governs HOW to build, not WHAT to build)
- Full Payload CMS docs (already in `/docs/` from official Payload docs)
- CSS-in-JS or non-Tailwind patterns (project is Tailwind-only)
