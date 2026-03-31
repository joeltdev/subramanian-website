'use client'
import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { motion } from 'motion/react'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = (props) => {
  const { intro, items, imageDark } = props

  return (
    <section className="py-16 md:py-24 bg-white" data-section-theme="light">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* 1. Header Section - Left Aligned */}
        {intro && (
          <div className="mb-16 md:mb-20 text-left flex flex-col items-start w-full">
            <div className="max-w-none md:max-w-3xl w-full">
              <RichText
                data={intro}
                enableGutter={false}
                enableProse={false}
                disableTextAlign={true}
                className="[&_h2]:!text-lg md:[&_h2]:type-display-lg [&_h2]:text-black [&_h2]:tracking-tight [&_h2]:!whitespace-nowrap md:[&_h2]:!whitespace-normal [&_h3]:text-base md:[&_h3]:type-title-xl [&_h3]:text-black [&_h3]:font-bold [&_h3]:mb-4 [&_p]:type-title-md [&_p]:text-zinc-600 [&_p]:max-w-2xl [&_p]:mt-6"
              />
              <div className="mt-8 h-px w-24 bg-brand-500" />
            </div>
          </div>
        )}

        {/* 2. Cinematic Anchor Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-video w-full overflow-hidden bg-zinc-100 mb-16 md:mb-24 shadow-sm"
        >
          {typeof imageDark === 'object' && imageDark && (
            <Media
              resource={imageDark}
              fill
              className="w-full h-full"
              imgClassName="object-cover"
            />
          )}
        </motion.div>

        {/* 3. The Positions Grid (4-Column Editorial List) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-16 lg:gap-0">
          {items?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="flex flex-col px-0 lg:px-8 first:pl-0 last:pr-0 lg:border-l lg:first:border-l-0 border-zinc-200"
            >
              {/* Milestone Index */}
              <span className="text-zinc-400 font-medium text-xs tracking-widest uppercase mb-6 block">
                Milestone {String(index + 1).padStart(2, '0')}
              </span>
              
              {item.richText && (
                <RichText
                  data={item.richText}
                  enableGutter={false}
                  className="[&_h3]:type-headline-3 [&_h3]:text-black [&_h3]:mb-5 [&_h3]:font-bold [&_h3]:tracking-tight [&_h4]:type-title-lg [&_h4]:text-black [&_h4]:mb-3 [&_p]:type-body-md [&_p]:text-zinc-700 [&_p]:leading-relaxed [&_p]:line-clamp-5"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
