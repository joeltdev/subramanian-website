'use client'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'motion/react'
import type { FeatureShowcaseBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

export const PerspectiveFeatureShowcase: React.FC<FeatureShowcaseBlock> = ({
  intro,
  imageForeground,
  imageDark,
  imageLight,
  items,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const isImageInView = useInView(imageRef, { once: true, margin: '-5% 0px' })

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const hasImages = imageForeground || imageDark || imageLight

  return (
    <section ref={sectionRef} className="relative md:py-24 md:space-y-8 overflow-hidden" data-section-theme="dark">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-6 md:space-y-12">
        <motion.div
          className="relative z-10"
          data-section-theme="light"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
                    {intro && <RichText data={intro} enableGutter={false} className="flex flex-col md:flex-row gap-8 [&_h2]:flex-1 [&_h3]:flex-1 [&_p]:flex-1 [&_h2]:type-headline-2 md:[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_h2]:mb-8 md:[&_h2]:mb-0 [&_h2]:break-words [&_h2]:leading-tight [&_h2]:max-w-full [&_h2]:px-4 [&_h2]:mx-auto [&_h3]:type-headline-2 md:[&_h3]:type-headline-1 [&_h3]:text-type-heading [&_h3]:mb-8 md:[&_h3]:mb-0 [&_h3]:break-words [&_h3]:leading-tight [&_h3]:max-w-full [&_h3]:px-4 [&_h3]:mx-auto [&_p]:text-type-body [&_p]:type-body-lg md:[&_p]:type-body-xl [&_p]:font-medium [&_p]:leading-relaxed" />}
        </motion.div>
      </div>

      {/* Background — entry fade, then parallax drifts down on scroll */}
      <motion.div
        className="h-auto aspect-88/24 px-6 w-full mx-auto relative"
        initial={{ opacity: 0 }}
        animate={isImageInView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
      >
        {/* -inset-y-16 gives 64px headroom so the 60px bgY never clips */}
        <motion.div className="absolute h-full inset-x-0" style={{ y: bgY }}>
          {typeof imageLight === 'object' && imageLight && (
            <Media resource={imageLight} fill className="dark:hidden" imgClassName="object-cover object-top" />
          )}
          {typeof imageDark === 'object' && imageDark && (
            <Media resource={imageDark} fill className="hidden dark:block" imgClassName="object-cover object-top" />
          )}
        </motion.div>

        {hasImages && (
          <motion.div
            ref={imageRef}
            className="mx-auto pr-3 py-0 max-w-7xl h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isImageInView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >


            <div className="relative h-full w-full overflow-hidden drop-shadow-2xl">
              {/* Foreground — delayed entry slides up from below, then counter-parallax floats up on scroll */}
              {typeof imageForeground === 'object' && imageForeground && (
                <motion.div
                  className="absolute inset-0 mx-auto w-10/12 p-6 translate-y-8"
                  initial={{ opacity: 0, y: 24 }}
                  animate={isImageInView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                >
                  <motion.div className="absolute inset-0" style={{ y: fgY }}>
                    <Media resource={imageForeground} fill imgClassName="object-contain object-top" />
                  </motion.div>
                </motion.div>
              )}

            </div>

          </motion.div>
        )}
      </motion.div>
      <div className="mx-auto max-w-7xl space-y-8 px-6 md:pt-20">
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
                <div key={id} className="space-y-3 bg-muted shadow-xs rounded-none px-6 py-8">
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-6 text-primary" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="space-y-2 [&_h4]:text-type-heading [&_h4]:type-title-sm [&_h3]:text-type-heading [&_h3]:text-type-title-md [&_p]:type-body-md [&_p]:text-type-body [&_p]:leading-relaxed" />}
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
