import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { iconMap } from '@/blocks/shared/featureIcons'
import { cn } from '@/utilities/ui'

export const OverlayFeaturesContentSection: React.FC<ContentSectionBlock> = (props) => {
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
      
      {/* Mobile View: Locked in "Good" state */}
      <div className="block md:hidden">
        <MobileView {...props} />
      </div>

      {/* Desktop View: Restored to "Perfect" previous state */}
      <div className="hidden md:block">
        <DesktopView {...props} />
      </div>
    </>
  )
}

/**
 * MOBILE VIEW: 
 * - Full-height background coverage
 * - Semantic tokens for theme adaptive colors
 * - Readability overlay with blur
 * - size-8 icons
 */
const MobileView: React.FC<ContentSectionBlock> = ({
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
    <section 
      className="relative py-16 overflow-hidden" 
      data-section-theme={currentTheme}
    >
      <div className="absolute inset-0 -z-10">
        <div className="relative h-full w-full overflow-hidden border-border/20 border-dotted border">
          {/* Images */}
          {typeof imageDarkMobile === 'object' && imageDarkMobile ? (
            <Media resource={imageDarkMobile} className="absolute inset-0 h-full w-full" pictureClassName="h-full w-full" imgClassName="hidden h-full w-full object-cover dark:block animate-kenburns" />
          ) : (
            typeof imageDark === 'object' && imageDark && <Media resource={imageDark} className="absolute inset-0 h-full w-full" pictureClassName="h-full w-full" imgClassName="hidden h-full w-full object-cover dark:block animate-kenburns" />
          )}
          {typeof imageLightMobile === 'object' && imageLightMobile ? (
            <Media resource={imageLightMobile} className="absolute inset-0 h-full w-full" pictureClassName="h-full w-full" imgClassName="h-full w-full object-cover dark:hidden animate-kenburns" />
          ) : (
            typeof imageLight === 'object' && imageLight && <Media resource={imageLight} className="absolute inset-0 h-full w-full" pictureClassName="h-full w-full" imgClassName="h-full w-full object-cover dark:hidden animate-kenburns" />
          )}
          
          {/* Mobile-only fix: Readability overlay */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 space-y-12">
        {intro && (
          <RichText
            data={intro}
            enableGutter={false}
            className="relative z-10 max-w-[55ch] [&_h2]:type-headline-1 [&_h2]:text-type-heading [&_h2]:mb-8 [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:leading-tight [&_h3]:mb-6 [&_p]:type-body-md [&_p]:text-type-body [&_p]:leading-relaxed"
          />
        )}
        
        {Array.isArray(items) && items.length > 0 && (
          <div className="grid grid-cols-1 gap-y-12">
            {items.map(({ id, icon, richText }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className="space-y-4">
                  {Icon && <Icon className="size-8 text-type-heading" />}
                  {richText && (
                    <RichText
                      data={richText}
                      enableGutter={false}
                      className="[&_h3]:type-title-md [&_h3]:text-type-heading [&_h3]:font-bold [&_h3]:mb-3 [&_h4]:type-title-sm [&_h4]:text-type-heading [&_h4]:font-semibold [&_h4]:mb-2 [&_p]:type-body-md [&_p]:text-type-body [&_p]:leading-relaxed"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * DESKTOP VIEW: 
 * - Original design with mask and offset background
 * - Hardcoded text-black for specific contrast
 * - size-10 icons
 * - type-body-lg for intro
 */
const DesktopView: React.FC<ContentSectionBlock> = ({
  intro,
  imageDark,
  imageLight,
  items,
  theme,
}) => {
  const currentTheme = theme || 'brand'
  
  return (
    <section className="py-24" data-section-theme={currentTheme}>
      <div className="relative">
        {/* Original Desktop Background logic */}
        <div className="absolute inset-0 -z-10 mask-l-from-5% mask-l-to-75% -inset-y-24 inset-x-0 mt-0">
          <div className="border-border/50 relative overflow-hidden h-full border border-dotted">
            {typeof imageDark === 'object' && imageDark && (
              <Media resource={imageDark} className="absolute inset-0 h-full w-full" pictureClassName="h-full w-full" imgClassName="hidden h-full w-full object-cover dark:block animate-kenburns" />
            )}
            {typeof imageLight === 'object' && imageLight && (
              <Media resource={imageLight} className="absolute inset-0 h-full w-full" pictureClassName="h-full w-full" imgClassName="h-full w-full object-cover shadow dark:hidden animate-kenburns" />
            )}
            <div className={cn(
              "absolute inset-0",
              currentTheme === 'brand' && "bg-brand-500/10",
              currentTheme === 'light' && "bg-white/10"
            )} />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-8">
          <div className="w-1/2 space-y-20">
            {intro && (
              <RichText
                data={intro}
                enableGutter={false}
                className="relative z-10 max-w-[55ch] [&_h2]:text-black [&_h2]:type-headline-1 [&_h2]:mb-10 [&_h3]:type-headline-3 [&_h3]:text-black [&_h3]:leading-tight [&_h3]:mb-8 [&_p]:text-black [&_p]:type-body-lg [&_p]:leading-relaxed mb-12 mx-0"
              />
            )}
            
            {Array.isArray(items) && items.length > 0 && (
              <div className="grid grid-cols-2 gap-x-12 gap-y-10 pt-10">
                {items.map(({ id, icon, richText }) => {
                  const Icon = icon ? iconMap[icon] : null
                  return (
                    <div key={id} className="space-y-5">
                      {Icon && <Icon className="size-10 text-black" />}
                      {richText && (
                        <RichText
                          data={richText}
                          enableGutter={false}
                          className="[&_h3]:type-title-xl [&_h3]:text-black [&_h3]:font-bold [&_h3]:mb-3 [&_h4]:type-title-md [&_h4]:text-black [&_h4]:font-semibold [&_h4]:mb-2 [&_p]:type-body-md [&_p]:text-black [&_p]:leading-relaxed"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
