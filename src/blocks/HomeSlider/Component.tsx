'use client'

import React, { useState } from 'react'
import type { HomeSliderBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utilities/ui'

export const HomeSliderBlockComponent: React.FC<HomeSliderBlock> = ({ intro_n_a, items }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!items || items.length === 0) return null

  const activeSlide = items[activeIndex]

  return (
    <section className="py-16 md:py-24" data-section-theme="light">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Title */}
        {intro_n_a && (
          <div className="mb-8 md:mb-12">
            <RichText
              data={intro_n_a}
              enableGutter={false}
              className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"
            />
          </div>
        )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 md:mb-12 border-b border-border">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'px-4 md:px-6 py-3 transition-all duration-300 rounded-none border-b-2 font-medium type-title-sm',
              activeIndex === index
                ? 'border-primary text-primary bg-muted/50'
                : 'border-transparent text-type-secondary hover:text-type-heading hover:bg-muted/20',
            )}
          >
            {item.tabLabel}
          </button>
        ))}
      </div>

      {/* Slide Content Container */}
      <div className="relative overflow-hidden aspect-[4/5] md:aspect-[21/9] bg-muted group rounded-none">
        <AnimatePresence mode="wait">
...
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              {activeSlide.image && typeof activeSlide.image !== 'string' && (
                <Media
                  resource={activeSlide.image}
                  fill
                  className="object-cover"
                />
              )}

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12 text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-2xl"
                >
                  <h3 className="type-headline-3 mb-3 md:mb-4">{activeSlide.title}</h3>
                  <p className="type-body-lg text-white/90 leading-relaxed">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
