import React from 'react'
import type { FeatureCardsBlock } from '@/payload-types'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

export const GridFeatureCards: React.FC<FeatureCardsBlock> = ({ intro, items }) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          {intro && <RichText data={intro} enableGutter={false} />}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ id, icon, richText }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className="space-y-3">
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-4" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
