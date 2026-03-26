import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'
import { cn } from '@/utilities/ui'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  imageDark,
  imageDarkMobile,
  imageLight,
  imageLightMobile,
  items,
  theme,
}) => {
  const currentTheme = theme || 'brand'
  
  return (
    <>
      <style>{`
        @keyframes kenburns {
          0%   { transform: scale(1)    translate(0, 0); }
          50%  { transform: scale(1.08) translate(-2%, -1%); }
          100% { transform: scale(1)    translate(0, 0); }
        }
        .animate-kenburns {
          animation: kenburns 22s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
      <section 
        className="relative py-16 md:py-24 overflow-hidden" 
        data-section-theme={currentTheme}
      >
        {/* Background Layer - Positioned relative to the section for full-height coverage */}
        <div className="absolute inset-0 -z-10 md:mask-l-from-5% md:mask-l-to-75% md:-inset-y-24">
          <div className="relative h-full w-full overflow-hidden border-border/20 border-dotted md:border">
            {/* Dark Mode Images */}
            {typeof imageDark === 'object' && imageDark && (
              <Media
                resource={imageDark}
                className={cn("absolute inset-0 h-full w-full", imageDarkMobile && "hidden md:block")}
                pictureClassName="h-full w-full"
                imgClassName="hidden h-full w-full object-cover dark:block animate-kenburns"
              />
            )}
            {typeof imageDarkMobile === 'object' && imageDarkMobile && (
              <Media
                resource={imageDarkMobile}
                className="absolute inset-0 h-full w-full md:hidden"
                pictureClassName="h-full w-full"
                imgClassName="hidden h-full w-full object-cover dark:block animate-kenburns"
              />
            )}
            
            {/* Light Mode Images */}
            {typeof imageLight === 'object' && imageLight && (
              <Media
                resource={imageLight}
                className={cn("absolute inset-0 h-full w-full", imageLightMobile && "hidden md:block")}
                pictureClassName="h-full w-full"
                imgClassName="h-full w-full object-cover dark:hidden animate-kenburns"
              />
            )}
            {typeof imageLightMobile === 'object' && imageLightMobile && (
              <Media
                resource={imageLightMobile}
                className="absolute inset-0 h-full w-full md:hidden"
                pictureClassName="h-full w-full"
                imgClassName="h-full w-full object-cover dark:hidden animate-kenburns"
              />
            )}

            {/* Overlay for readability - Responsive blur and adaptive theme-based opacity */}
            <div className={cn(
              "absolute inset-0 bg-background/40 md:bg-background/20 transition-colors duration-300",
              "backdrop-blur-[2px] md:backdrop-blur-none"
            )} />
          </div>
        </div>

        {/* Content Layer */}
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="md:w-3/5 lg:w-1/2 space-y-12 md:space-y-20">
            {intro && (
              <RichText
                data={intro}
                enableGutter={false}
                className="relative z-10 max-w-[55ch] [&_h2]:type-headline-1 [&_h2]:text-type-heading [&_h2]:mb-8 [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:leading-tight [&_h3]:mb-6 [&_p]:type-body-xl [&_p]:text-type-body [&_p]:leading-relaxed"
              />
            )}
            
            {Array.isArray(items) && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 md:gap-x-12 md:gap-y-10">
                {items.map(({ id, icon, richText }) => {
                  const Icon = icon ? iconMap[icon] : null
                  return (
                    <div key={id} className="space-y-4 md:space-y-5">
                      {Icon && (
                        <div className="flex items-center">
                          <Icon className="size-8 md:size-10 text-type-heading" />
                        </div>
                      )}
                      {richText && (
                        <RichText
                          data={richText}
                          enableGutter={false}
                          className="[&_h3]:type-title-md md:[&_h3]:type-title-xl [&_h3]:text-type-heading [&_h3]:font-bold [&_h3]:mb-3 [&_h4]:type-title-sm md:[&_h4]:type-title-md [&_h4]:text-type-heading [&_h4]:font-semibold [&_h4]:mb-2 [&_p]:type-body-md [&_p]:text-type-body [&_p]:leading-relaxed"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
