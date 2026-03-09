// src/blocks/ParallaxShowcase/index.tsx
'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  const n = safeSlides.length

  // Responsive slide width: viewport-width on mobile, 1024px on md+
  const [slideWidth, setSlideWidth] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
      ? window.innerWidth
      : ACTIVE_SLIDE_WIDTH,
  )
  const slideGap = slideWidth < ACTIVE_SLIDE_WIDTH ? 0 : SLIDE_GAP

  useEffect(() => {
    const onResize = () => {
      setSlideWidth(window.innerWidth < 768 ? window.innerWidth : ACTIVE_SLIDE_WIDTH)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Pad only if there are multiple slides
  const paddedSlides = n > 1
    ? [safeSlides[n - 1], ...safeSlides, safeSlides[0]]
    : safeSlides

  // trackIndex: position in paddedSlides (1 = first real slide)
  const [trackIndex, setTrackIndex] = useState(n > 1 ? 1 : 0)
  // activeReal: 0-based index into safeSlides — drives tab nav
  const [activeReal, setActiveReal] = useState(0)

  // Ref that suppresses spring for the teleport step
  const skipNextAnimation = useRef(false)

  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const pointerStartX = useRef<number | null>(null)

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || n <= 1) return
    const interval = Math.max(2, autoScrollInterval ?? 5) * 1000
    const id = setInterval(() => {
      setTrackIndex((i) => i + 1)
      setActiveReal((i) => (i + 1) % n)
    }, interval)
    return () => clearInterval(id)
  }, [isPaused, autoScrollInterval, n])

  const advance = () => {
    setTrackIndex((i) => i + 1)
    setActiveReal((i) => (i + 1) % n)
  }

  const retreat = () => {
    setTrackIndex((i) => i - 1)
    setActiveReal((i) => (i - 1 + n) % n)
  }

  // ── Track translation ─────────────────────────────────────────────────────
  const translateX = -(trackIndex * (slideWidth + slideGap))

  // Clear skip flag after teleport render so next transition uses spring again
  useLayoutEffect(() => {
    if (skipNextAnimation.current) {
      skipNextAnimation.current = false
    }
  }, [trackIndex])

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    pointerStartX.current = e.clientX
  }
  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (pointerStartX.current === null) return
    const delta = e.clientX - pointerStartX.current
    pointerStartX.current = null
    if (delta > 50) retreat()
    else if (delta < -50) advance()
  }
  const handlePointerCancel = () => {
    pointerStartX.current = null
  }

  return (
    <section
      className="relative py-12 md:py-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* ── Block intro + tab nav ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 mb-10 space-y-12">
        {intro && (
          <RichText
            data={intro}
            enableGutter={false}
            className={cn(
              'max-w-4xl flex flex-col gap-6 items-center',
              '[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_h2]:mb-0',
              '[&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:mb-0',
              '[&_p]:type-body-xl [&_p]:font-medium [&_p]:text-type-body [&_p]:leading-snug [&_p]:text-center [&_p]:mx-auto [&_p]:max-w-xl',
            )}
          />
        )}

        {/* Tab navigation */}
        {safeSlides.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center justify-center" role="tablist">
            {safeSlides.map((slide, i) => (
              <button
                key={slide.id ?? i}
                role="tab"
                aria-selected={i === activeReal}
                onClick={() => {
                  setTrackIndex(i + 1)
                  setActiveReal(i)
                }}
                className={cn(
                  'px-4 py-2 rounded-full type-label-sm transition-colors duration-200 cursor-pointer',
                  'border border-border',
                  i === activeReal
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
          style={{ gap: slideGap }}
          animate={{
            x: `calc(50vw - ${slideWidth / 2}px + ${translateX}px)`,
          }}
          transition={
            skipNextAnimation.current
              ? { duration: 0 }
              : { type: 'spring', stiffness: 300, damping: 40 }
          }
          onAnimationComplete={() => {
            if (n <= 1) return
            if (trackIndex === 0) {
              // settled on leading clone (copy of last real slide) → jump to real last
              skipNextAnimation.current = true
              setTrackIndex(n)
              setActiveReal(n - 1)
            } else if (trackIndex === n + 1) {
              // settled on trailing clone (copy of first real slide) → jump to real first
              skipNextAnimation.current = true
              setTrackIndex(1)
              setActiveReal(0)
            }
          }}
        >
          {paddedSlides.map((slide, i) => {
            const direction =
              i < trackIndex ? 'prev' : i > trackIndex ? 'next' : 'active'
            return (
              <div
                key={
                  i === 0
                    ? 'clone-head'
                    : i === paddedSlides.length - 1
                      ? 'clone-tail'
                      : (slide.id ?? i)
                }
                style={{ width: slideWidth, flexShrink: 0 }}
              >
                <ParallaxSlide
                  slide={slide}
                  isActive={i === trackIndex}
                  direction={direction}
                  onClick={() => {
                    // Clone clicks navigate to their real counterpart
                    const realIndex =
                      i === 0 ? n - 1 : i === paddedSlides.length - 1 ? 0 : i - 1
                    setTrackIndex(realIndex + 1)
                    setActiveReal(realIndex)
                  }}
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
