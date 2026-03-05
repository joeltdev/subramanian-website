# Product Detail Page — Design

**Date:** 2026-03-05
**Supersedes:** `2026-03-03-product-pages-migration-design.md` and `2026-03-03-product-pages-implementation.md`

---

## Problem

The previous plan created three Payload blocks registered on `Pages`, leaving the actual product route (`products/[slug]/page.tsx`) broken (still queries `posts`). You would have needed to create 140 separate Pages in the CMS — one per product — each with blocks manually configured. That's wrong.

---

## Decision

Products follow the same pattern as posts: a single `products/[slug]/page.tsx` template renders any product dynamically by slug. All 140 products are served by one template. No per-product Pages are created.

---

## Architecture: Hybrid Template

The template is the primary entry point. An optional `layout` blocks field on the Products collection lets editors add marketing content below the fixed template sections for featured products.

```
URL: /products/rfsai-61bpf-sl
  → products/[slug]/page.tsx          Server Component
      → queryProductBySlug()          Payload DB fetch, depth: 2
      → <ProductHero product={...} /> Fixed section — always rendered
      → <ProductTabs product={...} /> Fixed section — always rendered
      → <RenderBlocks blocks={...} /> Optional editorial blocks (if product.layout set)
```

### generateStaticParams

Pre-builds all product pages at build time by fetching slugs from the `products` collection (not `posts` — the current file has a bug here).

---

## Component Structure

All product UI lives in `src/components/Product/`. Blocks are thin wrappers.

```
src/components/Product/
  ProductHero.tsx          Server Component
                           - name, subtitle, category breadcrumb
                           - price + currency (formatted with Intl.NumberFormat)
                           - buyLink CTA button
                           - tag badges (Best Seller, New, etc.) derived from product.tags
                           - <ProductCarousel> as client island

  ProductCarousel.tsx      'use client'
                           - thumbnail switcher with next/image (priority on first image)
                           - prev/next arrows, dot indicators
                           - video + 3D model buttons (window.open to external URL)
                           - NO favorites — out of scope until auth/wishlist exists

  ProductTabs.tsx          'use client'
                           - Tab 1: Description — <RichText data={product.description} />
                           - Tab 2: Technical Parameters — <RichText data={product.technicalParameters} />
                           - Tab 3: Downloads — dataSheet, instructionManual, ecDeclaration[], threeDModel
                           - Tab 4: Video — only rendered if product.productVideo is set
                           - Tabs with no content are hidden

  ProductInfoAccordion.tsx Server Component
                           - EAN + productCode labeling
                           - instructionManual download link (field: product.instructionManual)
                           - dataSheet download link
                           - ecDeclaration[] links
                           Note: prop named instructionManual to match collection field exactly
```

### Blocks (thin wrappers only)

```
src/blocks/ProductHero/
  config.ts                product relationship + helpline, supportEmail, knowledgeBaseUrl
  Component.tsx            checks typeof props.product — uses populated object directly,
                           only fetches if bare ID; passes product to <ProductHero>

src/blocks/ProductListing/
  config.ts                title, description, category filter, productsPerPage, showPagination
  Component.tsx            Server Component — initial fetch (page 1)
  ProductListingClient.tsx 'use client' — URL searchParams pagination (not useState),
                           calls Payload REST API for page changes;
                           uses data.totalPages from response (not recalculated)
  ProductCard/index.tsx    Server Component — image, name, subtitle, price, category badge, tags
                           Uses next/image; category color via CSS opacity not hex alpha hack
```

**`ProductDescriptionBlock` is removed.** The editorial richtext use case is covered by the existing `ContentBlock`.

---

## Collections Change

Add optional `layout` blocks field to the `Products` collection (same pattern as `Pages`). Available blocks: existing marketing blocks only. `ProductHeroBlock` is excluded (circular — you're already on a product page).

```ts
// src/collections/Products/index.ts — add to fields array
{
  name: 'layout',
  type: 'blocks',
  blocks: [
    CallToAction, Content, MediaBlock, LogoCloud,
    FeatureCards, FeatureShowcase, ContentSection,
    Stats, Testimonials, ArticleGrid, YouTube, Gallery,
    ProductListing,  // "related products" use case
  ],
}
```

A separate `RenderProductBlocks` component handles this (typed to `Product['layout']` instead of `Page['layout']`).

---

## Key Corrections vs Previous Plan

| Issue | Old plan | This design |
|---|---|---|
| Product route | Deferred as "future work" | First deliverable |
| Data source | Blocks on Pages | Template queries Products collection |
| ProductHeroBlock fetch | Double-fetches product | Uses populated relationship; fetches only if bare ID |
| Price + buyLink | Missing from hero | Rendered in ProductHero |
| Description | Separate block | Tab 1 in ProductTabs |
| Carousel images | Raw `<img>` + `loading="lazy"` | `next/image` with `priority` on first image |
| Pagination | `useState` + no URL state | URL searchParams |
| totalPages calc | `Math.ceil(totalDocs / perPage)` | `data.totalPages` from Payload response |
| Favorites | localStorage in carousel | Removed — out of scope |
| ProductDescriptionBlock | Block with own richtext | Removed; use ContentBlock instead |
| instructionManual naming | `installationManual` (wrong) | `instructionManual` (matches collection) |
| Category color | `color + '15'` hex alpha hack | CSS opacity |

---

## Data Flow

```
1. Request: GET /products/rfsai-61bpf-sl
2. generateStaticParams: pre-built at build time from products collection
3. queryProductBySlug: payload.find({ collection: 'products', depth: 2, where: { slug } })
   - depth 2: populates productGallery.image (Media), category (ProductCategory), tags (ProductTag)
4. ProductHero: renders with product data — no additional fetch
5. ProductCarousel: receives serialized images (plain objects) — clean server→client boundary
6. ProductTabs: receives product richtext fields + download URLs
7. If product.layout exists: RenderProductBlocks renders editorial blocks below
```

---

## Error Handling

- Product not found → `<PayloadRedirects url={url} />` handles 404
- Empty gallery → placeholder div (no broken image)
- Tab with no content → tab button hidden via conditional render
- No price → price section hidden
- No buyLink → CTA button hidden

---

## SSR / Client Boundary Summary

| Component | Rendering |
|---|---|
| `products/[slug]/page.tsx` | Server only — fetches data, no JS shipped |
| `ProductHero.tsx` | Server Component — static HTML |
| `ProductCarousel.tsx` | `'use client'` — SSR'd + hydrated for interactivity |
| `ProductTabs.tsx` | `'use client'` — SSR'd + hydrated for tab state |
| `ProductInfoAccordion.tsx` | Server Component — shadcn Accordion accepts server children |
| `RenderProductBlocks` | Server Component wrapping server/client blocks |

---

## Implementation Order

1. Fix `products/[slug]/page.tsx` — query Products, wire `generateStaticParams`
2. Create `src/components/Product/ProductCarousel.tsx`
3. Create `src/components/Product/ProductHero.tsx`
4. Create `src/components/Product/ProductInfoAccordion.tsx`
5. Create `src/components/Product/ProductTabs.tsx`
6. Add `layout` field to Products collection; create `RenderProductBlocks`
7. Refactor `ProductHeroBlock/Component.tsx` as thin wrapper around `ProductHero`
8. Create `ProductListing` block (ProductCard, ProductListingClient, Component)
9. Register `ProductListing` in `RenderProductBlocks` + `Pages/index.ts`
10. `pnpm generate:types` + TypeScript check + smoke test
