import React from 'react'
import type { MediaCardsBlock as MediaCardsBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const MediaCardsBlock: React.FC<MediaCardsBlockType> = ({ backgroundMedia, intro, items }) => {
  const hasBackgroundMedia = backgroundMedia && typeof backgroundMedia === 'object'

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {hasBackgroundMedia && (
        <div className="absolute inset-0 w-full h-[40vh] md:h-[60vh] overflow-hidden">
          <Media
            resource={backgroundMedia}
            fill
            imgClassName="object-cover"
            className="absolute inset-0"
            videoClassName="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle overlay for the background media to ensure intro text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/40 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        {intro && (
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
            <RichText
              data={intro}
              enableGutter={false}
              className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_h3]:type-headline-2 [&_h3]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-body [&_p]:mt-6"
            />
          </div>
        )}

        {Array.isArray(items) && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {items.map((item) => {
              const { id, richText, media, link } = item
              const hasImage = media && typeof media === 'object'
              const hasLink = link && (link.url || (link.type === 'reference' && link.reference))

              const cardContent = (
                <div className="relative h-full flex flex-col group">
                  {/* Background Media Container */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {hasImage ? (
                      <Media
                        resource={media}
                        fill
                        imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                    
                    {/* Multi-layer Gradient Overlay for maximum readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent opacity-85 group-hover:opacity-100 group-hover:via-black/70 transition-all duration-500" />
                    <div className="absolute inset-0 bg-linear-to-b from-black/30 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                  </div>

                  {/* Content Container */}
                  <div className="relative z-10 flex flex-col h-full min-h-[420px] p-8 mt-auto justify-end">
                    {richText && (
                      <div className="relative transition-all duration-500 ease-in-out group-hover:-translate-y-1">
                        <RichText
                          data={richText}
                          enableGutter={false}
                          className="[&_h3]:type-headline-4 [&_h3]:text-white [&_h3]:mb-3 [&_h4]:type-title-lg [&_h4]:text-white [&_h4]:mb-2 [&_p]:type-body-md [&_p]:text-white/90 [&_p]:leading-relaxed [&_p]:line-clamp-4 md:[&_p]:line-clamp-2 group-hover:[&_p]:line-clamp-none transition-all duration-500"
                        />
                      </div>
                    )}
                    
                    {/* Decorative bar that expands on hover */}
                    <div className="w-12 h-1 bg-brand-500 mt-6 transition-all duration-500 group-hover:w-24 group-hover:bg-brand-400" />
                  </div>
                </div>
              )

              const cardWrapperClasses = "relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-2 group"

              if (hasLink) {
                return (
                  <CMSLink
                    key={id}
                    {...link}
                    className={cardWrapperClasses}
                    noStyling
                  >
                    {cardContent}
                  </CMSLink>
                )
              }

              return (
                <div key={id} className={cardWrapperClasses}>
                  {cardContent}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
