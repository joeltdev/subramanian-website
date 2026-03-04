'use client'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'motion/react'
import type { FeatureShowcaseBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

export const SplitFeatureShowcase: React.FC<FeatureShowcaseBlock> = ({
  intro,
  imageForeground,
  imageDark,
  imageLight,
  items,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const isImageInView = useInView(sectionRef, { once: true, margin: '-5% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Subtle bg parallax drifts down; fg counter-parallax floats up
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 30])
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const hasBgImages = imageDark || imageLight
  const hasForeground = typeof imageForeground === 'object' && imageForeground

  return (
    <section ref={sectionRef} className="relative py-4 md:py-24 overflow-hidden">

      {/* Full-viewport-width background image with subtle parallax */}
      {hasBgImages && (
        // Outer div breaks out of any parent max-width using the 50vw bleed trick
        <div className="absolute inset-y-0" style={{ left: '50%', marginLeft: '-50vw', width: '100vw' }}>
          <motion.div
            className="absolute inset-x-0 -inset-y-8"
            initial={{ opacity: 0 }}
            animate={isImageInView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
            style={{ y: bgY }}
          >
            {typeof imageLight === 'object' && imageLight && (
              <Media resource={imageLight} fill className="dark:hidden" imgClassName="object-cover object-top" />
            )}
            {typeof imageDark === 'object' && imageDark && (
              <Media resource={imageDark} fill className="hidden dark:block" imgClassName="object-cover object-top" />
            )}
          </motion.div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-6 md:grid md:max-w-7xl md:gap-32 md:grid-cols-2 md:space-y-0">

        <motion.div
          className="relative w-full flex-1 z-10 md:py-24 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-2 [&_h2]:text-type-body [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />}
        </motion.div>

        {hasForeground && (
          <motion.div
            className="relative w-full flex-1 min-h-[360px] md:min-h-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isImageInView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 mx-auto p-6 w-10/12"
              initial={{ opacity: 0, y: 24 }}
              animate={isImageInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            >
              <motion.div className="absolute inset-0" style={{ y: fgY }}>
                <Media resource={imageForeground} fill imgClassName="object-contain object-top" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

      </div>

      <div className="relative z-10 mx-auto mt-4 max-w-7xl space-y-12 px-6 md:mt-8" data-theme="dark">
        {Array.isArray(items) && items.length > 0 && (
          <motion.div
            className="relative mx-auto grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-4 lg:grid-cols-4"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.48 }}
          >
            {items.map(({ id, icon, richText }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className="space-y-3 bg-background shadow-xs rounded px-6 py-8">
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-6 text-primary" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="space-y-2 [&_h4]:text-type-heading [&_h4]:type-title-sm [&_h3]:text-type-heading [&_h3]:type-title-md [&_p]:type-body-md [&_p]:text-type-body [&_p]:leading-relaxed" />}
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
