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
          <div className="w-full h-3/4 absolute z-0 inset-0  bg-linear-to-b from-white to-transparent pointer-events-none" />
        </div>
      )}
      <div className="mx-auto max-w-7xl px-6 z-0 relative">
        <div className="mx-auto max-w-6xl text-center pt-24 pb-120 relative">
          {intro && (
            <>
              <RichText
                data={intro}
                enableGutter={false}
                className="[&_h2]:type-headline-1 [&_h2]:text-foreground [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-foreground [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:hidden drop-shadow-md"
              />
              <p className="text-foreground type-body-xl font-medium leading-relaxed mt-8 drop-shadow-md mx-auto max-w-4xl">
                പൊതു സേവനത്തിലും സാമൂഹിക പ്രവർത്തനങ്ങളിലും സജീവമായി പ്രവർത്തിച്ച കെ.സി. സുബ്രഹ്മണ്യൻ വിവിധ ഭരണപരവും രാഷ്ട്രീയവുമായ സ്ഥാനങ്ങൾ വഹിച്ചിട്ടുണ്ട്. പൊതുസമൂഹത്തിന്റെ വികസനത്തിനും പുരോഗതിക്കും അദ്ദേഹം നിർണായകമായ സംഭാവനകൾ നൽകിയിട്ടുണ്ട്.
              </p>
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
                        videoClassName="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-border to-muted" />
                  )}


                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/90 to-transparent transition-opacity duration-300 group-hover:opacity-100 group-hover:from-black" />

                  {/* Spacer to push text to a consistent starting position from the top */}
                  <div className="flex-none h-[280px] md:h-[320px]" />

                  {/* Text content with fixed title alignment */}
                  <div className="relative flex flex-col justify-start gap-4 px-6 py-10 z-10 w-full text-center">
                    {richText && (
                      <RichText
                        data={richText}
                        enableGutter={false}
                        className="mx-1 [&_h3]:type-headline-4 [&_h3]:font-bold [&_h3]:text-background [&_h3]:min-h-[2.5rem] [&_h3]:leading-tight [&_h4]:type-title-xl [&_h4]:font-bold [&_h4]:text-background [&_h4]:min-h-[2.5rem] [&_h4]:leading-tight [&_p]:type-body-lg [&_p]:font-medium [&_p]:text-background/90 [&_p]:mt-2 [&_p]:leading-relaxed"
                      />
                    )}
                  </div>
                </>
              )

              const cardClassName = "group border-4 border-background shadow-md relative min-h-[580px] h-full overflow-hidden rounded-2xl bg-muted flex flex-col justify-start"

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
