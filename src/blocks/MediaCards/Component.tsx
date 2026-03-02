import React from 'react'
import type { MediaCardsBlock as MediaCardsBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { ChevronRight } from 'lucide-react'

export const MediaCardsBlock: React.FC<MediaCardsBlockType> = ({ backgroundMedia, intro, items }) => {
  const hasBackgroundMedia = backgroundMedia && typeof backgroundMedia === 'object'

  return (
    <section className="py-4 md:py-8 relative">
      {hasBackgroundMedia && (
        <div className="absolute w-full aspect-16/7 overflow-hidden mb-8 md:mb-16">
          <Media
            resource={backgroundMedia}
            fill
            imgClassName="object-cover"
            className="absolute inset-0 -inset-y-20"
            videoClassName="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
      <div className="mx-auto max-w-7xl px-6 z-0 relative">
        <div className="mx-auto max-w-6xl text-center pt-24 pb-120 relative">
          {intro && (
            <>
              <div className="absolute -z-10 inset-0 bg-background/60 backdrop-blur-xs pointer-events-none" />
              <RichText
                data={intro}
                enableGutter={false}
                className="[&_h2]:type-headline-1 [&_h2]:text-foreground [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-foreground [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-foreground [&_p]:type-body-xl [&_p]:leading-snug"
              />
            </>
          )}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 -mt-100">
            {items.map((item) => {
              const { id, richText, media, link } = item
              const hasImage = media && typeof media === 'object'
              const hasLink = link && (link.url || (link.type === 'reference' && link.reference))

              const cardContent = (
                <>
                  {/* Background image with zoom on hover */}
                  {hasImage ? (
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                      <Media
                        resource={media}
                        fill
                        imgClassName="object-cover"
                        className="w-full h-full"
                        videoClassName="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-border to-muted" />
                  )}

                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/90 to-transparent transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Bottom: text + chevron */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                    {richText && (
                      <RichText
                        data={richText}
                        enableGutter={false}
                        className="[&_h3]:text-4xl [&_h3]:font-normal [&_h3]:text-foreground [&_h3]:leading-snug [&_h4]:text-3xl [&_h4]:font-normal [&_h4]:text-foreground [&_p]:mt-2 [&_p]:type-body-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed"
                      />
                    )}
                    <div className="shrink-0 translate-x-1 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                      <ChevronRight className="size-5 text-muted-foreground" />
                    </div>
                  </div>
                </>
              )

              const cardClassName = "group relative min-h-[580px] overflow-hidden rounded-none bg-muted"

              if (hasLink) {
                return (
                  <CMSLink
                    key={id}
                    type={link.type}
                    url={link.url}
                    reference={link.reference as any}
                    newTab={link.newTab}
                    className={cardClassName}
                  >
                    {cardContent}
                  </CMSLink>
                )
              }

              return (
                <div key={id} className={cardClassName}>
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
