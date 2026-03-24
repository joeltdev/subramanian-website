'use client'

import React, { useState } from 'react'
import type { HomeSliderBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const HomeSliderBlockComponent: React.FC<HomeSliderBlock> = ({ intro_n_a, items }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!items || items.length === 0) return null

  const activeSlide = items[activeIndex]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  return (
    <section className="py-16 md:py-24" data-section-theme="light">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Title */}
        {intro_n_a && (
          <div className="mb-12 md:mb-20 flex flex-col items-center justify-center text-center w-full">
            <RichText
              data={intro_n_a}
              enableGutter={false}
              enableProse={false}
              className="max-w-4xl mx-auto flex flex-col items-center w-full [&_h2]:type-headline-1 [&_h2]:font-bold [&_h2]:text-type-heading [&_h2]:mb-8 [&_h2]:text-center [&_h2]:w-full [&_strong]:type-headline-1 [&_strong]:font-bold [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:max-w-2xl [&_p]:mx-auto [&_p]:text-center [&_p]:w-full"
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
        <div className="relative overflow-hidden aspect-[2/3] md:aspect-[16/9] bg-muted group rounded-none">
          <AnimatePresence mode="wait">
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

              {/* Overlay Background - Full Coverage */}
              <div 
                className={cn(
                  "absolute inset-0 z-10",
                  activeSlide.overlayColor === 'brand' ? "bg-brand-950" : "bg-black"
                )}
                style={{ opacity: (activeSlide.overlayOpacity ?? 50) / 100 }}
              />

              {/* Navigation Arrows */}
              <div className="absolute inset-y-0 left-0 z-30 flex items-center pl-4 md:pl-8 pointer-events-none">
                <button
                  onClick={prevSlide}
                  className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-300 group/btn"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-6 md:size-8 transition-transform group-hover/btn:-translate-x-0.5" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 z-30 flex items-center pr-4 md:pr-8 pointer-events-none">
                <button
                  onClick={nextSlide}
                  className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-300 group/btn"
                  aria-label="Next slide"
                >
                  <ChevronRight className="size-6 md:size-8 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>

              {/* Overlay Content - Text above overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-2xl"
                >
                  <h3 className="type-title-xl md:type-headline-3 mb-5 md:mb-4">{activeSlide.title}</h3>
                  <p className="type-body-md md:type-body-lg font-medium text-white/90 leading-relaxed">
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
