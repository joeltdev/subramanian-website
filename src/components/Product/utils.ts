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
