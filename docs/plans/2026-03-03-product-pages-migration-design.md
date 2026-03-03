# Product Pages Migration Design
**Date:** 2026-03-03
**Context:** Migrating Product Listing and Product Detail pages from Nuxt + Pruvious to Payload CMS 3.x + Next.js 15

---

## Overview

Migrate three legacy Vue/Pruvious blocks to three new Payload CMS blocks using React Server Components. The new blocks follow the existing `src/blocks/[Name]/config.ts` + `Component.tsx` pattern in this codebase.

**Source files analyzed:**
- `components/ProductCarousel.vue` — custom slider, favorites, video/3D buttons
- `components/ProductHeader.vue` — title/badges, description with read-more, accordions
- `components/ProductHero.vue` — two-column layout (carousel + header)
- `blocks/Products/ProductDescriptionSection.vue` — centered rich text section with CTA
- `blocks/Products/ProductListingSection.vue` — product grid with category filter, pagination

---

## Architecture Decision

**Three separate blocks (Approach A)** — one block per use case.
Rejected: multi-variant single block (schemas too different), extending ContentSection (pollutes unrelated block).

---

## File Structure

```
src/blocks/
├── ProductHero/
│   ├── config.ts
│   ├── Component.tsx                   # async RSC — fetches product, renders 2-col layout
│   ├── ProductCarousel/
│   │   └── index.tsx                   # 'use client' — slider + favorites (localStorage)
│   ├── ProductInfoAccordion/
│   │   └── index.tsx                   # RSC — Product Labeling / Manual / Datasheet / EC
│   └── SupportAccordion/
│       └── index.tsx                   # RSC — Helpline / Technical Support
├── ProductListing/
│   ├── config.ts
│   ├── Component.tsx                   # async RSC — server-fetches products
│   └── ProductCard/
│       └── index.tsx                   # Card with hover effects, badge, tags
└── ProductDescription/
    ├── config.ts
    └── Component.tsx                   # RSC — centered prose + optional CTA
```

---

## Block Schemas

### ProductHeroBlock (`slug: 'productHero'`)

| Field | Type | Notes |
|---|---|---|
| `product` | relationship → `products` | required; depth 2 (populates gallery images + category) |
| `helpline` | text | support phone number (on block, not product) |
| `technicalSupportEmail` | text | support email |
| `knowledgeBaseUrl` | text | link to knowledge base |

**Reasoning:** Support contact fields belong on the block (site-wide values, same across products) not the Product document.

### ProductListingBlock (`slug: 'productListing'`)

| Field | Type | Default | Notes |
|---|---|---|---|
| `title` | text | — | optional section heading |
| `description` | text | — | optional section subheading |
| `category` | relationship → `product-categories` | — | optional; exact category only (no descendant expansion) |
| `productsPerPage` | number | 9 | min 1, max 24 |
| `showPagination` | checkbox | true | |

### ProductDescriptionBlock (`slug: 'productDescription'`)

| Field | Type | Default | Notes |
|---|---|---|---|
| `title` | text | — | optional `h2` |
| `subtitle` | text | — | optional `p` |
| `content` | richText (lexical) | — | required; rendered with `<RichText>` |
| `showCta` | checkbox | false | |
| `ctaText` | text | `'Contact Us'` | |
| `ctaLink` | text | — | URL for CTA button |

---

## Component Design

### ProductHeroBlock/Component.tsx (async RSC)

1. Receives `product` relationship populated at depth 2
2. Derives badge flags from `product.tags`:
   - `isBestSeller` = `tags.some(t => t.label?.toLowerCase() === 'best seller')`
   - `isNew` = `tags.some(t => t.label?.toLowerCase() === 'new')`
   - `isFeatured` = `tags.some(t => t.label?.toLowerCase() === 'featured')`
3. Serializes gallery images: `productGallery.map(g => ({ src: (g.image as Media).url, alt: g.alt || product.name }))`
4. Layout: `<section className="relative py-4">` → `max-w-7xl` container → `flex flex-col lg:flex-row gap-12`
5. Left column (`lg:sticky lg:top-24 lg:w-1/2`): `<ProductCarousel>` client component
6. Right column (`lg:w-1/2`): `h1` title, badges, `<ProductInfoAccordion>`, `<SupportAccordion>`

### ProductCarousel/index.tsx ('use client')

- `useState(currentIndex: number)` — current slide
- `useState(isFavorite: boolean)` — initialized from `localStorage['product-favorites']` (JSON array of product IDs)
- `useEffect` — persists favorites on change
- Exact visual classes from Vue:
  - Container: `relative h-80 overflow-hidden rounded-lg md:h-[420px] lg:h-[480px]`
  - Slider: `flex h-full transition-transform duration-300 ease-in-out` + `style={{ transform: translateX(-${currentIndex * 100}%) }}`
  - Arrow buttons: `absolute left-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center bg-transparent shadow-none transition-all duration-200 hover:scale-110`
  - Dots: `h-2 w-2 rounded-full transition-all duration-200` + `bg-blue-500` active / `bg-gray-300 hover:bg-gray-400` inactive
  - Best Seller badge: `absolute left-4 top-4 z-10` → `rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white`
  - Favorite button: `rounded-full p-2 transition-colors hover:bg-gray-100`, heart SVG fills `text-red-500` when active
  - Video/3D buttons: `flex flex-col items-center space-y-0` with circle icon + label text

