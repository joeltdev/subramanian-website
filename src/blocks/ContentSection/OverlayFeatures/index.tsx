import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'
import { CMSLink } from '@/components/Link'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  imageDark,
  imageLight,
  items,
  links,
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
      <section
        className="relative overflow-hidden min-h-screen flex items-center py-24 md:py-32"
        data-section-theme="light"
      >
        {/* Full-bleed media — absolutely positioned edge-to-edge */}
        <div className="absolute inset-0 -z-10">
          {typeof imageDark === 'object' && imageDark && (
            <Media
              fill
              resource={imageDark}
              className="h-full w-full"
              imgClassName="hidden h-full w-full object-cover object-center dark:block animate-kenburns"
            />
          )}
          {typeof imageLight === 'object' && imageLight && (
            <Media
              fill
              resource={imageLight}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover object-center dark:hidden animate-kenburns"
            />
          )}
        </div>

        {/* Constrained text content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8 w-full">
          <div className="flex flex-col space-y-16">
            {intro && (
              <RichText
                data={intro}
                enableGutter={false}
                className="relative z-10 max-w-3xl [&_h2]:text-black [&_h2]:type-headline-1 [&_h2]:mb-4 [&_h3]:type-headline-3 [&_h3]:text-black [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-black [&_p]:type-body-xl md:[&_p]:type-title-xl [&_p]:leading-relaxed mx-0"
              />
            )}
            {Array.isArray(items) && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-12">
                {items.map(({ id, icon, richText }) => {
                  const Icon = icon ? iconMap[icon] : null
                  return (
                    <div key={id} className="space-y-4">
                      {Icon && (
                        <div className="flex items-center">
                          <Icon className="size-10 text-black" />
                        </div>
                      )}
                      {richText && (
                        <RichText
                          data={richText}
                          enableGutter={false}
                          className="[&_h3]:type-title-xl [&_h3]:text-black [&_h3]:font-bold [&_h3]:mb-3 [&_h4]:type-title-md [&_h4]:text-black [&_h4]:font-semibold [&_h4]:mb-2 [&_p]:type-body-md [&_p]:text-black/80 [&_p]:leading-relaxed"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {Array.isArray(links) && links.length > 0 && (
              <div className="flex justify-center md:justify-end pt-6">
                {links.map(({ link }, i) => (
                  <CMSLink key={i} size="xl" {...link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
