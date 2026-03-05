# Styling Standards

## 1. Semantic Tokens

Always use semantic CSS variables. Never reference raw palette steps (e.g., `brand-500`) directly.

| Token | Use |
|---|---|
| `bg-background` | Page background |
| `bg-card` | Card surfaces |
| `bg-muted` | Subtle card / chip bg |
| `text-type-heading` | All headings |
| `text-type-body` | Body copy |
| `text-type-secondary` | Supporting text |
| `text-type-tertiary` | Captions, metadata |
| `bg-primary`, `text-primary` | Brand accent |
| `border-border` | Borders, dividers |

## 2. Type Scale (Fluid Utilities)

Never use raw `text-2xl` etc. Use project utilities:

| Utility | Use |
|---|---|
| `type-headline-1` | Section primary heading (h2) |
| `type-headline-2` | Major section heading |
| `type-headline-3` | Subsection heading (h3) |
| `type-headline-4` | Feature card heading |
| `type-title-md` | Card title |
| `type-body-xl` | Section intro paragraph |
| `type-body-md` | Standard body |
| `type-body-sm` | Supporting / caption |
| `type-label-lg` | Eyebrow / badge |
| `type-stat-xl` | Stat numbers |

## 3. RichText Overrides

Always pass a `className` to `<RichText>` that maps headings/paragraphs to the block's context.

```tsx
// Section intro
className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"

// Feature card
className="[&_h3]:type-title-md [&_h3]:text-type-heading [&_p]:type-body-sm [&_p]:text-type-secondary"

// Stats
className="[&_h3]:type-stat-xl [&_h3]:leading-none [&_h4]:type-label-lg [&_p]:type-body-sm"
```

## 4. Layout

- **Container:** `mx-auto max-w-7xl px-6 md:px-8`
- **Block Padding:** `py-16 md:py-24` on the outermost `<section>`. No `my-*`.
- **Cards:** `bg-muted px-6 py-8 rounded-none` (Always sharp corners)
- **Grid Gaps:** `gap-4 md:gap-6` (cards), `gap-16 md:gap-32` (2-col splits)

## 5. Animations

- Easing: `[0.16, 1, 0.3, 1]`
- Delay: `Math.min(index * 0.1, 0.5)`
- `once: true` on `useInView`
- `'use client'` on all files importing from `motion/react`
