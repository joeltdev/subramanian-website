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

          {/* CTA Buttons using CMSLink (Sharp Corners Mandate) */}
          {links && links.length > 0 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              {links.map(({ link }, i) => (
                <CMSLink 
                  key={i} 
                  {...link} 
                  size="lg"
                  className="rounded-none px-10 py-4" 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
