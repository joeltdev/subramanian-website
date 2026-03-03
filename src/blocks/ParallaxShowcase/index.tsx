// src/blocks/ParallaxShowcase/index.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

import type { ParallaxShowcaseBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { ParallaxSlide } from './Slide'

// Width constants — must match Tailwind max-w values in pixels
// max-w-5xl = 64rem = 1024px; inactive slides render at 85% of that
const ACTIVE_SLIDE_WIDTH = 1024  // px — max-w-5xl
const SLIDE_GAP = 24             // px — gap between slides

interface Props extends ParallaxShowcaseBlock {
  disableInnerContainer?: boolean
}

export const ParallaxShowcaseCarousel: React.FC<Props> = ({
  intro,
  autoScrollInterval,
  slides,
}) => {
  const safeSlides = slides ?? []
  const middle = Math.floor(safeSlides.length / 2)

  const [currentIndex, setCurrentIndex] = useState(middle)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || safeSlides.length <= 1) return
    const interval = Math.max(2, autoScrollInterval ?? 5) * 1000
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % safeSlides.length)
    }, interval)
    return () => clearInterval(id)
  }, [isPaused, autoScrollInterval, safeSlides.length])

  const advance = () =>
    setCurrentIndex((i) => (i + 1) % safeSlides.length)

  // ── Track translation ─────────────────────────────────────────────────────
  // Each slide occupies ACTIVE_SLIDE_WIDTH; CSS scale handles the visual size.
  // The track translateX centers slide[currentIndex] in the viewport.
  const translateX = -(currentIndex * (ACTIVE_SLIDE_WIDTH + SLIDE_GAP))

  return (
    <section
      className="relative py-12 md:py-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Block intro + tab nav ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 mb-10 space-y-8">
        {intro && (
          <RichText
            data={intro}
            enableGutter={false}
            className={cn(
              '[&_h2]:type-title-xl [&_h2]:text-type-heading [&_h2]:mb-0',
              '[&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:mb-0',
              '[&_p]:type-body-lg [&_p]:text-type-body [&_p]:leading-snug',
            )}
          />
        )}

        {/* Tab navigation */}
        {safeSlides.length > 0 && (
          <div className="flex flex-wrap gap-2" role="tablist">
            {safeSlides.map((slide, i) => (
              <button
                key={slide.id ?? i}
                role="tab"
                aria-selected={i === currentIndex}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'px-4 py-2 rounded-full type-label-sm transition-colors duration-200',
                  'border border-border',
                  i === currentIndex
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-foreground hover:bg-muted',
                )}
              >
                {slide.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Carousel track ────────────────────────────────────────────────── */}
      {/* overflow-x: clip lets inactive slides bleed past the section edge    */}
      {/* without creating a horizontal scrollbar or breaking vertical scroll  */}
      <div className="w-full" style={{ overflowX: 'clip' }}>
        <motion.div
          ref={trackRef}
          className="flex items-center"
          style={{ gap: SLIDE_GAP }}
          // Center the track: start offset brings first slide to center, then shift by index
          animate={{
            x: `calc(50vw - ${ACTIVE_SLIDE_WIDTH / 2}px + ${translateX}px)`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 40 }}
        >
          {safeSlides.map((slide, i) => {
            const direction =
              i < currentIndex ? 'prev' : i > currentIndex ? 'next' : 'active'
            return (
              <div
                key={slide.id ?? i}
                style={{ width: ACTIVE_SLIDE_WIDTH, flexShrink: 0 }}
              >
                <ParallaxSlide
                  slide={slide}
                  isActive={i === currentIndex}
                  direction={direction}
                  onClick={() => setCurrentIndex(i)}
                  onAdvance={advance}
                />
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
