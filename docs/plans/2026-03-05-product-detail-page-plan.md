# Product Detail Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dynamic `products/[slug]/page.tsx` template (like posts) backed by shared components in `src/components/Product/`, fix both broken product routes, add an optional `layout` blocks field to Products, and create a `ProductListing` editorial block.

**Architecture:** Single template queries the `products` collection by slug — no per-product Pages needed. Shared components in `src/components/Product/` contain all visual logic. The `ProductHeroBlock` becomes a thin wrapper around those components for editorial use on marketing pages. A `layout` blocks field on Products enables optional editorial content below the fixed template.

**Tech Stack:** Next.js 15 App Router, Payload CMS 3.x (`getPayload`, `payload.find`/`findByID`), TypeScript, Tailwind CSS v4, `next/image`, shadcn/ui `<Accordion>` (`src/components/ui/accordion.tsx`), `<Media>` exported as `Media` from `@/components/Media`, `<RichText>` from `@/components/RichText`, vitest + jsdom for unit tests

**Design doc:** `docs/plans/2026-03-05-product-detail-page-design.md`

---

## Task 1: Fix `products/page.tsx` (listing page)

**Files:**
- Modify: `src/app/(frontend)/products/page.tsx`
- Modify: `src/app/(frontend)/products/page/[pageNumber]/page.tsx`

Both files currently query `posts`. Fix them to query `products`.

**Step 1: Update `products/page.tsx`**

Replace the file contents:

```tsx
// src/app/(frontend)/products/page.tsx
import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      name: true,
      slug: true,
      category: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Products</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="products"
          currentPage={products.page}
          limit={12}
          totalDocs={products.totalDocs}
        />
      </div>

      <div className="container">
        {products.totalPages > 1 && products.page && (
          <Pagination page={products.page} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Products`,
  }
}
```

**Step 2: Update `products/page/[pageNumber]/page.tsx`**

Open `src/app/(frontend)/products/page/[pageNumber]/page.tsx`. Change every occurrence of `collection: 'posts'` to `collection: 'products'` and update any `posts.docs` references to `products.docs`. Also update the page title from "Posts" to "Products".

**Step 3: Commit**

```bash
git add src/app/\(frontend\)/products/page.tsx src/app/\(frontend\)/products/page/
git commit -m "fix(products): query products collection on listing pages"
```

---

## Task 2: Add product utility functions + tests

**Files:**
- Create: `src/components/Product/utils.ts`
- Create: `tests/int/components/product-utils.int.spec.ts`

Pure functions that are unit-testable. Write the tests first.

**Step 1: Write the failing tests**

```ts
// tests/int/components/product-utils.int.spec.ts
import { describe, it, expect } from 'vitest'
import { formatProductPrice, serializeGalleryImages } from '../../../src/components/Product/utils'

describe('formatProductPrice', () => {
  it('returns null for zero price', () => {
    expect(formatProductPrice(0, 'EUR')).toBeNull()
  })

  it('returns null for null price', () => {
    expect(formatProductPrice(null, 'EUR')).toBeNull()
  })

  it('formats EUR price', () => {
    const result = formatProductPrice(299.99, 'EUR')
    expect(result).toContain('299')
    expect(result).toContain('99')
  })

  it('defaults to EUR when currency is null', () => {
    const result = formatProductPrice(100, null)
    expect(result).not.toBeNull()
  })
})

describe('serializeGalleryImages', () => {
  it('returns empty array for null gallery', () => {
    expect(serializeGalleryImages(null)).toEqual([])
  })

  it('returns empty array for empty gallery', () => {
    expect(serializeGalleryImages([])).toEqual([])
  })

  it('skips items where image is not populated (bare number)', () => {
    const gallery = [{ id: '1', image: 42, alt: 'test' }] as any
    expect(serializeGalleryImages(gallery)).toEqual([])
  })

  it('skips items where image has no url', () => {
    const gallery = [{ id: '1', image: { id: 1, mimeType: 'image/png' }, alt: 'test' }] as any
    expect(serializeGalleryImages(gallery)).toEqual([])
  })

  it('maps populated images to { src, alt }', () => {
    const gallery = [
      { id: '1', image: { id: 1, url: '/img/a.png', mimeType: 'image/png' }, alt: 'Photo A' },
      { id: '2', image: { id: 2, url: '/img/b.png', mimeType: 'image/png' }, alt: null },
    ] as any
    const result = serializeGalleryImages(gallery)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ src: '/img/a.png', alt: 'Photo A' })
    expect(result[1]).toEqual({ src: '/img/b.png', alt: '' })
  })
})
```

**Step 2: Run tests — expect FAIL**

```bash
pnpm test:int
```

Expected: `Cannot find module '../../../src/components/Product/utils'`

**Step 3: Create the utils file**

```ts
// src/components/Product/utils.ts
import type { Product, Media } from '@/payload-types'

