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
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {category && (
          <span
            className="relative mb-1 inline-block self-start overflow-hidden rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ color: category.color ?? '#3B82F6' }}
          >
            <span
              className="absolute inset-0 opacity-15"
              style={{ backgroundColor: category.color ?? '#3B82F6' }}
              aria-hidden
            />
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
