'use client'
import React from 'react'
import type { MediaCardsBlock as MediaCardsBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { motion } from 'motion/react'

export const MediaCardsBlock: React.FC<MediaCardsBlockType & { slug?: string }> = ({ 
  backgroundMedia, 
  intro, 
  items,
  slug 
}) => {
  const hasBackgroundMedia = backgroundMedia && typeof backgroundMedia === 'object'
  const isManifesto = slug === 'tharoor-manifesto'

  return (
    <section className={`relative py-20 md:py-32 overflow-hidden ${isManifesto ? 'bg-background' : ''}`}>
      {hasBackgroundMedia && (
        <div className="absolute inset-0 w-full h-[40vh] md:h-[60vh] overflow-hidden">
          <Media
            resource={backgroundMedia}
            fill
            imgClassName="object-cover"
            className="absolute inset-0"
            videoClassName="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/40 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        {intro && (
          <div className={`max-w-4xl mx-auto text-center ${isManifesto ? 'mb-20 md:mb-28' : 'mb-16 md:mb-24'}`}>
            <RichText
              data={intro}
              enableGutter={false}
              className="[&_h2]:type-display [&_h2]:text-type-heading [&_h3]:type-headline-1 [&_h3]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-body [&_p]:mt-8 [&_p]:max-w-2xl [&_p]:mx-auto"
            />
          </div>
        )}

        {Array.isArray(items) && items.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isManifesto ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-8 md:gap-12`}>
            {items.map((item, index) => {
              const { id, richText, media } = item
              const hasImage = media && typeof media === 'object'

              return (
                <motion.div 
                  key={id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="group relative flex flex-col overflow-hidden bg-muted border border-border/40 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/5 hover:-translate-y-2 cursor-pointer"
                >
                  <div className={`relative w-full ${isManifesto ? 'aspect-[4/5]' : 'aspect-square md:aspect-[3/4]'} overflow-hidden`}>
                    {/* Background Media */}
                    <div className="absolute inset-0 z-0">
                      {hasImage ? (
                        <Media
                          resource={media}
                          fill
                          imgClassName="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}

                      {/* Premium Gradients */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full p-8 md:p-10 justify-end">
                      {richText && (
                        <div className="relative transform transition-all duration-500 group-hover:-translate-y-2">
                          <RichText
                            data={richText}
                            enableGutter={false}
                            className="text-white [&_*]:text-white [&_h3]:type-headline-3 [&_h3]:font-bold [&_h3]:mb-4 [&_h4]:type-title-lg [&_h4]:mb-3 [&_p]:type-body-md [&_p]:leading-relaxed [&_p]:opacity-90 [&_p]:line-clamp-3 group-hover:[&_p]:line-clamp-none transition-all duration-500"
                          />
                          
                          {/* Accent line */}
                          <div className="w-12 h-1 bg-brand-500 mt-8 transition-all duration-700 group-hover:w-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
