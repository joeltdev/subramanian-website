import React from 'react'
import type { FeatureCardsBlock } from '@/payload-types'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

export const GridFeatureCards: React.FC<FeatureCardsBlock> = ({ intro, items }) => {
  return (
    <section className="py-4 md:py-8">
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-1 [&_h2]:text-type-body [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="relative mx-auto grid max-w-5xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ id, icon, richText }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className="space-y-3">
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-12 text-slate-500" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="[&_h3]:type-title-lg [&_h3]:text-type-heading [&_p]:type-body-lg [&_p]:text-type-body [&_p]:leading-relaxed" />}                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
