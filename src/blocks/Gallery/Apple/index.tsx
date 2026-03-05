'use client'

import React from 'react'

import type { GalleryBlock } from '@/payload-types'
import {
  Carousel as AppleCarousel,
  Card,
} from '@/components/ui/apple-cards-carousel'
import RichText from '@/components/RichText'

import { motion, useInView } from 'motion/react'

export const AppleGallery: React.FC<GalleryBlock> = ({ intro, appleItems }) => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const cards = (appleItems ?? []).map((item, index) => {
    const src = typeof item.image === 'object' && item.image ? (item.image.url ?? '') : ''

    const content = item.expandedContent ? (
      <div className="bg-muted p-8 md:p-14 rounded-none mb-4">
        <RichText
          data={item.expandedContent}
          enableGutter={false}
          className="max-w-3xl mx-auto [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:mb-4 [&_h4]:type-title-lg [&_h4]:text-type-heading [&_h4]:mb-3 [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:leading-relaxed"
        />
      </div>
    ) : null

    return (
      <Card
        key={item.id ?? index}
        card={{
          src,
          title: item.title ?? '',
          category: item.category ?? '',
          content,
        }}
        index={index}
      />
    )
  })

  return (
    <section className="py-16 md:py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
      >
        {intro && (
          <div className="mx-auto max-w-7xl px-6 md:px-8 mb-12 md:mb-16">
            <RichText
              data={intro}
              enableGutter={false}
              className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"
            />
          </div>
        )}
        <AppleCarousel items={cards} />
      </motion.div>
    </section>
  )
}
