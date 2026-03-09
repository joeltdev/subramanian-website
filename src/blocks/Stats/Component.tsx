import React from 'react'
import type { StatsBlock as StatsBlockType } from '@/payload-types'
import RichText from '@/components/RichText'

export const StatsBlock: React.FC<StatsBlockType & { disableInnerContainer?: boolean }> = ({
  intro,
  stats,
}) => {
  return (
    <section data-theme="dark" className="py-4 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-16">
        {intro && (
          <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
            <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-2 [&_h2]:text-type-heading [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-body [&_p]:type-body-lg [&_p]:leading-snug" />
          </div>
        )}

        {Array.isArray(stats) && stats.length > 0 && (
          <div className="grid divide-y *:text-center md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map(({ id, richText }) => (
              <div key={id} className="space-y-1 px-8 py-8 md:py-0">
                {richText && (
                  <RichText
                   data={richText}
                   enableGutter={false}
                   className="[&_h3]:type-stat-xl [&_h3]:leading-none [&_h4]:type-stat [&_h4]:leading-none [&_p]:mt-2 [&_p]:type-body-lg [&_p]:text-type-body"
                  />                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
