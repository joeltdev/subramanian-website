import React from 'react'
import type { FeatureShowcaseBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

export const SplitFeatureShowcase: React.FC<FeatureShowcaseBlock> = ({
  intro,
  imageForeground,
  imageDark,
  imageLight,
  items,
}) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-12 px-6">
        <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:text-5xl [&_h2]:text-slate-700 [&_h2]:leading-[1.1] [&_h2]:font-semibold [&_h2]:mb-6 [&_h3]:text-3xl [&_h3]:text-slate-700 [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-slate-600 [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light" />}
        </div>

        {(imageForeground || imageDark || imageLight) && (
          <div className="px-3 pt-3 md:-mx-8">
            <div className="aspect-[88/36] mask-b-from-75% mask-b-to-95% relative">
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
        )}

        {Array.isArray(items) && items.length > 0 && (
          <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
            {items.map(({ id, icon, richText }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className="space-y-3">
                  {Icon && (
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-slate-500" />
                    </div>
                  )}
                  {richText && <RichText data={richText} enableGutter={false} className="[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-700 [&_p]:text-sm [&_p]:text-slate-500 [&_p]:font-normal [&_p]:leading-relaxed" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
