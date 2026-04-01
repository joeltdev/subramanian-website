import React, { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'

import type { Media, Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'
import { AnimatedGroup } from '@/components/ui/animated-group'
import type { Variants } from 'motion/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

const transitionVariants: { container?: Variants; item?: Variants } = {
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
    },
  },
}

type Section2HeroType = Page['hero'] & {
  badgeLabel?: string | null
  backgroundVideo?: Media | number | null
  backgroundImage?: Media | number | null
  mobileBackgroundVideo?: Media | number | null
  mobileBackgroundImage?: Media | number | null
}

export const Section2Hero: React.FC<Section2HeroType> = ({
  badgeLabel,
  backgroundVideo,
  backgroundImage,
  mobileBackgroundVideo,
  mobileBackgroundImage,
  links,
  mediaPreview,
  richText,
}) => {
  const hasBgMedia =
    (backgroundVideo && typeof backgroundVideo === 'object' && !!backgroundVideo.url) ||
    (backgroundImage && typeof backgroundImage === 'object' && !!(backgroundImage as Media).url) ||
    (mobileBackgroundVideo && typeof mobileBackgroundVideo === 'object' && !!mobileBackgroundVideo.url) ||
    (mobileBackgroundImage && typeof mobileBackgroundImage === 'object' && !!(mobileBackgroundImage as Media).url)

  // Malayalam detection for font switching
  const isMalayalam = useMemo(() => {
    if (!richText) return false
    const textContent = JSON.stringify(richText)
    return /[\u0D00-\u0D7F]/.test(textContent)
  }, [richText])

  const heroConverters: JSXConvertersFunction = useMemo(() => ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node }) => {
      if (node.tag === 'h1') {
        // Extract text content from children
        const text = node.children
          .map((child: any) => child.text || '')
          .join('')
          .trim()

        const malayalamHeading = /[\u0D00-\u0D7F]/.test(text)

        // Split by the first space to create two lines
        const firstSpaceIndex = text.indexOf(' ')

        if (firstSpaceIndex !== -1) {
          const firstLine = text.substring(0, firstSpaceIndex).trim()
          const secondLine = text.substring(firstSpaceIndex).trim()

          return (
        <h1 className={`m-0 font-black flex flex-col items-start gap-1 leading-none break-words ${malayalamHeading ? 'font-malayalam' : ''}`}>
          <span className="type-display text-foreground" style={{ fontWeight: 800 }}>{firstLine}</span>
          <span className="type-display text-foreground" style={{ fontWeight: 800 }}>{secondLine}</span>
        </h1>
          )
        }

        return (
          <h1 className={`m-0 type-headline-1 font-black break-words ${malayalamHeading ? 'font-malayalam' : ''}`}>
            {text}
          </h1>
        )
      }
      return null
    }
  }), [])

  return (
    <div className="overflow-x-clip" data-theme="dark">
      <section>
        <div className={`relative py-32 md:py-48 ${hasBgMedia ? 'min-h-[100svh] flex flex-col justify-end md:justify-center pb-24 md:pb-32' : ''}`}>
          {/* Background media */}
          <>
            {/* Desktop Video */}
            {backgroundVideo && typeof backgroundVideo === 'object' && backgroundVideo.url && (
              <video
                className={`absolute inset-0 size-full object-cover object-[20%_0%] md:object-center -z-20 ${mobileBackgroundVideo || mobileBackgroundImage ? 'hidden md:block' : 'block'}`}
                src={backgroundVideo.url}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
            )}
            {/* Desktop Image */}
            {backgroundImage && typeof backgroundImage === 'object' && (backgroundImage as Media).url && (
              <img
                className={`absolute inset-0 size-full object-cover object-[20%_0%] md:object-center -z-20 ${mobileBackgroundVideo || mobileBackgroundImage ? 'hidden md:block' : 'block'} ${backgroundVideo ? 'opacity-0' : 'opacity-100'}`}
                src={(backgroundImage as Media).url!}
                alt={(backgroundImage as Media).alt ?? ''}
                aria-hidden
              />
            )}

            {/* Mobile Video */}
            {mobileBackgroundVideo && typeof mobileBackgroundVideo === 'object' && mobileBackgroundVideo.url && (
              <video
                className="absolute inset-0 size-full object-cover object-[20%_0%] -z-20 md:hidden block"
                src={mobileBackgroundVideo.url}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
            )}
            {/* Mobile Image */}
            {mobileBackgroundImage && typeof mobileBackgroundImage === 'object' && (mobileBackgroundImage as Media).url && (
              <img
                className={`absolute inset-0 size-full object-cover object-[20%_0%] -z-20 md:hidden block ${mobileBackgroundVideo ? 'opacity-0' : 'opacity-100'}`}
                src={(mobileBackgroundImage as Media).url!}
                alt={(mobileBackgroundImage as Media).alt ?? ''}
                aria-hidden
              />
            )}

            {/* Enhanced Scrim Overlay */}
            <div className="absolute pointer-events-none left-0 bottom-0 w-full h-full bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          </>

          <div className="mx-auto max-w-7xl px-6 w-full">
            <div className="sm:mx-auto lg:mr-auto lg:mt-0">
              {/* Badge */}
              {badgeLabel && (
                <AnimatedGroup variants={transitionVariants}>
                  <div className="hover:bg-background dark:hover:border-t-border bg-muted flex w-fit items-center gap-4 rounded-none border p-1 pl-4 transition-colors duration-300 dark:border-t-white/5">
                    <span className="text-foreground text-sm font-bold uppercase tracking-widest">{badgeLabel}</span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-border" />
                    <div className="bg-background size-6 overflow-hidden rounded-none">
                      <ArrowRight className="m-auto size-3 translate-y-1/3" />
                    </div>
                  </div>
                </AnimatedGroup>
              )}

              {/* Rich text content — left aligned */}
              {richText && (
                <AnimatedGroup
                  variants={transitionVariants}
                  className="mt-10 max-w-2xl lg:mt-20">
                  <RichText
                    data={richText}
                    enableGutter={false}
                    converters={heroConverters}
                    className={`text-balance [&_h1]:m-0 [&_h2]:m-0 [&_p]:mt-10 [&_p]:max-w-2xl [&_p]:type-body-xl md:[&_p]:type-body-2xl [&_p]:text-foreground [&_p]:leading-relaxed [&_h1]:break-words [&_h2]:break-words ${isMalayalam ? 'font-malayalam' : ''}`}
                  />
                </AnimatedGroup>
              )}

              {/* CTA links */}
              {Array.isArray(links) && links.length > 0 && (
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: { staggerChildren: 0.05, delayChildren: 0.75 },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                  {links.map(({ link }, i) => (
                    <CMSLink
                      key={i}
                      {...link}
                      size="default"
                      className="group flex justify-center items-center rounded-none bg-foreground text-background transition-all duration-300 active:scale-[0.98] px-10 py-5 md:py-7 md:px-16 type-label-lg hover:bg-brand-600 hover:text-white w-full sm:w-auto border-none"
                    >
                      <ArrowRight className="transition-transform group-hover:translate-x-1.5 ml-3 md:animate-arrow-right md:size-6" />
                    </CMSLink>
                  ))}
                </AnimatedGroup>
              )}
            </div>
          </div>

          {/* App preview screenshot */}
          {mediaPreview && typeof mediaPreview === 'object' && (
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.75 },
                  },
                },
                ...transitionVariants,
              }}>
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-none border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <MediaComponent
                    className="aspect-15/8 relative rounded-none"
                    imgClassName="rounded-none"
                    resource={mediaPreview}
                  />
                </div>
              </div>
            </AnimatedGroup>
          )}
        </div>
      </section>
    </div>
  )
}
