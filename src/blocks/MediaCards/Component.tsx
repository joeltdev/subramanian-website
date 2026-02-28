import React from 'react'
import type { MediaCardsBlock as MediaCardsBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { ChevronRight } from 'lucide-react'

export const MediaCardsBlock: React.FC<MediaCardsBlockType> = ({ intro, items }) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {intro && (
            <RichText
              data={intro}
              enableGutter={false}
              className="[&_h2]:text-5xl [&_h2]:text-slate-700 [&_h2]:leading-[1.1] [&_h2]:font-semibold [&_h2]:mb-6 [&_h3]:text-3xl [&_h3]:text-slate-700 [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-slate-600 [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light"
            />
          )}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
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
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
                  )}

                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900/90 to-transparent transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Bottom: text + chevron */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                    {richText && (
                      <RichText
                        data={richText}
                        enableGutter={false}
                        className="[&_h3]:text-4xl [&_h3]:font-normal [&_h3]:text-white [&_h3]:leading-snug [&_h4]:text-3xl [&_h4]:font-normal [&_h4]:text-white [&_p]:mt-2 [&_p]:text-sm [&_p]:text-white/65 [&_p]:leading-relaxed"
                      />
                    )}
                    <div className="shrink-0 translate-x-1 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                      <ChevronRight className="size-5 text-white/70" />
                    </div>
                  </div>
                </>
              )

              const cardClassName = "group relative min-h-[580px] overflow-hidden rounded-2xl bg-slate-100"

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
