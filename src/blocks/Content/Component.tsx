import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && (
                  <RichText
                    data={richText}
                    enableGutter={false}
                    className="[&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:break-words [&_h2]:leading-tight [&_h2]:max-w-full [&_h2]:px-4 [&_h2]:mx-auto [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-semibold [&_h3]:break-words [&_h3]:leading-tight [&_h3]:max-w-full [&_h3]:px-4 [&_h3]:mx-auto [&_strong]:text-2xl [&_strong]:md:text-3xl [&_strong]:font-semibold [&_strong]:break-words [&_strong]:leading-tight"
                  />
                )}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
