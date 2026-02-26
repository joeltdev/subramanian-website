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
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        {typeof image === 'object' && image && (
          <div className="bg-linear-to-b relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
            <Media resource={image} imgClassName="w-full rounded-[15px] object-cover grayscale shadow" />
          </div>
        )}

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
