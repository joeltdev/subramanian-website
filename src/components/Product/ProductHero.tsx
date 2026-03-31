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
              <h1 className="text-3xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
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
