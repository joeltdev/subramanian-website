import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const TextCtaContentSection: React.FC<ContentSectionBlock> = ({ intro, links }) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:text-5xl [&_h2]:font-semibold [&_h2]:mb-6 [&_p]:text-slate-600 [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light" />}
          <div className="space-y-6">
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
