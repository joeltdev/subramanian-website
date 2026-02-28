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
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const isImageInView = useInView(imageRef, { once: true, margin: '-5% 0px' })

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })

  // Pronounced parallax — bg drifts down, fg floats up
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const hasImages = imageForeground || imageDark || imageLight

  return (
    <section ref={sectionRef} className="py-8 md:py-16">
      <div className="mx-auto max-w-7xl space-y-12 px-6 md:grid md:max-w-7xl md:gap-32 md:grid-cols-2 md:space-y-0">

        <motion.div
          className="relative w-full flex-1 z-10 md:py-24 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:text-5xl [&_h2]:text-slate-700 [&_h2]:leading-[1.1] [&_h2]:font-semibold [&_h2]:mb-6 [&_h3]:text-3xl [&_h3]:text-slate-700 [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-slate-600 [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light" />}
        </motion.div>

        {hasImages && (
          <motion.div
            ref={imageRef}
            className="px-3 w-full flex-1 pt-3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isImageInView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="mask-b-from-75% mask-b-to-90% relative h-full w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-slate-200/60">

              {/* Background — entry fade, then parallax drifts down on scroll */}
              <motion.div
                className="absolute inset-0 h-full w-full"
                initial={{ opacity: 0 }}
                animate={isImageInView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
              >
                {/* -inset-y-16 gives 64px headroom so the 60px bgY never clips */}
                <motion.div className="absolute h-full -inset-y-16 inset-x-0" style={{ y: bgY }}>
                  {typeof imageLight === 'object' && imageLight && (
                    <Media resource={imageLight} fill className="dark:hidden h-full" imgClassName="object-cover object-top" />
                  )}
                  {typeof imageDark === 'object' && imageDark && (
                    <Media resource={imageDark} fill className="hidden dark:block h-full" imgClassName="object-cover object-top" />
                  )}
                </motion.div>
              </motion.div>

              {/* Foreground — delayed entry slides up from below, then counter-parallax floats up on scroll */}
              {typeof imageForeground === 'object' && imageForeground && (
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
              )}

            </div>
          </motion.div>
        )}
      </div>
      <div className="mx-auto mt-4 max-w-7xl space-y-12 px-6 md:mt-8">

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
                <div key={id} className="space-y-3 rounded-lg bg-gray-50 px-6 py-8">
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-slate-400" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="space-y-2 [&_h4]:py-1 [&_h4]:text-lg [&_h4]:font-medium [&_h4]:text-slate-800 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-slate-800 [&_h3]:py-1 [&_p]:text-base [&_p]:text-slate-500 [&_p]:font-normal [&_p]:leading-relaxed" />}
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
