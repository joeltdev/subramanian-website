import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'
import { cn } from '@/utilities/ui'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  imageDark,
  imageDarkMobile,
  imageLight,
  imageLightMobile,
  items,
}) => {
  return (
    <>
      <style>{`
        @keyframes kenburns {
          0%   { transform: scale(1)    translate(0, 0); }
          50%  { transform: scale(1.08) translate(-2%, -1%); }
          100% { transform: scale(1)    translate(0, 0); }
        }
        .animate-kenburns {
          animation: kenburns 22s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
      <section className="py-16 md:py-24">
        {/* Full-width positioning context — media escapes the container */}
        <div className="relative">
          {/* Full-bleed media — absolutely positioned edge-to-edge */}
          <div className="md:mask-l-from-5% md:mask-l-to-75% absolute inset-x-0 inset-y-0 -z-10 md:-inset-y-24">
            <div className="border-border/50 relative overflow-hidden h-full border border-dotted">
              {/* Dark Mode - Desktop */}
              {typeof imageDark === 'object' && imageDark && (
                <Media
                  resource={imageDark}
                  className={cn("absolute inset-0 h-full w-full", imageDarkMobile && "hidden md:block")}
                  pictureClassName="h-full w-full"
                  imgClassName="hidden h-full w-full object-cover dark:block animate-kenburns"
                />
              )}
              {/* Dark Mode - Mobile */}
              {typeof imageDarkMobile === 'object' && imageDarkMobile && (
                <Media
                  resource={imageDarkMobile}
                  className="absolute inset-0 h-full w-full md:hidden"
                  pictureClassName="h-full w-full"
                  imgClassName="hidden h-full w-full object-cover dark:block animate-kenburns"
                />
              )}
              {/* Light Mode - Desktop */}
              {typeof imageLight === 'object' && imageLight && (
                <Media
                  resource={imageLight}
                  className={cn("absolute inset-0 h-full w-full", imageLightMobile && "hidden md:block")}
                  pictureClassName="h-full w-full"
                  imgClassName="h-full w-full object-cover shadow dark:hidden animate-kenburns"
                />
              )}
              {/* Light Mode - Mobile */}
              {typeof imageLightMobile === 'object' && imageLightMobile && (
                <Media
                  resource={imageLightMobile}
                  className="absolute inset-0 h-full w-full md:hidden"
                  pictureClassName="h-full w-full"
                  imgClassName="h-full w-full object-cover shadow dark:hidden animate-kenburns"
                />
              )}
            </div>
          </div>

          {/* Constrained text content */}
          <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-6 md:space-y-20">
            <div className="space-y-10 md:w-3/5 lg:w-1/2">
              {intro && (
                <RichText
                  data={intro}
                  enableGutter={false}
                  className="relative z-10 max-w-[55ch] [&_h2]:text-type-heading [&_h2]:type-headline-1 [&_h2]:mb-10 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-8 [&_p]:text-type-body [&_p]:type-body-lg [&_p]:leading-relaxed mb-12 mx-0"
                />
              )}
              {Array.isArray(items) && items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 md:gap-x-12 md:gap-y-10">
                  {items.map(({ id, icon, richText }) => {
                    const Icon = icon ? iconMap[icon] : null
                    return (
                      <div key={id} className="space-y-5">
                        {Icon && (
                          <div className="flex items-center">
                            <Icon className="size-10 text-black" />
                          </div>
                        )}
                        {richText && (
                          <RichText
                            data={richText}
                            enableGutter={false}
                            className="[&_h3]:type-title-md md:[&_h3]:type-title-xl [&_h3]:text-type-heading [&_h3]:font-bold [&_h3]:mb-3 [&_h4]:type-title-sm md:[&_h4]:type-title-md [&_h4]:text-type-body [&_h4]:font-semibold [&_h4]:mb-2 [&_p]:type-body-md [&_p]:text-black [&_p]:leading-relaxed"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
