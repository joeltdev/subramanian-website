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
        "relative flex flex-col w-full",
        "md:overflow-hidden md:justify-center md:min-h-0 md:py-48"
      )}
      data-section-theme={theme}
    >
      {/* Background Image (Desktop) / Top Image (Mobile) */}
      <div className={cn(
        "relative w-full h-[60svh]", // Mobile: top image, 60svh
        "md:absolute md:inset-0 md:-z-10 md:h-auto" // Desktop: absolute background
      )}>
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
        
        {/* Overlay for readability - Desktop only since mobile uses a solid card */}
        <div className={cn(
          "hidden md:block absolute inset-0",
          theme === 'brand' ? "bg-linear-to-t from-brand-950/95 via-brand-950/60 to-brand-950/10" 
          : theme === 'light' ? "bg-linear-to-t from-white/95 via-white/60 to-white/10"
          : "bg-linear-to-t from-black/95 via-black/50 to-transparent" // Default dark overlay
        )} />
      </div>

      <div className={cn(
        "relative z-10 px-4 sm:px-6", // Mobile: standard padding
        "md:mx-auto md:max-w-7xl md:px-8", // Desktop: centering and padding
        "-mt-20 sm:-mt-24 pb-12", // Mobile: overlap image, padding bottom
        "md:mt-0 md:pb-0" // Desktop: reset overlap & padding
      )}>
        <div className={cn(
          "flex flex-col text-left items-start", // Mobile stack approach
          "bg-white p-6 sm:p-8 shadow-2xl", // Mobile white card overlaying the image
          "md:bg-transparent md:p-0 md:shadow-none md:items-center md:text-center md:max-w-4xl md:mx-auto" // Desktop original structural style
        )}>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <RichText
              data={title}
              enableGutter={false}
              enableProse={false}
              className={cn(
                "mb-6 md:mb-14 font-malayalam",
                "[&_h2]:type-headline-3 md:[&_h2]:type-headline-1",
                "[&_h2]:text-brand-900 md:[&_h2]:text-white", // Mobile: blue title, Desktop: white title
                "[&_h2]:font-bold md:[&_h2]:font-extrabold [&_h2]:mb-0",
                theme === 'light' && "md:[&_h2]:text-type-heading" // Reset to dark if theme is light on MD
              )}
            />
          </motion.div>

          {/* Description */}
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="w-full"
            >
              <RichText
                data={description}
                enableGutter={false}
                className={cn(
                  "mb-8 md:mb-10 font-malayalam",
                  "text-type-body md:text-white/90 md:type-title-xl md:font-medium max-w-3xl md:leading-relaxed",
                  "type-body-lg",
                  theme === 'light' && "md:text-type-body"
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
              className="w-full md:w-auto mt-auto"
            >
              <CMSLink 
                {...cta} 
                className={cn(
                  "group h-14 px-10 rounded-none w-full md:w-auto", // Sharp corners per GEMINI.md
                  "flex items-center justify-center gap-3",
                  "text-sm font-bold uppercase tracking-widest transition-all duration-300",
                  "bg-brand-500 text-white md:bg-white md:text-brand-950 hover:bg-brand-600 md:hover:bg-brand-500 md:hover:text-white", // Mobile uses blue bg
                  theme === 'light' && "md:bg-brand-500 md:text-white md:hover:bg-black"
                )}
              >
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </CMSLink>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
