'use client'

import React from 'react'

import type { GalleryBlock } from '@/payload-types'
import ParallaxCarousel from '@/components/ui/aceternity-parallax-carousel'

export const ParallaxGallery: React.FC<GalleryBlock> = ({ slides }) => {
  if (!Array.isArray(slides) || slides.length === 0) return null

  const slideData = slides.map(({ image, title, link }) => ({
    src: typeof image === 'object' && image ? (image.url ?? '') : '',
    title: title ?? '',
    button: link?.label ?? 'View',
  }))

  return (
    <section className="py-4 md:py-8">
      <div className="relative overflow-hidden w-full h-full py-20">
        <ParallaxCarousel slides={slideData} />
      </div>
    </section>
  )
}
