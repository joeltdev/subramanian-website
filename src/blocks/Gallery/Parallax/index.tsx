'use client'

import React from 'react'

import type { GalleryBlock } from '@/payload-types'
import ParallaxCarousel from '@/components/ui/aceternity-parallax-carousel'

import { motion, useInView } from 'motion/react'

export const ParallaxGallery: React.FC<GalleryBlock> = ({ slides }) => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (!Array.isArray(slides) || slides.length === 0) return null

  const slideData = slides.map(({ image, title, link }) => ({
    src: typeof image === 'object' && image ? (image.url ?? '') : '',
    title: title ?? '',
    button: link?.label ?? 'View',
  }))

  return (
    <section className="py-16 md:py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden w-full h-full py-20"
      >
        <ParallaxCarousel slides={slideData} />
      </motion.div>
    </section>
  )
}
