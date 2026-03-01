import React from 'react'

import type { LogoCloudBlock } from '@/payload-types'
import { Media } from '@/components/Media'

export const Section1LogoCloud: React.FC<LogoCloudBlock> = ({ heading, logos }) => {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {heading && (
          <h2 className="text-center type-title-md">{heading}</h2>
        )}
        {Array.isArray(logos) && logos.length > 0 && (
          <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
            {logos.map(({ id, logo }) =>
              typeof logo === 'object' && logo ? (
                <Media key={id} resource={logo} imgClassName="h-7 w-auto dark:invert" />
              ) : null,
            )}
          </div>
        )}
      </div>
    </section>
  )
}
