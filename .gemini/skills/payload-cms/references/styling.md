# iNELS Content Studio Styling Reference

This reference documents the semantic styling system for iNELS Content Studio.

## 1. Semantic Tokens (Tailwind)

Always use semantic tokens over raw palette colors.

| Token | Light Value | Dark Value | Use |
|---|---|---|---|
| `bg-background` | neutral-0 | neutral-950 | Page background |
| `bg-card` | neutral-0 | neutral-900 | Card surfaces |
| `bg-muted` | neutral-100 | neutral-800 | Subtle card / chip bg |
| `text-type-heading` | neutral-950 | neutral-50 | All headings |
| `text-type-body` | neutral-800 | neutral-200 | Body copy |
| `text-type-secondary` | neutral-500 | neutral-400 | Supporting text |
| `border-border` | neutral-200 | neutral-700 | Borders, dividers |
| `bg-primary` | brand-500 | brand-400 | Primary CTA, icons |

## 2. Type Scale

Never use raw `text-size` classes. Use project utilities:

| Utility | Use |
|---|---|
| `type-headline-1` | Section primary heading (h2) |
| `type-headline-2` | Major section heading |
| `type-headline-3` | Subsection / feature heading (h3) |
| `type-title-md` | Card title |
| `type-body-xl` | Section intro paragraph |
| `type-body-md` | Standard body |

## 3. RichText className Overrides

Standard patterns for styling CMS content:

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
```

## 4. Section Themes

Apply `data-section-theme` on the block's outermost wrapper:

| Value | Background | Text |
|---|---|---|
| `light` | white | neutral-950 |
| `dark` | brand-950 | brand-50 |
| `brand` | brand-600 | brand-100/200 |

Example:
```tsx
<section data-section-theme="dark" className="py-24">
  {/* All text/bg tokens auto-invert */}
</section>
```
