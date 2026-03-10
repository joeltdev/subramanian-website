import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className=" bg-background p-8 md:p-16" data-theme="dark">
      <div className="container flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-4xl flex items-center">
          {richText && <RichText data={richText} enableGutter={false} className="[&_h2]:type-headline-2 [&_h2]:text-type-heading [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_p]:text-type-secondary [&_p]:type-body-xl" />}
        </div>
        <div className="flex flex-row gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}
