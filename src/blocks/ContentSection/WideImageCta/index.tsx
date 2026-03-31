import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const WideImageCtaContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  image,
  links,
}) => {
  return (
    <section className="py-4 md:py-24">
      <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-12">
        <div className="grid gap-6 md:gap-12">
          {intro && <RichText data={intro} enableGutter={false} className="flex row-auto justify-center items-baseline-last **:m-0 **:flex-1 [&_h2]:type-display-lg [&_h2]:text-type-heading [&_h2]:tracking-tight [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:mb-4 [&_p]:text-type-body [&_p]:type-body-xl" />}
        </div>
        {typeof image === 'object' && image && (
          <div className="group relative aspect-5/2 overflow-hidden rounded-none cursor-pointer">
            {/* Full-cover image, subtle zoom on hover */}
            <Media
              resource={image}
              className="absolute inset-0 w-full h-full"
              pictureClassName="w-full h-full"
              imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Overlay dims on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500" />

            {/* CTA links: centered, fade in on hover */}
            {Array.isArray(links) && links.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <div className="flex flex-wrap gap-4 justify-center">
                  {links.map(({ link }, i) => (
                    <CMSLink key={i} size="xl" {...link} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
