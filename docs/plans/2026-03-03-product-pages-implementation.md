# Product Pages Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create three new Payload CMS blocks — `ProductHeroBlock`, `ProductListingBlock`, `ProductDescriptionBlock` — migrating the legacy Vue/Pruvious product page components to Next.js 15 React Server Components.

**Architecture:** Three separate blocks following the existing `src/blocks/[Name]/config.ts` + `Component.tsx` pattern. `ProductHeroBlock` has three sub-components (carousel client island, info accordion, support accordion). `ProductListingBlock` uses a server fetch + client pagination island pattern. `ProductDescriptionBlock` is a plain RSC. All three are registered in `Pages/index.ts` and `RenderBlocks.tsx`.

**Tech Stack:** Next.js 15 App Router, Payload CMS 3.x (`getPayload`, REST API at `/api/products`), TypeScript, Tailwind CSS v4, shadcn/ui `<Accordion>` (already installed at `src/components/ui/accordion.tsx`), `<Media>` from `@/components/Media`, `<RichText>` from `@/components/RichText`, `next/link`

**Design doc:** `docs/plans/2026-03-03-product-pages-migration-design.md`

---

## Task 1: Create `ProductDescriptionBlock` config

**Files:**
- Create: `src/blocks/ProductDescription/config.ts`

**Step 1: Create the config file**

```ts
// src/blocks/ProductDescription/config.ts
import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ProductDescription: Block = {
  slug: 'productDescription',
  interfaceName: 'ProductDescriptionBlock',
  labels: { singular: 'Product Description', plural: 'Product Descriptions' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
    },
    {
      name: 'showCta',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show Call to Action',
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Contact Us',
      admin: {
        condition: (_, siblingData) => siblingData?.showCta === true,
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA URL',
      admin: {
        condition: (_, siblingData) => siblingData?.showCta === true,
        description: 'Full URL or relative path for the CTA button',
      },
    },
  ],
}
```

**Step 2: Commit**

```bash
git add src/blocks/ProductDescription/config.ts
git commit -m "feat(blocks): add ProductDescription block config"
```

---

## Task 2: Create `ProductListingBlock` config

**Files:**
- Create: `src/blocks/ProductListing/config.ts`

**Step 1: Create the config file**

```ts
// src/blocks/ProductListing/config.ts
import type { Block } from 'payload'

export const ProductListing: Block = {
  slug: 'productListing',
  interfaceName: 'ProductListingBlock',
  labels: { singular: 'Product Listing', plural: 'Product Listings' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      admin: {
        description: 'Optional heading shown above the product grid',
      },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Section Description',
      admin: {
        description: 'Optional subheading shown below the title',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      label: 'Filter by Category',
      required: false,
      admin: {
        description: 'Show only products from this exact category (leave empty for all products)',
      },
    },
    {
      name: 'productsPerPage',
      type: 'number',
      defaultValue: 9,
      min: 1,
      max: 24,
      label: 'Products Per Page',
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Pagination',
    },
  ],
}
```

**Step 2: Commit**

```bash
git add src/blocks/ProductListing/config.ts
git commit -m "feat(blocks): add ProductListing block config"
```

---

## Task 3: Create `ProductHeroBlock` config

**Files:**
- Create: `src/blocks/ProductHero/config.ts`

**Step 1: Create the config file**

```ts
// src/blocks/ProductHero/config.ts
import type { Block } from 'payload'

export const ProductHero: Block = {
  slug: 'productHero',
  interfaceName: 'ProductHeroBlock',
  labels: { singular: 'Product Hero', plural: 'Product Heroes' },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
      admin: {
        description: 'The product to display in this hero section',
      },
    },
    {
      name: 'helpline',
      type: 'text',
      label: 'Support Helpline',
      admin: {
        description: 'Support phone number shown in the Support accordion',
      },
    },
    {
      name: 'technicalSupportEmail',
      type: 'text',
      label: 'Technical Support Email',
      admin: {
        description: 'Email address for technical support queries',
      },
    },
    {
      name: 'knowledgeBaseUrl',
      type: 'text',
      label: 'Knowledge Base URL',
      admin: {
        description: 'Link to the knowledge base or documentation portal',
      },
    },
  ],
}
```

