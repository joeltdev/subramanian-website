'use client'
import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { motion } from 'motion/react'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = (props) => {
  const { intro, items, imageDark, theme } = props

  return (
    <section className="py-16 md:py-24 bg-background" data-section-theme={theme || 'light'}>
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* 1. Header Section - Matched to Gallery/HomeSlider */}
        {intro && (
          <div className="mb-16 md:mb-24 text-center flex flex-col items-center">
            <div className="max-w-3xl">
              <RichText
                data={intro}
                enableGutter={false}
                className="[&_h2]:type-display-lg [&_h2]:text-type-heading [&_h2]:tracking-tight [&_h3]:type-headline-1 [&_h3]:text-type-heading [&_h3]:tracking-widest [&_h3]:uppercase [&_h3]:mb-4 [&_p]:type-title-md [&_p]:text-type-secondary [&_p]:max-w-2xl [&_p]:mt-6"
              />
            </div>
          </div>
        )}

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left: Cinematic Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] overflow-hidden bg-muted group shadow-2xl"
          >
            {typeof imageDark === 'object' && imageDark && (
              <Media
                resource={imageDark}
                fill
                className="w-full h-full"
                imgClassName="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            )}
            {/* Subtle brand accent overlay */}
            <div className="absolute inset-0 border-[12px] border-white/5 pointer-events-none" />
          </motion.div>

          {/* Right: 2x2 Narrative Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 lg:gap-y-16">
            {items?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="flex flex-col group"
              >
                {/* Minimal Accent Line */}
                <div className="w-8 h-[2px] bg-brand-500 mb-6 transition-all duration-500 group-hover:w-full" />
                
                {item.richText && (
                  <RichText
                    data={item.richText}
                    enableGutter={false}
                    className="[&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:mb-4 [&_h3]:font-bold [&_h3]:tracking-tight [&_h4]:type-title-lg [&_h4]:text-type-heading [&_h4]:mb-3 [&_p]:type-body-md [&_p]:text-type-secondary [&_p]:leading-relaxed"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
