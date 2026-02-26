import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'

export const CenteredGridContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  image,
  items,
}) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        {intro && (
          <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
            <RichText data={intro} enableGutter={false} className="[&_h2]:text-5xl [&_h2]:font-semibold [&_h2]:mb-6 [&_p]:text-slate-600 [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light" />
          </div>
        )}

        {typeof image === 'object' && image && (
          <div className="bg-linear-to-b relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
            <Media resource={image} imgClassName="w-full rounded-[15px] object-cover grayscale shadow" />
          </div>
        )}

        {Array.isArray(items) && items.length > 0 && (
          <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
            {items.map(({ id, icon, richText }, index) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className={index === 0 ? 'space-y-3' : 'space-y-2'}>
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-4" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="[&_h3]:text-sm [&_h3]:font-semibold [&_p]:text-sm [&_p]:text-slate-600 [&_p]:leading-relaxed" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
