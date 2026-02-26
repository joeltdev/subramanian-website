import React from 'react'
import type { StatsBlock as StatsBlockType } from '@/payload-types'
import RichText from '@/components/RichText'

export const StatsBlock: React.FC<StatsBlockType & { disableInnerContainer?: boolean }> = ({
  intro,
  stats,
}) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        {intro && (
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
            <RichText data={intro} enableGutter={false} />
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
                    className="[&_h3]:text-6xl [&_h3]:font-black [&_h3]:tracking-tighter [&_h3]:leading-none md:[&_h3]:text-7xl [&_h4]:text-5xl [&_h4]:font-black [&_h4]:tracking-tighter [&_h4]:leading-none md:[&_h4]:text-6xl [&_p]:mt-2 [&_p]:text-sm [&_p]:uppercase [&_p]:tracking-widest [&_p]:font-medium [&_p]:text-muted-foreground"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
