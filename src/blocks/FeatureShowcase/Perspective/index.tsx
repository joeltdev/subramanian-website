import React from 'react'
import type { FeatureShowcaseBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

export const PerspectiveFeatureShowcase: React.FC<FeatureShowcaseBlock> = ({
  intro,
  imageForeground,
  imageDark,
  imageLight,
  items,
}) => {
  return (
    <section className="overflow-hidden py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="relative z-10 max-w-2xl">
          {intro && <RichText data={intro} enableGutter={false} />}
        </div>

        {(imageForeground || imageDark || imageLight) && (
          <div className="mask-b-from-75% mask-l-from-75% mask-b-to-95% mask-l-to-95% relative -mx-4 pr-3 pt-3 md:-mx-12">
            <div className="perspective-midrange">
              <div className="rotate-x-6 -skew-2">
                <div className="aspect-[88/36] relative">
                  {typeof imageForeground === 'object' && imageForeground && (
                    <Media resource={imageForeground} className="absolute inset-0 z-10" imgClassName="w-full h-full object-cover" />
                  )}
                  {typeof imageDark === 'object' && imageDark && (
                    <Media resource={imageDark} className="hidden dark:block" imgClassName="w-full h-full object-cover" />
                  )}
                  {typeof imageLight === 'object' && imageLight && (
                    <Media resource={imageLight} className="dark:hidden" imgClassName="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {Array.isArray(items) && items.length > 0 && (
          <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
            {items.map(({ id, icon, title, description }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="size-4" />}
                    {title && <h3 className="text-sm font-medium">{title}</h3>}
                  </div>
                  {description && <RichText data={description} enableGutter={false} />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