**Step 2: Commit**

```bash
git add src/blocks/ProductHero/config.ts
git commit -m "feat(blocks): add ProductHero block config"
```

---

## Task 4: Regenerate Payload types

The three new block configs must be registered before generating types, but we need the types to write the components. We'll pre-register the configs in this step to get types generated, then implement components in subsequent tasks.

**Files:**
- Modify: `src/collections/Pages/index.ts`
- Modify: `src/blocks/RenderBlocks.tsx`

**Step 1: Add imports and register in `Pages/index.ts`**

Open `src/collections/Pages/index.ts`. Add three imports near the top (with the other block imports):

```ts
import { ProductHero } from '../../blocks/ProductHero/config'
import { ProductListing } from '../../blocks/ProductListing/config'
import { ProductDescription } from '../../blocks/ProductDescription/config'
```

Find the `blocks: [CallToAction, Content, ...]` array in the `layout` field. Append the three new blocks:

```ts
blocks: [
  CallToAction, Content, MediaBlock, Archive, FormBlock, LogoCloud,
  FeatureCards, FeatureShowcase, FeatureBento, Integrations, ContentSection,
  Stats, Testimonials, HoverHighlights, CaseStudiesHighlight, ArticleGrid,
  MediaCards, YouTube, Gallery,
  ProductHero, ProductListing, ProductDescription,  // ← add these
],
```

**Step 2: Add placeholder entries in `RenderBlocks.tsx`**

