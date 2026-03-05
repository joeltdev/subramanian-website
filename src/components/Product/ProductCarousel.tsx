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
