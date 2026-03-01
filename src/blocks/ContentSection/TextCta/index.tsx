import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const TextCtaContentSection: React.FC<ContentSectionBlock> = ({ intro, links }) => {
  return (
    <section className="py-8 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:gap-12">
          {intro && <RichText data={intro} enableGutter={false} className="flex row-auto justify-center items-baseline-last **:m-0 **:flex-1 [&_h2]:type-headline-1 [&_h2]:text-type-body [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />}
        </div>
        <div className="grid md:grid-cols-2">
          <div className=''></div>
          <div className="space-y-6 md:space-y-4">
            {Array.isArray(links) && links.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {links.map(({ link }, i) => (
                  <CMSLink key={i} size="sm" {...link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