Open `src/blocks/RenderBlocks.tsx`. Add these temporary placeholder imports (we'll swap them for real components later):

```ts
// Temporary placeholder — will be replaced by real component files in later tasks
const ProductHeroBlock = () => null
const ProductListingBlock = () => null
const ProductDescriptionBlock = () => null
```

Add to `blockComponents`:

```ts
productHero: ProductHeroBlock,
productListing: ProductListingBlock,
productDescription: ProductDescriptionBlock,
```

**Step 3: Run `generate:types`**

```bash
pnpm generate:types
```

Expected: `payload-types.ts` now contains `ProductHeroBlock`, `ProductListingBlock`, `ProductDescriptionBlock` interfaces. Verify:

```bash
grep -n "ProductHeroBlock\|ProductListingBlock\|ProductDescriptionBlock" src/payload-types.ts
```

Expected output: 3 lines each with the interface name.

**Step 4: Commit**

```bash
git add src/collections/Pages/index.ts src/blocks/RenderBlocks.tsx src/payload-types.ts
git commit -m "feat(blocks): register product block configs and regenerate types"
```

---

## Task 5: Create `ProductDescriptionBlock` component

**Files:**
- Create: `src/blocks/ProductDescription/Component.tsx`

**Step 1: Create the component**

```tsx
// src/blocks/ProductDescription/Component.tsx
import React from 'react'
import type { ProductDescriptionBlock as ProductDescriptionBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import Link from 'next/link'

export const ProductDescriptionBlock: React.FC<
  ProductDescriptionBlockProps & { disableInnerContainer?: boolean }
> = ({ title, subtitle, content, showCta, ctaText, ctaLink }) => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && <h2 className="mb-4 text-3xl font-bold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}

        <div className="prose prose-lg max-w-none px-4 lg:px-0">
          <RichText data={content} enableGutter={false} />
        </div>

        {showCta && ctaLink && (
          <div className="mt-12 text-center">
            <Link
              href={ctaLink}
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              {ctaText || 'Contact Us'}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
```

**Step 2: Wire up the real component in `RenderBlocks.tsx`**

Replace the placeholder for `ProductDescriptionBlock`:

```ts
// Remove the placeholder line:
// const ProductDescriptionBlock = () => null

// Add the real import at the top of the file with other imports:
import { ProductDescriptionBlock } from '@/blocks/ProductDescription/Component'
```

**Step 3: Commit**

```bash
git add src/blocks/ProductDescription/Component.tsx src/blocks/RenderBlocks.tsx
git commit -m "feat(blocks): implement ProductDescription block component"
```

---

## Task 6: Create `ProductCard` sub-component for ProductListing

**Files:**
- Create: `src/blocks/ProductListing/ProductCard/index.tsx`

This component renders a single product card with image, category badge, name, price, tags, and hover effects. It is a pure RSC (no client state needed).

**Step 1: Create the component**

```tsx
// src/blocks/ProductListing/ProductCard/index.tsx
import React from 'react'
import Link from 'next/link'
import type { Product, ProductCategory, ProductTag, Media } from '@/payload-types'
import { MediaComponent } from '@/components/Media'

interface ProductCardProps {
  product: Product
}

function formatPrice(price: number, currency: string | null | undefined): string {
  if (!price || price <= 0) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR',
  }).format(price)
}

function getProductUrl(product: Product): string {
  return `/products/${product.slug}`
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const category =
    product.category && typeof product.category === 'object'
      ? (product.category as ProductCategory)
      : null

  const tags = (product.tags ?? [])
    .map((t) => (typeof t === 'object' ? (t as ProductTag) : null))
    .filter(Boolean) as ProductTag[]

  const firstImage =
    product.productGallery && product.productGallery.length > 0
      ? product.productGallery[0]
      : null

  const imageResource =
    firstImage?.image && typeof firstImage.image === 'object'
      ? (firstImage.image as Media)
      : null

  const href = getProductUrl(product)
  const priceStr = formatPrice(product.price ?? 0, product.currency)

  return (
    <div className="group w-full max-w-xs overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-[200ms] hover:-translate-y-1 hover:border-accent/20 hover:shadow-xl sm:w-80 md:w-72 lg:w-80">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Link href={href} className="relative block h-full">
          {imageResource ? (
            <MediaComponent
              resource={imageResource}
              imgClassName="h-full w-full object-cover transition-all duration-[200ms] group-hover:scale-110"
              size="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 80vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-3xl text-gray-400 transition-colors duration-[200ms] group-hover:text-accent">
                📦
              </span>
            </div>
          )}
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-[200ms] group-hover:bg-black/5" />
          {/* Shine sweep */}
          <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-accent/20 to-transparent transition-transform duration-[200ms] group-hover:translate-x-full" />
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        {category && (
          <div className="mb-2">
            <span
              className="inline-block rounded-full py-1 text-xs font-medium uppercase tracking-wide"
              style={{
                backgroundColor: (category.color ?? '#3B82F6') + '15',
                color: category.color ?? '#3B82F6',
                border: `1px solid ${category.color ?? '#3B82F6'}30`,
                padding: '2px 10px',
              }}
            >
              {category.name}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight text-gray-900 transition-colors group-hover:text-accent">
          <Link href={href} className="no-underline">
            {product.name}
          </Link>
        </h3>

        {/* Product Subtitle */}
        {product.subtitle && (
          <p className="mb-3 line-clamp-1 text-xs leading-relaxed text-gray-500">
            {product.subtitle}
          </p>
        )}

        {/* Price and Code */}
        <div className="mb-3 flex items-center justify-between">
          {priceStr && (
            <div className="text-base font-bold text-gray-900 transition-colors group-hover:text-accent">
              {priceStr}
            </div>
          )}
          {product.productCode && (
            <div className="rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-400">
              {product.productCode}
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 transition-colors duration-200 hover:bg-accent/10 hover:text-accent"
              >
                {tag.label}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

> **Note on `Media` import:** Check the actual export name in `@/components/Media`. If the named export is `Media` (not `MediaComponent`), adjust the import. Run `grep -n "^export" src/components/Media/index.tsx` to confirm.

**Step 2: Commit**

```bash
git add src/blocks/ProductListing/ProductCard/index.tsx
git commit -m "feat(blocks): add ProductCard sub-component for ProductListing"
```

---

## Task 7: Create `ProductListingBlock` component

**Files:**
- Create: `src/blocks/ProductListing/ProductListingClient.tsx`
- Create: `src/blocks/ProductListing/Component.tsx`

The pattern:
- `Component.tsx` (async RSC) — fetches page 1 server-side, passes data + config to client
- `ProductListingClient.tsx` ('use client') — handles pagination state, calls Payload REST API for page changes

**Step 1: Create the client pagination component**

```tsx
// src/blocks/ProductListing/ProductListingClient.tsx
'use client'
import React, { useState } from 'react'
import type { Product } from '@/payload-types'
import { ProductCard } from './ProductCard'

interface ProductListingClientProps {
  initialProducts: Product[]
  totalPages: number
  productsPerPage: number
  categoryId: number | null
  showPagination: boolean
  title?: string | null
  description?: string | null
}

export const ProductListingClient: React.FC<ProductListingClientProps> = ({
  initialProducts,
  totalPages,
  productsPerPage,
  categoryId,
  showPagination,
  title,
  description,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [localTotalPages, setLocalTotalPages] = useState(totalPages)

  const goToPage = async (page: number) => {
    if (page === currentPage) return
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        limit: String(productsPerPage),
        page: String(page),
        depth: '1',
      })
      if (categoryId) {
        params.set('where[category][equals]', String(categoryId))
      }
      const res = await fetch(`/api/products?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data.docs ?? [])
      setCurrentPage(page)
      setLocalTotalPages(Math.ceil((data.totalDocs ?? 0) / productsPerPage))
    } catch (err) {
      console.error('ProductListing pagination error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Visible page numbers: up to 5 centred around currentPage
  const visiblePages: number[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(localTotalPages, currentPage + 2)
  for (let i = start; i <= end; i++) visiblePages.push(i)

  return (
    <div className="flex flex-col items-center px-6 py-12 md:py-20">
      {/* Block header */}
      {(title || description) && (
        <div className="mb-12 w-full text-center">
          {title && (
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
          )}
          {description && products.length > 0 && (
            <p className="mx-auto max-w-3xl text-lg text-gray-600">{description}</p>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex w-full max-w-6xl flex-wrap justify-center gap-4 md:gap-6">
          {Array.from({ length: productsPerPage }).map((_, n) => (
            <div
              key={n}
              className="w-full max-w-xs animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:w-80 md:w-72 lg:w-80"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-1/4 rounded-full bg-gray-200" />
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products grid */}
      {!isLoading && products.length > 0 && (
        <div className="flex w-full max-w-6xl flex-wrap justify-center gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && products.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">📦</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">No Products Found</h3>
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      )}

      {/* Pagination */}
      {showPagination && localTotalPages > 1 && !isLoading && (
        <nav className="mt-12 flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                page === currentPage
                  ? 'bg-accent text-white'
                  : 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === localTotalPages}
            onClick={() => goToPage(Math.min(localTotalPages, currentPage + 1))}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  )
}
```

**Step 2: Create the server component**

```tsx
// src/blocks/ProductListing/Component.tsx
import React from 'react'
import type { ProductListingBlock as ProductListingBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProductListingClient } from './ProductListingClient'

export const ProductListingBlock: React.FC<
  ProductListingBlockProps & { disableInnerContainer?: boolean }
> = async (props) => {
  const { title, description, productsPerPage = 9, showPagination = true } = props

  const categoryId =
    props.category && typeof props.category === 'object'
      ? (props.category as { id: number }).id
      : typeof props.category === 'number'
        ? props.category
        : null

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit: productsPerPage,
    page: 1,
    depth: 1,
    ...(categoryId ? { where: { category: { equals: categoryId } } } : {}),
  })

  return (
    <ProductListingClient
      initialProducts={result.docs}
      totalPages={result.totalPages}
      productsPerPage={productsPerPage}
      categoryId={categoryId}
      showPagination={showPagination ?? true}
      title={title}
      description={description}
    />
  )
}
```

**Step 3: Wire up the real component in `RenderBlocks.tsx`**

Replace the placeholder for `ProductListingBlock`:

```ts
// Remove:
// const ProductListingBlock = () => null

// Add import:
import { ProductListingBlock } from '@/blocks/ProductListing/Component'
```

**Step 4: Commit**

```bash
git add src/blocks/ProductListing/ProductListingClient.tsx src/blocks/ProductListing/Component.tsx src/blocks/RenderBlocks.tsx
git commit -m "feat(blocks): implement ProductListing block with server fetch + client pagination"
```

---

## Task 8: Create `ProductCarousel` client component

The carousel is a `'use client'` island. It receives serialized image data (plain objects, no Payload Media — URLs only) from the parent RSC so the boundary is clean.

**Files:**
- Create: `src/blocks/ProductHero/ProductCarousel/index.tsx`

**Step 1: Create the carousel**

```tsx
// src/blocks/ProductHero/ProductCarousel/index.tsx
'use client'
import React, { useEffect, useState } from 'react'

interface CarouselImage {
  src: string
  alt: string
}

interface ProductCarouselProps {
  images: CarouselImage[]
  productId: number
  isBestSeller: boolean
  productVideo?: string | null
  threeDModel?: string | null
}

const FAVORITES_KEY = 'product-favorites'

function readFavorites(): number[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeFavorites(ids: number[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  images,
  productId,
  isBestSeller,
  productVideo,
  threeDModel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Initialize favorite from localStorage after hydration
  useEffect(() => {
    setIsFavorite(readFavorites().includes(productId))
  }, [productId])

  const toggleFavorite = () => {
    const favorites = readFavorites()
    const next = isFavorite
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId]
    writeFavorites(next)
    setIsFavorite(!isFavorite)
  }

  const previous = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const next = () => setCurrentIndex((i) => Math.min(images.length - 1, i + 1))
  const goTo = (i: number) => setCurrentIndex(i)

  return (
    <div className="product-carousel relative">
      {/* Favorite button */}
      <div className="mb-4 mt-8 flex justify-end px-10">
        <button
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={toggleFavorite}
          className="rounded-full p-2 transition-colors hover:bg-gray-100"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className={`h-6 w-6 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-600'}`}
          >
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>

      {/* Carousel container */}
      <div className="relative">
        {/* Best Seller badge */}
        {isBestSeller && (
          <div className="absolute left-4 top-4 z-10">
            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
              Best seller
            </span>
          </div>
        )}

        {/* Main image */}
        <div className="relative h-80 overflow-hidden rounded-lg md:h-[420px] lg:h-[480px]">
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="relative h-full w-full flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Previous arrow */}
        {images.length > 1 && (
          <button
            disabled={currentIndex === 0}
            onClick={previous}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-transparent shadow-none transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-gray-800">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
        )}

        {/* Next arrow */}
        {images.length > 1 && (
          <button
            disabled={currentIndex === images.length - 1}
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center bg-transparent shadow-none transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-gray-800">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to image ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  currentIndex === index ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="mt-2 text-center text-sm text-gray-600">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Video / 3D buttons */}
      {(productVideo || threeDModel) && (
        <div className="mb-8 mt-6 flex justify-between px-10">
          {productVideo ? (
            <button
              onClick={() => window.open(productVideo, '_blank', 'noopener,noreferrer')}
              aria-label="View product video"
              className="flex flex-col items-center space-y-0 transition-opacity hover:opacity-80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-transparent">
                <svg fill="currentColor" viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 text-gray-900">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Video</span>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {threeDModel ? (
            <button
              onClick={() => window.open(threeDModel, '_blank', 'noopener,noreferrer')}
              aria-label="View 3D model"
              className="flex flex-col items-center space-y-0 transition-opacity hover:opacity-80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-transparent">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-gray-900">
                  <path
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">3D</span>
            </button>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/blocks/ProductHero/ProductCarousel/index.tsx
git commit -m "feat(blocks): add ProductCarousel client component with favorites + slider"
```

---

## Task 9: Create `ProductInfoAccordion` sub-component

**Files:**
- Create: `src/blocks/ProductHero/ProductInfoAccordion/index.tsx`

The Accordion from shadcn is a client component, but we can import it in an RSC and pass server-rendered JSX as its children. No 'use client' directive needed here.

**Step 1: Create the component**

```tsx
// src/blocks/ProductHero/ProductInfoAccordion/index.tsx
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Product } from '@/payload-types'

interface ProductInfoAccordionProps {
  ean?: string | null
  productCode?: string | null
  installationManual?: string | null
  dataSheet?: string | null
  ecDeclaration?: Product['ecDeclaration']
}

const ExternalLinkIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

export const ProductInfoAccordion: React.FC<ProductInfoAccordionProps> = ({
  ean,
  productCode,
  installationManual,
  dataSheet,
  ecDeclaration,
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="labeling" className="w-full">
      {/* Product Labeling */}
      <AccordionItem value="labeling">
        <AccordionTrigger>Product Labeling</AccordionTrigger>
        <AccordionContent>
          <div className="text-gray-700">
            {ean || productCode ? (
              <div className="space-y-2">
                {ean && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">EAN:</span>
                    <span>{ean}</span>
                  </div>
                )}
                {productCode && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Code:</span>
                    <span>{productCode}</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-500">Product labeling information not available</span>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Installation Manual */}
      <AccordionItem value="manual">
        <AccordionTrigger>Installation Manual</AccordionTrigger>
        <AccordionContent>
          <div className="text-gray-700">
            {installationManual ? (
              <a
                href={installationManual}
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                <span>See Installation Manual</span>
                <ExternalLinkIcon />
              </a>
            ) : (
              <span className="text-gray-500">Installation manual not available</span>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Datasheet */}
      <AccordionItem value="datasheet">
        <AccordionTrigger>Datasheet</AccordionTrigger>
        <AccordionContent>
          <div className="text-gray-700">
            {dataSheet ? (
              <a
                href={dataSheet}
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                <span>See Data Sheet</span>
                <ExternalLinkIcon />
              </a>
            ) : (
              <span className="text-gray-500">Datasheet not available</span>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* EC Declaration */}
      <AccordionItem value="ec-declaration">
        <AccordionTrigger>EC Declaration</AccordionTrigger>
        <AccordionContent>
          <div className="text-gray-700">
            {ecDeclaration && ecDeclaration.length > 0 ? (
              <div className="space-y-3">
                {ecDeclaration.map((declaration, index) => (
                  <a
                    key={declaration.id ?? index}
                    href={declaration.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    <span>
                      EC Declaration{ecDeclaration.length > 1 ? ` ${index + 1}` : ''}
                    </span>
                    <ExternalLinkIcon />
                  </a>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">EC Declaration not available</span>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

**Step 2: Commit**

```bash
git add src/blocks/ProductHero/ProductInfoAccordion/index.tsx
git commit -m "feat(blocks): add ProductInfoAccordion sub-component"
```

---

## Task 10: Create `SupportAccordion` sub-component

**Files:**
- Create: `src/blocks/ProductHero/SupportAccordion/index.tsx`

**Step 1: Create the component**

```tsx
// src/blocks/ProductHero/SupportAccordion/index.tsx
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface SupportAccordionProps {
  helpline?: string | null
  technicalSupportEmail?: string | null
  knowledgeBaseUrl?: string | null
}

export const SupportAccordion: React.FC<SupportAccordionProps> = ({
  helpline,
  technicalSupportEmail,
  knowledgeBaseUrl,
}) => {
  // Don't render the section at all if no support data is provided
  if (!helpline && !technicalSupportEmail && !knowledgeBaseUrl) return null

  return (
    <Accordion type="single" collapsible className="w-full">
      {helpline && (
        <AccordionItem value="helpline">
          <AccordionTrigger>Helpline</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-gray-700">
              <p>Need immediate assistance? Call our helpline:</p>
              <div className="flex items-center gap-2">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-gray-600"
                >
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <span className="text-lg font-semibold">{helpline}</span>
              </div>
              <p className="text-sm text-gray-600">Available 24/7 for urgent support</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {(technicalSupportEmail || knowledgeBaseUrl) && (
        <AccordionItem value="technical-support">
          <AccordionTrigger>Technical Support</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-gray-700">
              <p>For technical questions and troubleshooting:</p>
              <div className="space-y-2">
                {technicalSupportEmail && (
                  <a
                    href={`mailto:${technicalSupportEmail}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                      <path
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    {technicalSupportEmail}
                  </a>
                )}
                {knowledgeBaseUrl && (
                  <a
                    href={knowledgeBaseUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                      <path
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Knowledge Base
                  </a>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}
```

**Step 2: Commit**

```bash
git add src/blocks/ProductHero/SupportAccordion/index.tsx
git commit -m "feat(blocks): add SupportAccordion sub-component"
```

---

## Task 11: Create `ProductHeroBlock` component

This is the main orchestrator RSC that fetches the product from Payload with `depth: 2`, derives badge flags from tags, serializes images for the client carousel, and renders the two-column layout.

**Files:**
- Create: `src/blocks/ProductHero/Component.tsx`

**Step 1: Create the component**

```tsx
// src/blocks/ProductHero/Component.tsx
import React from 'react'
import type { ProductHeroBlock as ProductHeroBlockProps, Product, ProductTag, Media } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProductCarousel } from './ProductCarousel'
import { ProductInfoAccordion } from './ProductInfoAccordion'
import { SupportAccordion } from './SupportAccordion'

// Badge tag labels (case-insensitive match)
const BADGE_LABELS = {
  bestSeller: 'best seller',
  isNew: 'new',
  isFeatured: 'featured',
}

export const ProductHeroBlock: React.FC<
  ProductHeroBlockProps & { disableInnerContainer?: boolean }
> = async (props) => {
  const { helpline, technicalSupportEmail, knowledgeBaseUrl } = props

  const productId =
    typeof props.product === 'object'
      ? (props.product as Product).id
      : (props.product as number)

  if (!productId) return null

  const payload = await getPayload({ config: configPromise })
  const product = await payload.findByID({
    collection: 'products',
    id: productId,
    depth: 2,
  })

  if (!product) return null

  // Derive badge flags from tags
  const tags = (product.tags ?? [])
    .map((t) => (typeof t === 'object' ? (t as ProductTag) : null))
    .filter(Boolean) as ProductTag[]

  const tagLabels = tags.map((t) => (t.label ?? '').toLowerCase())
  const isBestSeller = tagLabels.includes(BADGE_LABELS.bestSeller)
  const isNew = tagLabels.includes(BADGE_LABELS.isNew)
  const isFeatured = tagLabels.includes(BADGE_LABELS.isFeatured)

  // Serialize images for the client carousel (plain objects, no circular refs)
  const carouselImages = (product.productGallery ?? [])
    .map((item) => {
      if (!item.image || typeof item.image !== 'object') return null
      const media = item.image as Media
      if (!media.url) return null
      return {
        src: media.url,
        alt: item.alt ?? product.name ?? 'Product image',
      }
    })
    .filter(Boolean) as { src: string; alt: string }[]

  return (
    <section className="relative py-4">
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          {/* Left column — Carousel (sticky on desktop) */}
          <div className="relative order-1 lg:sticky lg:top-24 lg:w-1/2">
            <div className="absolute inset-y-0 left-[-100vw] right-0 bg-gray-100/50 lg:block hidden" />
            {carouselImages.length > 0 ? (
              <ProductCarousel
                images={carouselImages}
                productId={product.id}
                isBestSeller={isBestSeller}
                productVideo={product.productVideo}
                threeDModel={product.threeDModel}
              />
            ) : (
              <div className="flex h-80 items-center justify-center rounded-lg bg-gray-100 text-6xl text-gray-300 md:h-[420px]">
                📦
              </div>
            )}
          </div>

          {/* Right column — Product details */}
          <div className="order-2 lg:w-1/2">
            {/* Title + badges */}
            <div className="mb-6 space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="text-base text-gray-600 sm:text-lg lg:text-xl">
                  {product.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {isBestSeller && (
                  <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white sm:px-3">
                    Best seller
                  </span>
                )}
                {isNew && (
                  <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white sm:px-3">
                    New
                  </span>
                )}
                {isFeatured && (
                  <span className="rounded-full bg-purple-500 px-2 py-1 text-xs font-semibold text-white sm:px-3">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-0">
              <ProductInfoAccordion
                ean={product.ean}
                productCode={product.productCode}
                installationManual={product.instructionManual}
                dataSheet={product.dataSheet}
                ecDeclaration={product.ecDeclaration}
              />
              <div className="mt-0">
                <SupportAccordion
                  helpline={helpline}
                  technicalSupportEmail={technicalSupportEmail}
                  knowledgeBaseUrl={knowledgeBaseUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Wire up the real component in `RenderBlocks.tsx`**

Replace the placeholder for `ProductHeroBlock`:

```ts
// Remove:
// const ProductHeroBlock = () => null

// Add import:
import { ProductHeroBlock } from '@/blocks/ProductHero/Component'
```

**Step 3: Commit**

```bash
git add src/blocks/ProductHero/Component.tsx src/blocks/RenderBlocks.tsx
git commit -m "feat(blocks): implement ProductHero block — carousel, accordions, badge derivation"
```

---

## Task 12: Final registration cleanup + TypeScript check

Verify all three blocks are properly registered and the project compiles.

**Step 1: Confirm `RenderBlocks.tsx` has all three real imports**

Open `src/blocks/RenderBlocks.tsx` and ensure it has:

```ts
import { ProductHeroBlock } from '@/blocks/ProductHero/Component'
import { ProductListingBlock } from '@/blocks/ProductListing/Component'
import { ProductDescriptionBlock } from '@/blocks/ProductDescription/Component'
```

And in `blockComponents`:

```ts
productHero: ProductHeroBlock,
productListing: ProductListingBlock,
productDescription: ProductDescriptionBlock,
```

**Step 2: Verify `Pages/index.ts` has all three configs**

Ensure `ProductHero`, `ProductListing`, and `ProductDescription` are all in the `blocks` array.

**Step 3: Run TypeScript check**

```bash
pnpm tsc --noEmit 2>&1 | head -50
```

Expected: No errors. If errors appear, read them carefully and fix import paths or missing fields.

> **Common fix:** The `Media` component import. In this project the component may be exported as `Media` not `MediaComponent`. Check `src/components/Media/index.tsx` for the actual export name and update `ProductCard/index.tsx` if needed.

**Step 4: Run dev server**

```bash
pnpm dev
```

Navigate to the Payload admin at `http://localhost:3000/admin`. Create a test page, add each block, and verify the editor works without errors.

**Step 5: Commit if clean**

```bash
git add -p  # Review any remaining changes
git commit -m "feat(blocks): complete product pages migration — ProductHero, ProductListing, ProductDescription"
```

---

## Smoke Test Checklist

After running `pnpm dev`:

- [ ] Payload admin loads without errors
- [ ] Create page → Add Content tab → "ProductHeroBlock" appears in block picker
- [ ] Create page → Add Content tab → "ProductListingBlock" appears in block picker
- [ ] Create page → Add Content tab → "ProductDescriptionBlock" appears in block picker
- [ ] ProductHeroBlock: select a product → save → preview page shows two-column layout with carousel
- [ ] ProductCarousel: multiple images → arrows work, dots update, counter shows
- [ ] ProductCarousel: heart button toggles, page refresh retains state
- [ ] ProductInfoAccordion: first item (Product Labeling) open by default
- [ ] ProductListingBlock: products appear in grid with hover effects
- [ ] ProductListingBlock: pagination buttons appear and change pages
- [ ] ProductDescriptionBlock: rich text renders with prose styling
- [ ] TypeScript: `pnpm tsc --noEmit` passes clean

---

## Known Limitations / Future Work

1. **Product description in ProductHero** — The legacy Vue component showed a read-more toggle for the `description` field. This is omitted here. The `description` is a Lexical richtext field on the Product. Add a `ProductDescriptionExpander` client component later if needed.
2. **URL-based pagination** — The ProductListing uses client-side `useState` for pagination. Subsequent pages call the Payload REST API. For full SSR pagination with URL searchParams, update the page template to pass `searchParams` down to `RenderBlocks`.
3. **Product routes** — The `ProductCard` links to `/products/[slug]`. This route does not yet exist. Create `app/(frontend)/products/[slug]/page.tsx` in a follow-up task.
4. **Category hierarchy** — ProductListing filters by exact category only. Child categories are not included automatically.
