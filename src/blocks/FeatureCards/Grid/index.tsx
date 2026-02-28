import React from 'react'
import type { FeatureCardsBlock } from '@/payload-types'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

export const GridFeatureCards: React.FC<FeatureCardsBlock> = ({ intro, items }) => {
  return (
    <section className="py-16 md:py-32">
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:text-5xl [&_h2]:text-slate-700 [&_h2]:leading-[1.1] [&_h2]:font-semibold [&_h2]:mb-6 [&_h3]:text-3xl [&_h3]:text-slate-700 [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-slate-600 [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light" />}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="relative mx-auto grid max-w-5xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ id, icon, richText }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className="space-y-3">
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-slate-500" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-700 [&_p]:text-sm [&_p]:text-slate-500 [&_p]:font-normal [&_p]:leading-relaxed" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
