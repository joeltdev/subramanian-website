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