export type SerializedImage = { src: string; alt: string }

export function formatProductPrice(
  price: number | null | undefined,
  currency: string | null | undefined,
): string | null {
  if (!price || price <= 0) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR',
  }).format(price)
}

export function serializeGalleryImages(
  gallery: Product['productGallery'] | null | undefined,
): SerializedImage[] {
  return (gallery ?? [])
    .map((item) => {
      if (!item.image || typeof item.image !== 'object') return null
      const media = item.image as Media
      if (!media.url) return null
      return { src: media.url, alt: item.alt ?? '' }
    })
    .filter((x): x is SerializedImage => x !== null)
}
```

**Step 4: Run tests — expect PASS**

```bash
pnpm test:int
```

Expected: all `product-utils` tests pass.

**Step 5: Commit**

```bash
git add src/components/Product/utils.ts tests/int/components/product-utils.int.spec.ts
git commit -m "feat(products): add product utility functions with tests"
```

---

## Task 3: Create `ProductCarousel` client component

**Files:**
- Create: `src/components/Product/ProductCarousel.tsx`

**Step 1: Create the component**

```tsx
// src/components/Product/ProductCarousel.tsx
'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import type { SerializedImage } from './utils'

interface ProductCarouselProps {
  images: SerializedImage[]
  productVideo?: string | null
  threeDModel?: string | null
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  images,
  productVideo,
  threeDModel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg bg-gray-100 md:h-[420px]">
        <span className="text-6xl text-gray-300">📦</span>
      </div>
    )
  }

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const next = () => setCurrentIndex((i) => Math.min(images.length - 1, i + 1))

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative h-80 overflow-hidden rounded-lg bg-gray-50 md:h-[420px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt || 'Product image'}
              fill
              className="object-contain"
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow transition hover:bg-white disabled:opacity-30"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={currentIndex === images.length - 1}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow transition hover:bg-white disabled:opacity-30"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition ${
                index === currentIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt || `Thumbnail ${index + 1}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Video / 3D links */}
      {(productVideo || threeDModel) && (
        <div className="flex gap-4 pt-2">
          {productVideo && (
            <a
              href={productVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch video
            </a>
          )}
          {threeDModel && (
            <a
              href={threeDModel}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
              3D model
            </a>
          )}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Product/ProductCarousel.tsx
git commit -m "feat(products): add ProductCarousel client component"
```

---

## Task 4: Create `ProductInfoAccordion` server component

**Files:**
- Create: `src/components/Product/ProductInfoAccordion.tsx`

This is a Server Component that passes server-rendered children into the shadcn `<Accordion>` (which is `'use client'` — this is the correct RSC pattern).

**Step 1: Create the component**

```tsx
// src/components/Product/ProductInfoAccordion.tsx
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
  instructionManual?: string | null
  dataSheet?: string | null
  ecDeclaration?: Product['ecDeclaration']
}

export const ProductInfoAccordion: React.FC<ProductInfoAccordionProps> = ({
  ean,
  productCode,
  instructionManual,
  dataSheet,
  ecDeclaration,
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="labeling" className="w-full">
      <AccordionItem value="labeling">
        <AccordionTrigger>Product Labeling</AccordionTrigger>
        <AccordionContent>
          {ean || productCode ? (
            <dl className="space-y-1 text-sm text-gray-700">
              {ean && (
                <div className="flex gap-2">
                  <dt className="font-medium">EAN:</dt>
                  <dd>{ean}</dd>
                </div>
              )}
              {productCode && (
                <div className="flex gap-2">
                  <dt className="font-medium">Code:</dt>
                  <dd className="font-mono">{productCode}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-gray-500">No labeling information available.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="manual">
        <AccordionTrigger>Installation Manual</AccordionTrigger>
        <AccordionContent>
          {instructionManual ? (
            <a
              href={instructionManual}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Download manual →
            </a>
          ) : (
            <p className="text-sm text-gray-500">Not available.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="datasheet">
        <AccordionTrigger>Data Sheet</AccordionTrigger>
        <AccordionContent>
          {dataSheet ? (
            <a
              href={dataSheet}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Download data sheet →
            </a>
          ) : (
            <p className="text-sm text-gray-500">Not available.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      {ecDeclaration && ecDeclaration.length > 0 && (
        <AccordionItem value="ec">
          <AccordionTrigger>EC Declaration</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1">
              {ecDeclaration.map((item, index) => (
                <li key={item.id ?? index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    EC Declaration{ecDeclaration.length > 1 ? ` ${index + 1}` : ''} →
                  </a>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Product/ProductInfoAccordion.tsx
git commit -m "feat(products): add ProductInfoAccordion server component"
```

---

## Task 5: Create `ProductHero` server component

**Files:**
- Create: `src/components/Product/ProductHero.tsx`

Orchestrates the two-column hero layout. Serializes gallery images here (server side) before passing plain objects to the client carousel.

**Step 1: Create the component**

```tsx
// src/components/Product/ProductHero.tsx
import React from 'react'
import Link from 'next/link'
import type { Product, ProductTag, ProductCategory } from '@/payload-types'
import { ProductCarousel } from './ProductCarousel'
import { ProductInfoAccordion } from './ProductInfoAccordion'
import { formatProductPrice, serializeGalleryImages } from './utils'

interface ProductHeroProps {
  product: Product
  /** Optional support contact info (from ProductHeroBlock editorial override) */
  helpline?: string | null
  technicalSupportEmail?: string | null
  knowledgeBaseUrl?: string | null
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  product,
  helpline,
  technicalSupportEmail,
  knowledgeBaseUrl,
}) => {
  const tags = (product.tags ?? [])
    .map((t) => (typeof t === 'object' ? (t as ProductTag) : null))
    .filter(Boolean) as ProductTag[]

  const tagLabels = tags.map((t) => (t.label ?? '').toLowerCase())
  const isBestSeller = tagLabels.includes('best seller')
  const isNew = tagLabels.includes('new')

  const category =
    product.category && typeof product.category === 'object'
      ? (product.category as ProductCategory)
      : null

  const images = serializeGalleryImages(product.productGallery)
  const priceStr = formatProductPrice(product.price, product.currency)

  return (
    <section className="py-8">
      <div className="container">
        {/* Breadcrumb */}
        {category && (
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/products" className="hover:text-gray-700">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{category.name}</span>
          </nav>
        )}

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          {/* Left — carousel (sticky on desktop) */}
          <div className="lg:sticky lg:top-24 lg:w-1/2">
            <ProductCarousel
              images={images}
              productVideo={product.productVideo}
              threeDModel={product.threeDModel}
            />
          </div>

          {/* Right — product info */}
          <div className="lg:w-1/2">
            {/* Name + badges */}
            <div className="mb-4 space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="text-base text-gray-600 sm:text-lg">{product.subtitle}</p>
              )}
              {(isBestSeller || isNew) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {isBestSeller && (
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                      Best seller
                    </span>
                  )}
                  {isNew && (
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      New
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Price + CTA */}
            {(priceStr || product.buyLink) && (
              <div className="mb-6 flex items-center gap-4">
                {priceStr && (
                  <span className="text-2xl font-bold text-gray-900">{priceStr}</span>
                )}
                {product.buyLink && (
                  <a
                    href={product.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Buy now
                  </a>
                )}
              </div>
            )}

            {/* Info accordion */}
            <ProductInfoAccordion
              ean={product.ean}
              productCode={product.productCode}
              instructionManual={product.instructionManual}
              dataSheet={product.dataSheet}
              ecDeclaration={product.ecDeclaration}
            />

            {/* Support info (editorial override from ProductHeroBlock) */}
            {(helpline || technicalSupportEmail || knowledgeBaseUrl) && (
              <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">Support</p>
                {helpline && <p>📞 {helpline}</p>}
                {technicalSupportEmail && (
                  <p>
                    ✉️{' '}
                    <a href={`mailto:${technicalSupportEmail}`} className="text-blue-600 hover:underline">
                      {technicalSupportEmail}
                    </a>
                  </p>
                )}
                {knowledgeBaseUrl && (
                  <p>
                    <a
                      href={knowledgeBaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Knowledge base →
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Product/ProductHero.tsx
git commit -m "feat(products): add ProductHero server component"
```

---

## Task 6: Create `ProductTabs` client component

**Files:**
- Create: `src/components/Product/ProductTabs.tsx`

**Step 1: Create the component**

```tsx
// src/components/Product/ProductTabs.tsx
'use client'
import React, { useState } from 'react'
import RichText from '@/components/RichText'
import type { Product } from '@/payload-types'

interface ProductTabsProps {
  description: Product['description'] | null | undefined
  technicalParameters: Product['technicalParameters'] | null | undefined
  instructionManual?: string | null
  dataSheet?: string | null
  ecDeclaration?: Product['ecDeclaration']
  productVideo?: string | null
  threeDModel?: string | null
}

type TabKey = 'description' | 'technical' | 'downloads' | 'video'

export const ProductTabs: React.FC<ProductTabsProps> = ({
  description,
  technicalParameters,
  instructionManual,
  dataSheet,
  ecDeclaration,
  productVideo,
  threeDModel,
}) => {
  const hasDownloads =
    instructionManual ||
    dataSheet ||
    (ecDeclaration && ecDeclaration.length > 0) ||
    threeDModel

  const tabs: { key: TabKey; label: string; show: boolean }[] = [
    { key: 'description', label: 'Description', show: !!description },
    { key: 'technical', label: 'Technical Parameters', show: !!technicalParameters },
    { key: 'downloads', label: 'Downloads', show: !!hasDownloads },
    { key: 'video', label: 'Video', show: !!productVideo },
  ].filter((t) => t.show)

  const [activeTab, setActiveTab] = useState<TabKey>(tabs[0]?.key ?? 'description')

  if (tabs.length === 0) return null

  return (
    <section className="py-12">
      <div className="container">
        {/* Tab bar */}
        <div className="border-b border-gray-200">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="pt-8">
          {activeTab === 'description' && description && (
            <div className="prose prose-gray max-w-4xl">
              <RichText data={description} enableGutter={false} />
            </div>
          )}

          {activeTab === 'technical' && technicalParameters && (
            <div className="prose prose-gray max-w-4xl">
              <RichText data={technicalParameters} enableGutter={false} />
            </div>
          )}

          {activeTab === 'downloads' && hasDownloads && (
            <ul className="max-w-lg space-y-3">
              {instructionManual && (
                <li>
                  <a
                    href={instructionManual}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    📄 Installation Manual
                  </a>
                </li>
              )}
              {dataSheet && (
                <li>
                  <a
                    href={dataSheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    📄 Data Sheet
                  </a>
                </li>
              )}
              {ecDeclaration?.map((item, index) => (
                <li key={item.id ?? index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    📄 EC Declaration{ecDeclaration.length > 1 ? ` ${index + 1}` : ''}
                  </a>
                </li>
              ))}
              {threeDModel && (
                <li>
                  <a
                    href={threeDModel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    🧊 3D Model
                  </a>
                </li>
              )}
            </ul>
          )}

          {activeTab === 'video' && productVideo && (
            <div className="max-w-2xl">
              <a
                href={productVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600"
              >
                ▶ Watch product video
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Product/ProductTabs.tsx
git commit -m "feat(products): add ProductTabs client component"
```

---

## Task 7: Fix `products/[slug]/page.tsx`

**Files:**
- Modify: `src/app/(frontend)/products/[slug]/page.tsx`

This file currently queries `posts` and uses `PostHero`. Replace the entire contents.

**Step 1: Replace the file**

```tsx
// src/app/(frontend)/products/[slug]/page.tsx
import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import type { Product } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProductHero } from '@/components/Product/ProductHero'
import { ProductTabs } from '@/components/Product/ProductTabs'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return products.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/products/' + decodedSlug
  const product = await queryProductBySlug({ slug: decodedSlug })

  if (!product) return <PayloadRedirects url={url} />

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <ProductHero product={product} />
      <ProductTabs
        description={product.description}
        technicalParameters={product.technicalParameters}
        instructionManual={product.instructionManual}
        dataSheet={product.dataSheet}
        ecDeclaration={product.ecDeclaration}
        productVideo={product.productVideo}
        threeDModel={product.threeDModel}
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
```

**Step 2: Run TypeScript check**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no errors from these files. If `generateMeta` errors because it expects `Post`, we'll address it in the next step.

**Step 3: Fix `generateMeta` if it's typed too narrowly**

Open `src/utilities/generateMeta.ts`. If it's typed as `Post`, loosen it to accept `{ meta?: ... } | null`:

```ts
// Check current signature:
grep -n "generateMeta" src/utilities/generateMeta.ts
```

If it only accepts `Post`, change the parameter type to:
```ts
doc: { meta?: { title?: string | null; description?: string | null; image?: any } | null } | null
```

**Step 4: Start dev server and verify**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/products`. Should show "Products" heading (no longer "Posts").
Navigate to `http://localhost:3000/products/[any-seeded-slug]`. Should show the product hero layout.

**Step 5: Commit**

```bash
git add src/app/\(frontend\)/products/\[slug\]/
git commit -m "fix(products): wire products/[slug] template to Products collection"
```

---

## Task 8: Add `layout` field to Products collection + `RenderProductBlocks`

**Files:**
- Modify: `src/collections/Products/index.ts`
- Create: `src/blocks/RenderProductBlocks.tsx`

**Step 1: Add layout imports and field to Products collection**

Open `src/collections/Products/index.ts`. Add block imports at the top after existing imports:

```ts
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { LogoCloud } from '../../blocks/LogoCloud/config'
import { FeatureCards } from '../../blocks/FeatureCards/config'
import { FeatureShowcase } from '../../blocks/FeatureShowcase/config'
import { ContentSection } from '../../blocks/ContentSection/config'
import { Stats } from '../../blocks/Stats/config'
import { Testimonials } from '../../blocks/Testimonials/config'
import { ArticleGrid } from '../../blocks/ArticleGrid/config'
import { YouTube } from '../../blocks/YouTube/config'
import { Gallery } from '../../blocks/Gallery/config'
```

Add the `layout` field at the end of the `fields` array (after `buyLink`):

```ts
{
  name: 'layout',
  type: 'blocks',
  label: 'Additional Content',
  admin: {
    description: 'Optional marketing content shown below the product detail (hero + tabs). For featured products only.',
    initCollapsed: true,
  },
  blocks: [
    CallToAction, Content, MediaBlock, LogoCloud, FeatureCards,
    FeatureShowcase, ContentSection, Stats, Testimonials,
    ArticleGrid, YouTube, Gallery,
  ],
},
```

**Step 2: Create `RenderProductBlocks`**

```tsx
// src/blocks/RenderProductBlocks.tsx
import React, { Fragment } from 'react'
import type { Product } from '@/payload-types'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { LogoCloudBlock } from '@/blocks/LogoCloud/Component'
import { FeatureCardsBlock } from '@/blocks/FeatureCards/Component'
import { FeatureShowcaseBlock } from '@/blocks/FeatureShowcase/Component'
import { ContentSectionBlock } from '@/blocks/ContentSection/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { ArticleGridBlock } from '@/blocks/ArticleGrid/Component'
import { YouTubeBlock } from '@/blocks/YouTube/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'

const blockComponents = {
  cta: CallToActionBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  logoCloud: LogoCloudBlock,
  featureCards: FeatureCardsBlock,
  featureShowcase: FeatureShowcaseBlock,
  contentSection: ContentSectionBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
  articleGrid: ArticleGridBlock,
  youtube: YouTubeBlock,
  gallery: GalleryBlock,
}

export const RenderProductBlocks: React.FC<{
  blocks: NonNullable<Product['layout']>
}> = ({ blocks }) => {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block
        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof typeof blockComponents]
          if (Block) {
            return (
              <div key={index}>
                {/* @ts-expect-error block union types */}
                <Block {...block} disableInnerContainer />
              </div>
            )
          }
        }
        return null
      })}
    </Fragment>
  )
}
```

**Step 3: Wire `RenderProductBlocks` into the product detail page**

Open `src/app/(frontend)/products/[slug]/page.tsx`. Add the import and render it after `<ProductTabs>`:

```tsx
import { RenderProductBlocks } from '@/blocks/RenderProductBlocks'

// Inside ProductPage, after <ProductTabs ... />:
{product.layout && product.layout.length > 0 && (
  <RenderProductBlocks blocks={product.layout} />
)}
```

**Step 4: Run `generate:types`**

```bash
pnpm generate:types
```

Expected: `payload-types.ts` updated with the new `layout` field on `Product`.

**Step 5: TypeScript check**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

**Step 6: Commit**

```bash
git add src/collections/Products/index.ts src/blocks/RenderProductBlocks.tsx src/app/\(frontend\)/products/\[slug\]/page.tsx src/payload-types.ts
git commit -m "feat(products): add optional layout blocks field + RenderProductBlocks"
```

---

## Task 9: Refactor `ProductHeroBlock` as thin wrapper

**Files:**
- Create: `src/blocks/ProductHero/config.ts`
- Create: `src/blocks/ProductHero/Component.tsx`
- Modify: `src/collections/Pages/index.ts`
- Modify: `src/blocks/RenderBlocks.tsx`

This is the editorial block for marketing pages. It picks a product by relationship and delegates all rendering to the shared `ProductHero` component.

**Step 1: Create the config**

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
      admin: { description: 'The product to display' },
    },
    {
      name: 'helpline',
      type: 'text',
      admin: { description: 'Support phone number (overrides default)' },
    },
    {
      name: 'technicalSupportEmail',
      type: 'text',
    },
    {
      name: 'knowledgeBaseUrl',
      type: 'text',
      label: 'Knowledge Base URL',
    },
  ],
}
```

**Step 2: Create the component**

```tsx
// src/blocks/ProductHero/Component.tsx
import React from 'react'
import type { ProductHeroBlock as ProductHeroBlockProps, Product } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProductHero } from '@/components/Product/ProductHero'

