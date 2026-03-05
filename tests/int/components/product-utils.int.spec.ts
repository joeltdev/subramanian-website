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
