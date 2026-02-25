import React from 'react'
import type { StatsBlock as StatsBlockType } from '@/payload-types'
import RichText from '@/components/RichText'

export const StatsBlock: React.FC<StatsBlockType & { disableInnerContainer?: boolean }> = ({
  intro,
  stats,
}) => {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        {intro && (
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
            <RichText data={intro} enableGutter={false} />
          </div>
        )}

        {Array.isArray(stats) && stats.length > 0 && (
          <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
            {stats.map(({ id, richText }) => (
              <div key={id} className="space-y-4">
                {richText && <RichText data={richText} enableGutter={false} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
