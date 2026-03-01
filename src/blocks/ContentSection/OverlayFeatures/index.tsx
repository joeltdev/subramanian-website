import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  imageDark,
  imageLight,
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
      <section className="py-4 md:py-8">
        {/* Full-width positioning context — media escapes the container */}
        <div className="relative">
          {/* Full-bleed media — absolutely positioned edge-to-edge */}
          <div className="md:mask-l-from-5% md:mask-l-to-75% mt-12 md:absolute md:-inset-y-24 md:left-0 md:right-0 md:-z-10 md:mt-0">
            <div className="border-border/50 relative overflow-hidden h-full border border-dotted">
              {typeof imageDark === 'object' && imageDark && (
                <Media
                  resource={imageDark}
                  className="absolute inset-0 h-full w-full"
                  pictureClassName="h-full w-full"
                  imgClassName="hidden h-full w-full object-cover dark:block animate-kenburns"
                />
              )}
              {typeof imageLight === 'object' && imageLight && (
                <Media
                  resource={imageLight}
                  className="absolute inset-0 h-full w-full"
                  pictureClassName="h-full w-full"
                  imgClassName="h-full w-full object-cover shadow dark:hidden animate-kenburns"
                />
              )}
            </div>
          </div>

          {/* Constrained text content */}
          <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 md:space-y-16">
            <div className="space-y-4 md:w-1/2">
              {intro && <RichText data={intro} enableGutter={false} className="relative z-10 max-w-xl [&_h2]:text-slate-800 [&_h2]:type-headline-1 [&_h2]:mb-8 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-6 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug mb-8 mx-0" />}
              {Array.isArray(items) && items.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
                  {items.map(({ id, icon, richText }) => {
                    const Icon = icon ? iconMap[icon] : null
                    return (
                      <div key={id} className="space-y-3">
                        {Icon && (
                          <div className="flex items-center gap-2">
                            <Icon className="size-8 text-slate-500" />
                          </div>
                        )}
                        {richText && <RichText data={richText} enableGutter={false} className="[&_h3]:type-title-xl [&_h3]:text-type-body [&_h4]:type-title-sm [&_h4]:text-type-secondary [&_p]:type-body-md [&_p]:text-type-secondary [&_p]:leading-relaxed" />}
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
