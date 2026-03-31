'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { HomeSliderBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utilities/ui'
import { ArrowRight } from 'lucide-react'

export const HomeSliderBlockComponent: React.FC<HomeSliderBlock> = ({ intro_n_a, items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!items || items.length === 0) return null

  return (
    <section className="py-16 md:py-24 overflow-hidden" data-section-theme="light">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header - Matched to Gallery Style */}
        {intro_n_a && (
          <div className="mb-16 md:mb-20">
            <div className="max-w-3xl">
              <RichText
                data={intro_n_a}
                enableGutter={false}
                className="[&_h2]:!text-xl md:[&_h2]:type-display-lg [&_h2]:text-type-heading [&_h2]:tracking-tight [&_h2]:!whitespace-nowrap md:[&_h2]:!whitespace-normal [&_h3]:text-lg md:[&_h3]:type-headline-1 [&_h3]:text-type-heading [&_h3]:font-bold [&_h3]:mb-4 [&_p]:type-title-md [&_p]:text-type-secondary [&_p]:max-w-2xl [&_p]:mt-6 md:[&_p]:mt-0"
              />
              <div className="mt-8 h-px w-24 bg-brand-500" />
            </div>
          </div>
        )}

        {/* Mobile Experience: Vertical Scroll-Snap Cards */}
        {isMobile ? (
          <div 
            ref={scrollRef}
            className="flex flex-col gap-6"
          >
            {items.map((item, index) => {
              const isExpanded = expandedMobileIndex === index
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-muted rounded-none group"
                >
                  {/* Background Image */}
                  {item.image && typeof item.image !== 'string' && (
                    <Media
                      resource={item.image}
                      fill
                      className="w-full h-full"
                      imgClassName="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}
                  
                  {/* Dynamic Overlay */}
                  <div 
                    className={cn(
                      "absolute inset-0 z-10 bg-linear-to-t from-black/95 via-black/40 to-transparent",
                      item.overlayColor === 'brand' ? "from-brand-950/95" : "from-black/95"
                    )}
                  />

                  {/* Content Card */}
                  <div className="absolute inset-x-0 bottom-0 z-20 p-6 flex flex-col justify-end h-full">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 transition-all duration-500">
                      <span className="text-xl md:type-headline-1 text-white block mb-4 tracking-tight font-bold">
                        {item.tabLabel}
                      </span>
                      <p className={cn(
                        "text-white/80 type-body-md transition-all duration-500",
                        isExpanded ? "line-clamp-none" : "line-clamp-3"
                      )}>
                        {item.description}
                      </p>
                      {item.description && item.description.length > 100 && (
                        <button 
                          onClick={() => setExpandedMobileIndex(isExpanded ? null : index)}
                          className="mt-4 text-white text-[11px] uppercase tracking-widest font-bold underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all"
                        >
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Desktop Experience: Expanding Triptych */
          <div className="flex gap-4 h-[600px] w-full">
            {items.map((item, index) => {
              const isHovered = hoveredIndex === index
              const isAnyHovered = hoveredIndex !== null
              
              // Calculate width based on hover state
              // Default: equal width. Hovered: wider. Non-hovered while another is hovered: narrower.
              const width = isHovered ? '50%' : (isAnyHovered ? '25%' : '33.33%')

              return (
                <motion.div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{ width }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full overflow-hidden bg-muted cursor-pointer group rounded-none"
                >
                  {/* Background Image */}
                  {item.image && typeof item.image !== 'string' && (
                    <Media
                      resource={item.image}
                      fill
                      className="w-full h-full"
                      imgClassName="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  )}

                  {/* Overlay */}
                  <div 
                    className={cn(
                      "absolute inset-0 z-10 transition-opacity duration-500 bg-black",
                      isHovered ? "opacity-60" : "opacity-40",
                      item.overlayColor === 'brand' && "bg-brand-950"
                    )}
                  />

                  {/* Vertical Label (when not hovered) */}
                  <AnimatePresence>
                    {!isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center"
                      >
                        <span className="type-headline-1 text-white/80 uppercase tracking-[0.3em] rotate-180 [writing-mode:vertical-lr]">
                          {item.tabLabel}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Content Container (revealed on hover) */}
                  <div className="absolute inset-0 z-30 p-12 flex flex-col justify-end pointer-events-none">
                    <motion.div
                      animate={{ 
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 40
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8"
                    >
                      <span className="type-headline-1 text-white/60 block mb-6 tracking-widest uppercase">
                        {item.tabLabel}
                      </span>
                      <p className="text-white/80 type-body-lg mb-8 line-clamp-6">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 text-white group/btn">
                        <span className="type-title-sm font-bold uppercase tracking-wider">Explore Journey</span>
                        <div className="size-10 rounded-full border border-white/20 flex items-center justify-center transition-all group-hover/btn:bg-white group-hover/btn:text-black">
                          <ArrowRight className="size-5" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
