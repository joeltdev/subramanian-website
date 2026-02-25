import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'

export const CenteredGridContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  image,
  items,
}) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        {intro && (
          <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
            <RichText data={intro} enableGutter={false} />
          </div>
        )}

        {typeof image === 'object' && image && (
          <Media resource={image} imgClassName="rounded-(--radius) grayscale w-full" />
        )}

        {Array.isArray(items) && items.length > 0 && (
          <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
            {items.map(({ id, icon, richText }, index) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className={index === 0 ? 'space-y-3' : 'space-y-2'}>
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
