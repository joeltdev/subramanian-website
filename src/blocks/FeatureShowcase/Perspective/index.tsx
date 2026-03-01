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
    <section ref={sectionRef} className="overflow-hidden py-8 md:py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-12">

        <motion.div
          className="relative z-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-1 [&_h2]:text-type-body [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />}
        </motion.div>

        {hasImages && (
          <motion.div
            ref={imageRef}
            className="mask-b-from-75% mask-l-from-75% mask-b-to-95% mask-l-to-95% relative -mx-4 pr-3 pt-3 md:-mx-12"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isImageInView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="perspective-midrange">
              <div className="rotate-x-6 -skew-2">
                <div className="relative aspect-[88/36] overflow-hidden rounded-xl shadow-2xl ring-1 ring-slate-200/60">

                  {/* Background — entry fade, then parallax drifts down on scroll */}
                  <motion.div
                    className="absolute inset-0 h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={isImageInView ? { opacity: 1 } : undefined}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
                  >
                    {/* -inset-y-16 gives 64px headroom so the 60px bgY never clips */}
                    <motion.div className="absolute -inset-y-16 inset-x-0" style={{ y: bgY }}>
                      {typeof imageLight === 'object' && imageLight && (
                        <Media resource={imageLight} fill className="dark:hidden" imgClassName="object-cover object-top" />
                      )}
                      {typeof imageDark === 'object' && imageDark && (
                        <Media resource={imageDark} fill className="hidden dark:block" imgClassName="object-cover object-top" />
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Foreground — delayed entry slides up from below, then counter-parallax floats up on scroll */}
                  {typeof imageForeground === 'object' && imageForeground && (
                    <motion.div
                      className="absolute inset-0 mx-auto w-10/12 p-6"
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
              </div>
            </div>
          </motion.div>
        )}

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
                <div key={id} className="space-y-3 rounded-lg bg-muted px-6 py-8">
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-slate-400" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="space-y-2 [&_h4]:py-1 [&_h4]:type-title-md [&_h4]:text-slate-800 [&_h3]:type-title-xl [&_h3]:text-slate-800 [&_h3]:py-1 [&_p]:type-body-md [&_p]:text-type-secondary [&_p]:leading-relaxed" />}
                </div>
              )
            })}
          </motion.div>
        )}

      </div>
    </section>
  )
}