export const ProductHeroBlock: React.FC<
  ProductHeroBlockProps & { disableInnerContainer?: boolean }
> = async (props) => {
  const { helpline, technicalSupportEmail, knowledgeBaseUrl } = props

  // Use populated object if available; fetch only if bare ID came through
  let product: Product | null =
    typeof props.product === 'object' ? (props.product as Product) : null

  if (!product) {
    const payload = await getPayload({ config: configPromise })
    product = await payload.findByID({
      collection: 'products',
      id: props.product as number,
      depth: 2,
    })
  }

  if (!product) return null

  return (
    <ProductHero
      product={product}
      helpline={helpline}
      technicalSupportEmail={technicalSupportEmail}
      knowledgeBaseUrl={knowledgeBaseUrl}
    />
  )
}
```

**Step 3: Register in `Pages/index.ts`**

Open `src/collections/Pages/index.ts`. Add import:
```ts
import { ProductHero } from '../../blocks/ProductHero/config'
```

Add `ProductHero` to the `blocks` array in the `layout` field (append after `Gallery`):
```ts
blocks: [...existing, ProductHero],
```

**Step 4: Register in `RenderBlocks.tsx`**

Open `src/blocks/RenderBlocks.tsx`. Add import:
```ts
import { ProductHeroBlock } from '@/blocks/ProductHero/Component'
```

Add to `blockComponents`:
```ts
productHero: ProductHeroBlock,
```

**Step 5: Run `generate:types`**

```bash
pnpm generate:types
```

**Step 6: TypeScript check**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

**Step 7: Commit**

```bash
git add src/blocks/ProductHero/ src/collections/Pages/index.ts src/blocks/RenderBlocks.tsx src/payload-types.ts
git commit -m "feat(blocks): add ProductHeroBlock as thin wrapper around ProductHero component"
```

---

## Task 10: Create `ProductCard` component

**Files:**
- Create: `src/components/Product/ProductCard.tsx`

**Step 1: Create the component**

```tsx
// src/components/Product/ProductCard.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product, ProductCategory, ProductTag, Media } from '@/payload-types'
import { formatProductPrice } from './utils'

