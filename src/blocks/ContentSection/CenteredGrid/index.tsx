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
    <section className="py-4 md:py-24">
      <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-12">
        {intro && (
          <div className="mx-auto max-w-3xl space-y-6 text-center md:space-y-12">
            <RichText data={intro} enableGutter={false} className="[&_h2]:type-display-lg [&_h2]:text-type-body [&_h2]:tracking-tight [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />
          </div>
        )}

        {typeof image === 'object' && image && (
          <div className="bg-linear-to-b relative rounded-none from-border to-transparent p-px">
            <Media resource={image} imgClassName="w-full rounded-none object-cover grayscale shadow" />
          </div>
        )}

        {Array.isArray(items) && items.length > 0 && (
          <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
            {items.map(({ id, icon, richText }, index) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className={`${index === 0 ? 'space-y-3' : 'space-y-2'} border-l border-border pl-6`}>
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-6 text-slate-500" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="[&_h3]:type-title-lg [&_h3]:text-type-body [&_h4]:type-title-sm [&_h4]:text-type-secondary [&_p]:type-body-sm [&_p]:text-type-secondary [&_p]:leading-relaxed" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
