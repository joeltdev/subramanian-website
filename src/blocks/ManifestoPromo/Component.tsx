'use client'
import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { Page, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type ManifestoPromoBlockType = Extract<Page['layout'][0], { blockType: 'manifestoPromo' }>

export const ManifestoPromoBlock: React.FC<ManifestoPromoBlockType> = ({
  backgroundImage,
  theme = 'brand',
  title,
  description,
  cta,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section 
      ref={ref}
      className="relative w-full overflow-hidden py-24 md:py-32"
      data-section-theme={theme}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        {backgroundImage && typeof backgroundImage === 'object' && (
          <Media 
            resource={backgroundImage} 
            fill 
            imgClassName="object-cover object-center"
            priority
          />
        )}
        {/* Overlay for readability - adjusts based on theme but usually dark for image promos */}
        <div className={cn(
          "absolute inset-0 bg-black/60", // Default dark overlay
          theme === 'brand' && "bg-brand-950/70",
          theme === 'light' && "bg-white/40"
        )} />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <RichText
              data={title}
              enableGutter={false}
              enableProse={false}
              className={cn(
                "mb-6 font-malayalam",
                "[&_h2]:type-headline-2 [&_h2]:text-white [&_h2]:font-bold md:[&_h2]:font-extrabold [&_h2]:mb-0",
                theme === 'light' && "[&_h2]:text-type-heading"
              )}
            />
          </motion.div>

          {/* Description */}
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <RichText
                data={description}
                enableGutter={false}
                className={cn(
                  "mb-10 font-malayalam",
                  "text-white/90 type-body-xl max-w-2xl leading-relaxed",
                  theme === 'light' && "text-type-body"
                )}
              />
            </motion.div>
          )}

          {/* CTA Button */}
          {cta && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <CMSLink 
                {...cta} 
                className={cn(
                  "h-14 px-10 rounded-none", // Sharp corners per GEMINI.md
                  "text-sm font-bold uppercase tracking-widest transition-all duration-300",
                  "bg-white text-brand-950 hover:bg-brand-500 hover:text-white",
                  theme === 'light' && "bg-brand-500 text-white hover:bg-black"
                )}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