interface ProductCardProps {
  product: Product
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
    product.productGallery?.[0]?.image &&
    typeof product.productGallery[0].image === 'object'
      ? (product.productGallery[0].image as Media)
      : null

  const priceStr = formatProductPrice(product.price, product.currency)
  const href = `/products/${product.slug}`

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {firstImage?.url ? (
          <Image
            src={firstImage.url}
            alt={product.productGallery?.[0]?.alt ?? product.name}
            fill
            className="object-contain transition group-hover:scale-105"
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300">
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {category && (
          <span
            className="mb-1 inline-block self-start rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: category.color ? `${category.color}20` : '#3B82F620',
              color: category.color ?? '#3B82F6',
            }}
          >
            {category.name}
          </span>
        )}

        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
          {product.name}
        </h3>

        {product.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{product.subtitle}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          {priceStr && <span className="text-sm font-bold text-gray-900">{priceStr}</span>}
          {product.productCode && (
            <span className="font-mono text-xs text-gray-400">{product.productCode}</span>
          )}
        </div>

        {tags.slice(0, 2).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag.id} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Product/ProductCard.tsx
git commit -m "feat(products): add ProductCard component"
```

---

## Task 11: Create `ProductListing` block

**Files:**
- Create: `src/blocks/ProductListing/config.ts`
- Create: `src/blocks/ProductListing/ProductListingClient.tsx`
- Create: `src/blocks/ProductListing/Component.tsx`

**Step 1: Create the config**

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
      admin: { description: 'Optional heading above the grid' },
    },
    {
      name: 'description',
      type: 'text',
      admin: { description: 'Optional subheading' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      admin: { description: 'Filter to this category (leave empty for all products)' },
    },
    {
      name: 'productsPerPage',
      type: 'number',
      defaultValue: 9,
      min: 1,
      max: 24,
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
```

**Step 2: Create the client pagination component**

```tsx
// src/blocks/ProductListing/ProductListingClient.tsx
'use client'
import React, { useCallback, useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Product } from '@/payload-types'
import { ProductCard } from '@/components/Product/ProductCard'

interface ProductListingClientProps {
  initialProducts: Product[]
  totalPages: number
  currentPage: number
  productsPerPage: number
  categoryId: number | null
  showPagination: boolean
  title?: string | null
  description?: string | null
}

export const ProductListingClient: React.FC<ProductListingClientProps> = ({
  initialProducts,
  totalPages,
  currentPage,
  productsPerPage,
  categoryId,
  showPagination,
  title,
  description,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [localTotal, setLocalTotal] = useState(totalPages)
  const [localPage, setLocalPage] = useState(currentPage)
  const [isPending, startTransition] = useTransition()

  const goToPage = useCallback(
    async (page: number) => {
      if (page === localPage) return
      startTransition(async () => {
        const params = new URLSearchParams({
          limit: String(productsPerPage),
          page: String(page),
          depth: '1',
        })
        if (categoryId) params.set('where[category][equals]', String(categoryId))

        const res = await fetch(`/api/products?${params}`)
        if (!res.ok) return
        const data = await res.json()
        setProducts(data.docs ?? [])
        setLocalTotal(data.totalPages ?? 1)
        setLocalPage(page)
      })
    },
    [localPage, productsPerPage, categoryId],
  )

  return (
    <div className="py-12">
      {(title || description) && (
        <div className="container mb-8 text-center">
          {title && <h2 className="text-3xl font-bold text-gray-900">{title}</h2>}
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>
      )}

      <div className="container">
        {isPending && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: productsPerPage }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-gray-100 aspect-[3/4]" />
            ))}
          </div>
        )}

        {!isPending && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isPending && products.length === 0 && (
          <div className="py-16 text-center text-gray-500">No products found.</div>
        )}

        {showPagination && localTotal > 1 && !isPending && (
          <nav className="mt-10 flex justify-center gap-2">
            <button
              disabled={localPage === 1}
              onClick={() => goToPage(localPage - 1)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: localTotal }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`rounded px-3 py-1.5 text-sm ${
                  p === localPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={localPage === localTotal}
              onClick={() => goToPage(localPage + 1)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
```

**Step 3: Create the server component**

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
      currentPage={1}
      productsPerPage={productsPerPage}
      categoryId={categoryId}
      showPagination={showPagination ?? true}
      title={title}
      description={description}
    />
  )
}
```

**Step 4: Commit**

```bash
git add src/blocks/ProductListing/
git commit -m "feat(blocks): add ProductListing block with server fetch + client pagination"
```

---

## Task 12: Register `ProductListing` everywhere + generate types

**Files:**
- Modify: `src/collections/Pages/index.ts`
- Modify: `src/blocks/RenderBlocks.tsx`
- Modify: `src/blocks/RenderProductBlocks.tsx`
- Modify: `src/collections/Products/index.ts`

**Step 1: Add to `Pages/index.ts`**

```ts
import { ProductListing } from '../../blocks/ProductListing/config'
```

Append `ProductListing` to the `blocks` array.

**Step 2: Add to `RenderBlocks.tsx`**

```ts
import { ProductListingBlock } from '@/blocks/ProductListing/Component'
// ...
productListing: ProductListingBlock,
```

**Step 3: Add to `RenderProductBlocks.tsx`**

```ts
import { ProductListingBlock } from '@/blocks/ProductListing/Component'
// ...
productListing: ProductListingBlock,
```

Also add `ProductListing` to the `blocks` array in the Products `layout` field in `Products/index.ts`:

```ts
import { ProductListing } from '../../blocks/ProductListing/config'
// Add ProductListing to the layout blocks array
```

**Step 4: Run `generate:types`**

```bash
pnpm generate:types
```

**Step 5: TypeScript check**

```bash
pnpm tsc --noEmit 2>&1 | head -50
```

Expected: clean. Fix any type errors before continuing.

**Step 6: Commit**

```bash
git add src/collections/Pages/index.ts src/blocks/RenderBlocks.tsx src/blocks/RenderProductBlocks.tsx src/collections/Products/index.ts src/payload-types.ts
git commit -m "feat(blocks): register ProductListing in Pages, RenderBlocks, and RenderProductBlocks"
```

---

## Task 13: Smoke test

**Step 1: Start dev server**

```bash
pnpm dev
```

**Step 2: Run through this checklist**

- [ ] `http://localhost:3000/products` — renders "Products" heading, no error
- [ ] `http://localhost:3000/products/[seeded-slug]` — shows product hero layout with name, gallery
- [ ] Gallery with multiple images — prev/next buttons work, thumbnails highlight active
- [ ] Product with price — price shown in hero
- [ ] Product with buyLink — "Buy now" button shown
- [ ] ProductTabs — tabs render; Description tab shows richtext
- [ ] ProductTabs — Downloads tab shows links for any populated download fields
- [ ] ProductTabs — tabs with no content are hidden
- [ ] Accordion opens/closes — Product Labeling open by default
- [ ] Admin → Pages → create page → Add block → "Product Hero" appears in picker
- [ ] Admin → Pages → create page → Add block → "Product Listing" appears in picker
- [ ] Admin → Products → open a product → "Additional Content" layout field visible
- [ ] TypeScript: `pnpm tsc --noEmit` passes clean

**Step 3: Commit if everything green**

```bash
git add .
git commit -m "feat(products): complete product detail page template and editorial blocks"
```

---

## Known Limitations / Future Work

1. **Products listing page** (`/products`) still renders a basic layout — the `ProductListing` block can be used on a marketing page, but `/products` itself is a simple stub. A proper category-filtered listing page is a follow-up task.
2. **Related products** — no "More from this category" section yet. Add a server fetch to `products/[slug]/page.tsx` and a `<ProductCard>` grid below `<ProductTabs>`.
3. **SEO pagination** — `ProductListingClient` uses client-side state. Page 2+ is not indexable. Use URL `searchParams` for a full SSR pagination upgrade.
4. **Category hierarchy** — `ProductListing` filters by exact category only, not child categories.
