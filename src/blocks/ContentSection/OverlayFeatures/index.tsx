'use client'
import React, { useState, useEffect } from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'
import { cn } from '@/utilities/ui'
import { motion } from 'motion/react'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = (props) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section className="py-16 md:py-24 overflow-hidden" data-section-theme={props.theme || 'brand'}>
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header - Matched to Gallery/HomeSlider Style */}
        {props.intro && (
          <div className="mb-16 md:mb-24">
            <div className="max-w-3xl">
              <RichText
                data={props.intro}
                enableGutter={false}
                className="[&_h2]:type-display-lg [&_h2]:text-type-heading [&_h2]:tracking-tight [&_h3]:type-headline-1 [&_h3]:text-type-heading [&_h3]:tracking-widest [&_h3]:uppercase [&_h3]:mb-4 [&_p]:type-title-md [&_p]:text-type-secondary [&_p]:max-w-2xl [&_p]:mt-6 md:[&_p]:mt-0"
              />
            </div>
          </div>
        )}

        {isMobile ? (
          <MobileTimeline {...props} />
        ) : (
          <DesktopTimeline {...props} />
        )}
      </div>
    </section>
  )
}

const MobileTimeline: React.FC<ContentSectionBlock> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  
  if (!items) return null

  return (
    <div className="flex flex-col gap-10">
      {items.map((item, index) => {
        const isExpanded = expandedIndex === index
        const Icon = item.icon ? iconMap[item.icon] : null
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative"
          >
            <div className="flex gap-6">
              {/* Timeline Marker */}
              <div className="flex flex-col items-center shrink-0">
                <div className="size-12 rounded-full border border-border bg-background flex items-center justify-center text-type-heading font-bold type-title-sm z-10">
                  {index + 1}
                </div>
                {index !== items.length - 1 && (
                  <div className="w-px h-full bg-border/40 mt-4" />
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 pb-4">
                <div className="bg-muted p-8 border border-border/40 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  {Icon && <Icon className="size-10 text-brand-500 mb-6" />}
                  {item.richText && (
                    <div className="relative">
                      <RichText
                        data={item.richText}
                        enableGutter={false}
                        className={cn(
                          "transition-all duration-500",
                          "[&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:mb-4",
                          "[&_h4]:type-title-lg [&_h4]:text-type-heading [&_h4]:mb-3",
                          "[&_p]:type-body-md [&_p]:text-type-secondary [&_p]:leading-relaxed",
                          isExpanded ? "[&_p]:line-clamp-none" : "[&_p]:line-clamp-4"
                        )}
                      />
                      {/* Simple "Read more" detection based on arbitrary length */}
                      <button 
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="mt-6 text-brand-500 text-[11px] uppercase tracking-widest font-bold underline underline-offset-4 decoration-brand-500/30 hover:decoration-brand-500 transition-all"
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

const DesktopTimeline: React.FC<ContentSectionBlock> = ({ items, imageDark }) => {
  if (!items) return null

  return (
    <div className="grid grid-cols-12 gap-12 lg:gap-24 relative">
      {/* Left Column: Milestones */}
      <div className="col-span-7 space-y-32 py-12">
        {items.map((item, index) => {
          const Icon = item.icon ? iconMap[item.icon] : null
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-16 group"
            >
              {/* Number Marker */}
              <div className="absolute left-0 top-0 flex items-center justify-center">
                <span className="type-display-md text-border/40 group-hover:text-brand-500/20 transition-colors duration-500 select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="max-w-xl">
                {Icon && (
                  <div className="size-16 rounded-none bg-muted flex items-center justify-center mb-10 border border-border/20 transition-all duration-500 group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="size-8" />
                  </div>
                )}
                {item.richText && (
                  <RichText
                    data={item.richText}
                    enableGutter={false}
                    className="[&_h3]:type-display-sm [&_h3]:text-type-heading [&_h3]:mb-6 [&_h3]:tracking-tight [&_h4]:type-title-xl [&_h4]:text-type-heading [&_h4]:mb-4 [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:leading-relaxed [&_p]:max-w-md"
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Right Column: Sticky Media Display */}
      <div className="col-span-5 relative">
        <div className="sticky top-32 aspect-[3/4] overflow-hidden bg-muted group">
          {/* Main Display Image */}
          {typeof imageDark === 'object' && imageDark && (
            <Media
              resource={imageDark}
              fill
              className="w-full h-full"
              imgClassName="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          )}
          
          {/* Subtle Overlay Accent */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />
          
          {/* Detail Decoration */}
          <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
            <div className="h-px w-12 bg-white/40" />
            <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase vertical-text">
              Leadership Profile
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
