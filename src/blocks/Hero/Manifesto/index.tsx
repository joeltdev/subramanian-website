'use client'
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
    hidden: { opacity: 0, filter: 'blur(12px)', y: 20 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring', bounce: 0.2, duration: 1.2 },
    },
  },
}

type ManifestoHeroType = Page['hero'] & {
  badgeLabel?: string | null
  backgroundVideo?: Media | number | null
  backgroundImage?: Media | number | null
  mobileBackgroundVideo?: Media | number | null
  mobileBackgroundImage?: Media | number | null
}

export const ManifestoHero: React.FC<ManifestoHeroType> = ({
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
  const isMalayalamContent = useMemo(() => {
    if (!richText) return false
    const textContent = JSON.stringify(richText)
    return /[\u0D00-\u0D7F]/.test(textContent)
  }, [richText])

  const heroConverters: JSXConvertersFunction = useMemo(() => ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node }) => {
      if (node.tag === 'h1') {
        const text = node.children
          .map((child: any) => child.text || '')
          .join('')
          .trim()

        // Check if Malayalam characters are present
        const isMalayalam = /[\u0D00-\u0D7F]/.test(text)

        return (
          <h1 className={`m-0 font-extrabold tracking-tight ${isMalayalam ? 'leading-[1.15] py-2 font-malayalam' : 'leading-tight'}`}>
            <span
              className="type-display text-foreground text-balance md:max-w-[800px] block"
              style={{ fontWeight: 800 }}
            >
              {text}
            </span>
          </h1>
        )
      }
      return null
    }
  }), [])

  return (
    <div className="relative overflow-x-clip bg-white" data-theme="light">
      {/* Container holding the stacked sections */}
      <section className="relative flex flex-col items-center flex-1 w-full">

        {/* === SECTION 1: TOP IMAGE WITH FADE AND TITLE === */}
        <div className="relative w-full h-[80svh] md:h-[92svh] bg-white">
          {hasBgMedia ? (
            <div className="absolute inset-0 size-full overflow-hidden">
              {/* Desktop Video */}
              {backgroundVideo && typeof backgroundVideo === 'object' && backgroundVideo.url && (
                <video
                  className={`absolute inset-0 size-full object-cover object-[10%_0%] md:object-[center_25%] ${mobileBackgroundVideo || mobileBackgroundImage ? 'hidden md:block' : 'block'}`}
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
                  className={`absolute inset-0 size-full object-cover object-[10%_0%] md:object-[center_25%] ${mobileBackgroundVideo || mobileBackgroundImage ? 'hidden md:block' : 'block'} ${backgroundVideo ? 'opacity-0' : 'opacity-100'}`}
                  src={(backgroundImage as Media).url!}
                  alt={(backgroundImage as Media).alt ?? ''}
                  aria-hidden
                />
              )}

              {/* Mobile Video */}
              {mobileBackgroundVideo && typeof mobileBackgroundVideo === 'object' && mobileBackgroundVideo.url && (
                <video
                  className="absolute inset-0 size-full object-cover object-[10%_20%] md:hidden block"
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
                  className={`absolute inset-0 size-full object-cover object-[10%_20%] md:hidden block ${mobileBackgroundVideo ? 'opacity-0' : 'opacity-100'}`}
                  src={(mobileBackgroundImage as Media).url!}
                  alt={(mobileBackgroundImage as Media).alt ?? ''}
                  aria-hidden
                />
              )}
            </div>
          ) : (
            <div className="absolute inset-0 bg-white" aria-hidden>
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_10%,var(--color-brand-100)_0%,transparent_60%)] opacity-30" />
            </div>
          )}

          {/* Responsive Fade Overlay - Lowered height to start just above the title */}
          <div className="absolute inset-x-0 bottom-[-1px] h-[40%] md:h-[36%] bg-linear-to-t from-white from-20% via-white/70 to-transparent pointer-events-none" aria-hidden />

          {/* Responsive Title Position - Moved lower to be closer to the paragraph */}
          <div className="absolute bottom-0 left-0 w-full px-6 md:px-8 pb-2">
            <div className="max-w-7xl mx-auto w-full flex flex-col items-start text-left">
              {badgeLabel && (
                <AnimatedGroup variants={transitionVariants}>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-none border border-brand-200 bg-brand-50/80 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-brand-700 text-[10px] md:text-xs font-bold uppercase tracking-widest">{badgeLabel}</span>
                    <div className="bg-brand-500 rounded-none p-0.5">
                      <ArrowRight className="size-2 md:size-3 text-white" />
                    </div>
                  </div>
                </AnimatedGroup>
              )}
              {richText && (
                <AnimatedGroup variants={transitionVariants} className="w-full">
                  <RichText
                    data={richText}
                    enableGutter={false}
                    converters={heroConverters}
                    className={`text-left text-balance [&_p]:hidden [&_h1_*]:!text-brand-600 [&_h1]:!drop-shadow-none [&_h2]:type-display [&_h2]:!text-brand-600  [&_h2]:mb-0 [&_h1]:break-words [&_h2]:break-words md:[&_h1]:translate-y-4 lg:[&_h1]:-translate-y-5 ${isMalayalamContent ? 'font-malayalam' : ''}`}
                  />
                </AnimatedGroup>
              )}
            </div>
          </div>
        </div>

        {/* === SECTION 2: DESCRIPTION AND CTA CONTENT === */}
        <div className="w-full px-6 md:px-8 bg-white pt-2 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto w-full flex flex-col items-start text-left">
            {richText && (
              <AnimatedGroup variants={transitionVariants} className="w-full">
                <RichText
                  data={richText}
                  enableGutter={false}
                  converters={heroConverters}
                  className={`text-left [&_h1]:hidden [&_h2]:hidden [&_p]:mt-0 [&_p]:max-w-4xl [&_p]:mx-0 [&_p]:type-body-lg md:[&_p]:type-body-xl [&_p]:font-medium [&_p]:!text-slate-900 [&_p]:leading-relaxed [&_p]:!drop-shadow-none [&_p]:break-words ${isMalayalamContent ? 'font-malayalam' : ''}`}

                />
              </AnimatedGroup>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <AnimatedGroup
                variants={{
                  container: { visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } },
                  ...transitionVariants,
                }}
                className="mt-10 md:mt-12 w-full max-w-xl mx-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-start gap-4 w-full">
                  {links.map(({ link }, i) => (
                    <CMSLink
                      key={i}
                      {...link}
                      size="lg"
                      className="group flex justify-center rounded-none bg-brand-600 text-white uppercase font-bold tracking-widest transition-all duration-300 active:scale-[0.98] hover:bg-brand-700 w-full h-[64px] md:h-[72px] md:min-w-[320px] items-center px-8 type-label-lg"
                    >
                      <ArrowRight className="transition-transform group-hover:translate-x-1.5 shrink-0 ml-3 size-4 md:size-7 md:animate-arrow-right" />
                    </CMSLink>
                  ))}
                </div>
              </AnimatedGroup>
            )}
          </div>
        </div>

        {/* Media Preview - Premium Display */}
        {mediaPreview && typeof mediaPreview === 'object' && (
          <AnimatedGroup
            variants={transitionVariants}
            className="w-full max-w-7xl px-4 sm:px-6 md:px-8 pb-16 md:pb-24 mx-auto bg-white">
            <div className="relative group mx-auto">
              <div className="absolute -inset-1 bg-brand-500/20 rounded-none blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-500"></div>
              <div className="relative bg-white border border-border/50 shadow-2xl overflow-hidden ring-1 ring-black/5">
                <MediaComponent
                  className="aspect-16/9 relative"
                  imgClassName="object-cover"
                  resource={mediaPreview}
                />
              </div>
            </div>
          </AnimatedGroup>
        )}
      </section>

      {/* Decorative elements minimal for light theme */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-full pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  )
}
