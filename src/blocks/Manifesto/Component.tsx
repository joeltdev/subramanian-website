'use client'
import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { Download } from 'lucide-react'

// Local type for the block until types are regenerated
type ManifestoBlockType = Extract<Page['layout'][0], { blockType: 'tharoorManifesto' }>

export const ManifestoBlock: React.FC<ManifestoBlockType> = ({
  variant,
  theme = 'light',
  intro,
  content,
  image,
  linkTitle = 'Download PDF',
  manifestoLinks,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const isTextLeft = variant === 'textLeft'

  return (
    <section 
      ref={ref}
      data-section-theme={theme}
      className="py-16 md:py-24 overflow-hidden bg-background text-foreground transition-colors duration-500"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Intro Heading - Left-aligned across all sizes */}
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 md:mb-20 text-left w-full"
          >
            <RichText
              data={intro}
              enableGutter={false}
              enableProse={false}
              className="w-full max-w-none font-malayalam [&_h2]:type-title-xl md:[&_h2]:type-headline-2 [&_h2]:font-bold md:[&_h2]:font-extrabold [&_h2]:text-type-heading [&_h2]:mb-0 [&_h2]:no-underline md:[&_h2]:underline [&_h2]:decoration-foreground/20 [&_h2]:underline-offset-[16px] [&_h2]:decoration-2"
            />
          </motion.div>
        )}

        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start", 
          !isTextLeft && "md:grid-cols-[1fr_0.85fr]" // Slightly asymmetric for better balance
        )}>
          {/* Text Content Column */}
          <motion.div
            initial={{ opacity: 0, x: isTextLeft ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={cn(
              "flex flex-col space-y-8",
              !isTextLeft && "md:order-2"
            )}
          >
            <div className="max-w-xl md:max-w-2xl">
              <RichText
                data={content}
                enableGutter={false}
                className={cn(
                  "text-left font-malayalam",
                  // Malayalam-specific typography
                  "[&_p]:type-body-md [&_p]:text-type-body [&_p]:mb-8",
                  "[&_p]:[line-height:1.85] md:[&_p]:[line-height:2.0]",
                  "[&_h3]:type-headline-4 [&_h3]:text-type-heading [&_h3]:mb-8",
                  "[&_h4]:type-title-xl [&_h4]:text-type-heading [&_h4]:mb-6",
                  // Ensure bullet points are styled too
                  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-4 [&_ul]:mb-10 [&_li]:type-body-sm [&_li]:text-type-body"
                )}
              />
            </div>
          </motion.div>

          {/* Image & Download Column - Sticky on Desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: isTextLeft ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className={cn(
              "flex flex-col items-start space-y-10", 
              "md:sticky md:top-32 md:self-start", // STICKY PINNING
              !isTextLeft && "md:order-1"
            )}
          >
            {/* PDF Mockup Container */}
            <div className="relative aspect-[3/4.2] w-full max-w-sm md:max-w-md shadow-2xl transition-transform hover:rotate-1 duration-500 group">
              {image && typeof image === 'object' && (
                <Media 
                  resource={image} 
                  fill 
                  imgClassName="object-cover object-top border border-border/20 rounded-none shadow-2xl"
                />
              )}
              
              {/* Subtle paper-like reflection overlay */}
              <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-white/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              
              {/* Depth Shadow for "Mockup" feel */}
              <div className="absolute -bottom-6 -right-6 -left-6 h-12 bg-black/10 blur-3xl -z-10" />
            </div>

            {/* Download Section: Title + Button */}
            {manifestoLinks && manifestoLinks.length > 0 && (
              <div className="flex flex-col items-start space-y-5 pt-4 w-full max-w-sm md:max-w-md">
                {linkTitle && (
                  <p className="type-title-md md:type-title-lg tracking-tight text-type-heading font-bold md:font-extrabold uppercase no-underline md:underline decoration-primary/30 underline-offset-8 decoration-2">
                    {linkTitle}
                  </p>
                )}
                {manifestoLinks.map(({ link, id }) => (
                  <CMSLink 
                    key={id} 
                    {...link} 
                    className={cn(
                      "group w-full md:w-auto min-w-[260px] h-[58px] px-8 rounded-full",
                      "flex items-center justify-start gap-3",
                      "font-bold uppercase tracking-widest text-sm transition-all duration-300",
                      "shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20",
                      "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98]",
                      "border-none"
                    )}
                  >
                    <Download className="size-5 transition-transform duration-300 group-hover:-translate-y-1" />
                  </CMSLink>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
