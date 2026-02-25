import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  imageDark,
  imageLight,
  items,
}) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        {intro && <RichText data={intro} enableGutter={false} className="relative z-10 max-w-xl" />}

        <div className="relative">
          <div className="relative z-10 space-y-4 md:w-1/2">
            {Array.isArray(items) && items.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
                {items.map(({ id, icon, richText }) => {
                  const Icon = icon ? iconMap[icon] : null
                  return (
                    <div key={id} className="space-y-3">
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

          <div className="md:mask-l-from-35% md:mask-l-to-55% mt-12 h-fit md:absolute md:-inset-y-12 md:inset-x-0 md:mt-0">
            <div className="border-border/50 relative rounded-2xl border border-dotted p-2">
              {typeof imageDark === 'object' && imageDark && (
                <Media resource={imageDark} imgClassName="hidden rounded-[12px] dark:block" />
              )}
              {typeof imageLight === 'object' && imageLight && (
                <Media resource={imageLight} imgClassName="rounded-[12px] shadow dark:hidden" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