### ProductInfoAccordion/index.tsx (RSC)

- Uses shadcn `<Accordion type="single" collapsible defaultValue="item-0">`
- Four items (all shown even if data missing — shows "not available" fallback text):
  1. **Product Labeling** — EAN code + product code
  2. **Installation Manual** — link if `instructionManual` is set
  3. **Datasheet** — link if `dataSheet` is set
  4. **EC Declaration** — array of links if `ecDeclaration` has items
- Link style: `flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700` with chevron SVG

### SupportAccordion/index.tsx (RSC)

- Uses shadcn `<Accordion type="single" collapsible>` (no default open)
- Two items:
  1. **Helpline** — phone icon + number + "Available 24/7" note
  2. **Technical Support** — email link + knowledge base link

### ProductListingBlock/Component.tsx (async RSC + client pagination)

**Server component** (`Component.tsx`):
1. `getPayload({ config: configPromise })`
2. Fetches products with `where: { category: { equals: categoryId } }` if category is set
3. Passes paginated result to `<ProductGrid>` client component

**Client component** (`ProductGrid`):
- `useState(currentPage: number)`
- Re-fetches on page change via...

> **Implementation note:** Since `getPayload` is server-only, pagination requires either:
> - URL search params (searchParams prop on the RSC, full navigation), OR
> - A `/api/products` route handler that the client component calls via `fetch`
>
> **Decision:** Use URL search params for SEO-friendliness. The block's RSC reads `searchParams?.page`. Each block instance uses a unique `blockId` to namespace: `?page_{blockId}=2`.

### ProductCard/index.tsx (RSC)

- Wrapper: `group w-full max-w-xs overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-[200ms] hover:-translate-y-1 hover:border-accent/20 hover:shadow-xl sm:w-80 md:w-72 lg:w-80`
- Image area: `aspect-square overflow-hidden` with `<Media>` + `group-hover:scale-110` + shine sweep `bg-gradient-to-r from-transparent via-accent/20 to-transparent`
- Category badge: inline style with `backgroundColor: color + '15'` and `color: color` (from `ProductCategory.color`)
- Product name `h3`: `line-clamp-2 text-sm font-semibold`, `group-hover:text-accent`
- Tags: max 2 shown + overflow count
- Price: `Intl.NumberFormat` formatted, hidden if 0/null

### ProductDescriptionBlock/Component.tsx (RSC)

```
<section className="py-16">
  <div className="mx-auto max-w-4xl">
    <h2 className="mb-4 text-3xl font-bold text-gray-900">{title}</h2>
    <p className="text-lg text-gray-600">{subtitle}</p>
    <div className="prose prose-lg max-w-none px-4 lg:px-0">
      <RichText data={content} enableGutter={false} />
    </div>
    {showCta && (
      <Link href={ctaLink} className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700">
        {ctaText}
      </Link>
    )}
  </div>
</section>
```

---

## Registration

**`src/collections/Pages/index.ts`** — add to `layout` blocks array:
```ts
import { ProductHero } from '../../blocks/ProductHero/config'
import { ProductListing } from '../../blocks/ProductListing/config'
import { ProductDescription } from '../../blocks/ProductDescription/config'
// ... add to blocks: [...existing, ProductHero, ProductListing, ProductDescription]
```

**`src/blocks/RenderBlocks.tsx`** — add to `blockComponents`:
```ts
import { ProductHeroBlock } from '@/blocks/ProductHero/Component'
import { ProductListingBlock } from '@/blocks/ProductListing/Component'
import { ProductDescriptionBlock } from '@/blocks/ProductDescription/Component'
// ...
productHero: ProductHeroBlock,
productListing: ProductListingBlock,
productDescription: ProductDescriptionBlock,
```

---

## Key Differences from Legacy Vue

| Legacy (Pruvious/Vue) | New (Payload/Next.js) |
|---|---|
| `v-html="description"` (raw HTML) | `<RichText data={description}>` (Lexical AST) |
| `PruviousPicture` component | `<Media resource={image}>` component |
| `NuxtLink :to="url"` | `<Link href={url}>` (next/link) |
| `useFetch('/api/products')` (Nuxt) | `getPayload()` server-side (RSC) |
| `isBestSeller`, `isNew`, `isFeatured` props (boolean) | Derived from `product.tags[].label` |
| Support fields on Product object | Support fields on ProductHeroBlock config |
| `<Accordion>` / `<AccordionV2>` (custom Vue) | shadcn `<Accordion>` (already in project) |
| Auto-play carousel | Omitted (not needed for product pages) |

---

## Accordion Dependency Note

The shadcn `Accordion` component should already be available via `components.json`. Verify with:
```bash
ls src/components/ui/accordion.tsx
```
If missing, install with: `pnpm dlx shadcn@latest add accordion`

---

## Out of Scope

- Adding product detail pages via Products collection routing (deferred — using PageBlocks instead)
- Filtering by descendant categories (exact category match only)
- Favorites backend persistence (localStorage only)
- Auto-play carousel
