'use client'

import React from 'react'

import type { GalleryBlock } from '@/payload-types'
import {
  Carousel as AppleCarousel,
  Card,
} from '@/components/ui/apple-cards-carousel'
import RichText from '@/components/RichText'

export const AppleGallery: React.FC<GalleryBlock> = ({ intro, appleItems }) => {
  const cards = (appleItems ?? []).map((item, index) => {
    const src = typeof item.image === 'object' && item.image ? (item.image.url ?? '') : ''

    const content = item.expandedContent ? (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <RichText
          data={item.expandedContent}
          enableGutter={false}
          className="text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:text-neutral-700 [&_h3]:dark:text-neutral-200 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-3 [&_p]:text-base [&_p]:md:text-xl [&_p]:leading-relaxed"
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
    <section className="py-4 md:py-8">
      <div className="w-full h-full py-20">
        {intro && (
          <div className="max-w-7xl pl-4 mx-auto mb-4">
            <RichText
              data={intro}
              enableGutter={false}
              className="[&_h2]:text-xl [&_h2]:md:text-5xl [&_h2]:font-bold [&_h2]:text-neutral-800 [&_h2]:dark:text-neutral-200 [&_h3]:text-xl [&_h3]:md:text-5xl [&_h3]:font-bold [&_h3]:text-neutral-800 [&_h3]:dark:text-neutral-200"
            />
          </div>
        )}
        <AppleCarousel items={cards} />
      </div>
    </section>
  )
}
