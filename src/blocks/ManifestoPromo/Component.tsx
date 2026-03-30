'use client'
import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { Page, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { ArrowRight } from 'lucide-react'

type ManifestoPromoBlockType = Extract<Page['layout'][0], { blockType: 'manifestoPromo' }>

export const ManifestoPromoBlock: React.FC<ManifestoPromoBlockType> = ({
  backgroundImage,
  mobileBackgroundImage,
  backgroundPosition = 'center',
  theme = 'brand',
  title,
  description,
  cta,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const posClasses = {
    center: 'object-center',
    left: 'object-left',
    right: 'object-right',
    top: 'object-top',
    bottom: 'object-bottom',
  }

  return (
    <section 
      ref={ref}
      className={cn(
        "relative flex flex-col w-full overflow-hidden",
        "justify-end min-h-[100svh] pb-12 pt-[55vh]", 
        "md:justify-center md:min-h-0 md:py-48"
      )}
      data-section-theme={theme}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        {/* Desktop Image */}
        {backgroundImage && typeof backgroundImage === 'object' && (
          <Media 
            resource={backgroundImage} 
            fill 
            className={cn(mobileBackgroundImage && "hidden md:block")}
            imgClassName={cn("object-cover", mobileBackgroundImage ? "object-center" : posClasses[backgroundPosition || 'center'])}
            priority
          />
        )}
        
        {/* Mobile-specific Image */}
        {mobileBackgroundImage && typeof mobileBackgroundImage === 'object' && (
          <Media 
            resource={mobileBackgroundImage} 
            fill 
            className="md:hidden"
            imgClassName={cn("object-cover", posClasses[backgroundPosition || 'center'])}
            priority
          />
        )}
        
        {/* Overlay for readability - gradient to ensure text readability at the bottom while keeping the face clear at the top */}
        <div className={cn(
          "absolute inset-0",
          theme === 'brand' ? "bg-linear-to-t from-brand-950/95 via-brand-950/60 to-brand-950/10" 
          : theme === 'light' ? "bg-linear-to-t from-white/95 via-white/60 to-white/10"
          : "bg-linear-to-t from-black/95 via-black/50 to-transparent" // Default dark overlay
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
                "mb-10 md:mb-14 font-malayalam",
                "[&_h2]:type-headline-3 md:[&_h2]:type-headline-1 [&_h2]:text-white [&_h2]:font-bold md:[&_h2]:font-extrabold [&_h2]:mb-0",
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
                  "text-white/90 type-body-lg md:type-title-xl md:font-medium max-w-3xl leading-relaxed",
                  theme === 'light' && "text-type-body"
                )}
              />
            </motion.div>
          )}

          {/* CTA Button */}
          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <CMSLink 
                {...cta} 
                className={cn(
                  "group h-16 px-12 rounded-none", // Sharp corners per GEMINI.md
                  "flex items-center justify-center gap-4",
                  "type-label-lg tracking-[0.2em] transition-all duration-300",
                  "bg-primary text-type-inverse shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]",
                  "hover:bg-primary/90"
                )}
              >
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-2" />
              </CMSLink>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
