// src/blocks/ParallaxShowcase/Slide.tsx
'use client'

import React, { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useSpring,
} from 'motion/react'

import type { ParallaxShowcaseBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type Slide = NonNullable<ParallaxShowcaseBlock['slides']>[number]

interface SlideProps {
  slide: Slide
  isActive: boolean
  direction: 'prev' | 'next' | 'active'
  onClick: () => void
  onAdvance: () => void
}

export const ParallaxSlide: React.FC<SlideProps> = ({
  slide,
  isActive,
  direction,
  onClick,
  onAdvance,
}) => {
  const slideRef = useRef<HTMLDivElement>(null)
  const [badgePos, setBadgePos] = useState({ x: 0, y: 0 })
  const [badgeVisible, setBadgeVisible] = useState(false)

  // ── Scroll parallax ──────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: slideRef,
    offset: ['start end', 'end start'],
  })
  const bgScrollY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const fgScrollY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  // ── Mouse parallax (active slide only) ──────────────────────────────────
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  // Spring-smooth the mouse values for a fluid feel
  const mouseX = useSpring(rawMouseX, { stiffness: 120, damping: 20 })
  const mouseY = useSpring(rawMouseY, { stiffness: 120, damping: 20 })

  const bgMouseX = useTransform(mouseX, [-0.5, 0.5], ['-12px', '12px'])
  const bgMouseY = useTransform(mouseY, [-0.5, 0.5], ['-12px', '12px'])
  const fgMouseX = useTransform(mouseX, [-0.5, 0.5], ['-20px', '20px'])
  const fgMouseY = useTransform(mouseY, [-0.5, 0.5], ['-20px', '20px'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isActive) {
      const rect = slideRef.current?.getBoundingClientRect()
      if (!rect) return
      rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5)
      rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    } else {
      // Update badge position for inactive slides
      const rect = slideRef.current?.getBoundingClientRect()
      if (!rect) return
      setBadgePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseLeave = () => {
    rawMouseX.set(0)
    rawMouseY.set(0)
    setBadgeVisible(false)
  }

  const handleMouseEnter = () => {
    if (!isActive) setBadgeVisible(true)
  }

  const { name: _name, content, backgroundImage, foregroundImage, link } = slide

  const hasBg = backgroundImage && typeof backgroundImage === 'object'
  const hasFg = foregroundImage && typeof foregroundImage === 'object'
  const hasLink = link && (link.url || (link.type === 'reference' && link.reference))

  const slideInner = (
    <motion.div
      ref={slideRef}
      className={cn(
        'relative aspect-[7/4] shrink-0 rounded-2xl overflow-hidden cursor-pointer',
        'w-full transition-[opacity,transform] duration-500',
        isActive ? 'opacity-100 scale-100 z-10' : 'opacity-50 scale-[0.97] z-0',
      )}
      onClick={isActive ? undefined : onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* ── Background image layer ───────────────────────────────────── */}
      {hasBg && (
        <motion.div
          className="absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none"
          style={{
            y: bgScrollY,
            x: isActive ? bgMouseX : undefined,
          }}
        >
          <Media
            resource={backgroundImage}
            fill
            imgClassName="object-cover"
          />
        </motion.div>
      )}

      {/* ── Gradient scrim ───────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/20 to-transparent pointer-events-none" />

      {/* ── Slide content — top-left ─────────────────────────────────── */}
      {content && (
        <div className="absolute top-16 left-16 z-10 max-w-md">
          <RichText
            data={content}
            enableGutter={false}
            className={cn(
              '[&_h3]:type-headline-2 [&_h3]:font-normal [&_h3]:text-white [&_h3]:mb-2',
              '[&_h4]:type-headline-3 [&_h4]:font-normal [&_h4]:text-white [&_h4]:mb-1',
              '[&_p]:type-body-lg [&_p]:text-white [&_p]:leading-snug',
            )}
          />
        </div>
      )}

      {/* ── Foreground image layer ───────────────────────────────────── */}
      {hasFg && (
        <motion.div
          className="absolute bottom-0 left-[50%] -translate-x-1/2 aspect-3/2 w-3/5 pointer-events-none"
          style={{
            y: fgScrollY,
            x: isActive ? fgMouseX : undefined,
          }}
        >
          <Media
            resource={foregroundImage}
            fill
            imgClassName="object-contain object-bottom"
          />
        </motion.div>
      )}

      {/* ── Next button — bottom-right (active slide only) ───────────── */}
      {isActive && (
        <div className="absolute bottom-6 right-6 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onAdvance()
            }}
            className={cn(
              'bg-background/80 backdrop-blur-sm border border-border',
              'rounded-full px-4 py-2 type-label-sm text-foreground',
              'hover:bg-background/95 transition-colors duration-150 cursor-pointer',
            )}
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Mouse-tracking badge (inactive slides only) ──────────────── */}
      {!isActive && (
        <div
          className={cn(
            'absolute pointer-events-none z-20 transition-opacity duration-150',
            'bg-background/80 backdrop-blur-sm border border-border',
            'rounded-full px-3 py-1.5 type-label-sm text-foreground',
            '-translate-x-1/2 -translate-y-1/2',
            badgeVisible ? 'opacity-100' : 'opacity-0',
          )}
          style={{ left: badgePos.x, top: badgePos.y }}
        >
          {direction === 'prev' ? '← Prev' : 'Next →'}
        </div>
      )}
    </motion.div>
  )

  // Wrap the whole slide in CMSLink if there's a valid link on the active slide
  if (hasLink && isActive) {
    return (
      <CMSLink
        type={link.type}
        url={link.url}
        reference={link.reference as any}
        newTab={link.newTab}
        className="block"
      >
        {slideInner}
      </CMSLink>
    )
  }

  return slideInner
}
