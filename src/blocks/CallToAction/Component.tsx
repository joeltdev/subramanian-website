import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="bg-background py-16 md:py-24" data-theme="dark">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:items-center">
          <div className="max-w-4xl">
            {richText && (
              <RichText 
                data={richText} 
                enableGutter={false} 
                className="[&_h2]:type-headline-2 [&_h2]:text-type-heading [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:mt-6" 
              />
            )}
          </div>
          
          {/* Symmetrical CTA Buttons */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto lg:min-w-[420px]">
              {links.map(({ link }, i) => (
                <CMSLink 
                  key={i} 
                  {...link} 
                  size="xl" 
                  className="flex-1 w-full justify-center px-6 min-w-0 sm:min-w-[200px] [&_span]:truncate [&_span]:block" 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
