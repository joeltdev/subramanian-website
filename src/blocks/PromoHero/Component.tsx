import React from 'react'
import type { PromoHeroBlock as T } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const PromoHeroBlock: React.FC<T> = ({ intro, links }) => {
  return (
    <section className="py-16 md:py-32 bg-background overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Content with Semantic Type Scale */}
          {intro && (
            <RichText
              data={intro}
              enableGutter={false}
              className="[&_h1]:type-headline-1 [&_h1]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:mt-8 [&_p]:mx-auto [&_p]:max-w-3xl"
            />
          )}

          {/* CTA Buttons - Symmetrical Design */}
          {links && links.length > 0 && (
            <div className="mt-12 w-full max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full">
                {links.map(({ link }, i) => (
                  <CMSLink 
                    key={i} 
                    {...link} 
                    size="xl"
                    className="flex-1 w-full justify-center px-6 min-w-0 sm:min-w-[240px] [&_span]:truncate [&_span]:block" 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
