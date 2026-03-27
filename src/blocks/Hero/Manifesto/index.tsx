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
          <h1 className={`m-0 font-extrabold tracking-tight drop-shadow-xl ${isMalayalam ? 'leading-[1.3] py-2 font-malayalam' : 'leading-tight'}`}>
            <span className="type-display text-foreground text-balance">
              {text}
            </span>
          </h1>
        )
      }
      return null
    }
  }), [])

  return (
    <div className="relative overflow-x-clip" data-theme="dark">
      {/* Background Media — Full Width, Full Height */}
      <section className="relative flex flex-col items-center flex-1 text-center w-full md:min-h-[90svh]">
        {hasBgMedia && (
          <div className="relative w-full h-[60svh] md:absolute md:inset-0 md:size-full md:-z-20 md:overflow-hidden">
            {/* Desktop Video */}
            {backgroundVideo && typeof backgroundVideo === 'object' && backgroundVideo.url && (
              <video
                className={`absolute inset-0 size-full object-cover object-top md:object-center ${mobileBackgroundVideo || mobileBackgroundImage ? 'hidden md:block' : 'block'}`}
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
                className={`absolute inset-0 size-full object-cover object-top md:object-center ${mobileBackgroundVideo || mobileBackgroundImage ? 'hidden md:block' : 'block'} ${backgroundVideo ? 'opacity-0' : 'opacity-100'}`}
                src={(backgroundImage as Media).url!}
                alt={(backgroundImage as Media).alt ?? ''}
                aria-hidden
              />
            )}

            {/* Mobile Video */}
            {mobileBackgroundVideo && typeof mobileBackgroundVideo === 'object' && mobileBackgroundVideo.url && (
              <video
                className="absolute inset-0 size-full object-cover object-top md:hidden block"
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
                className={`absolute inset-0 size-full object-cover object-top md:hidden block ${mobileBackgroundVideo ? 'opacity-0' : 'opacity-100'}`}
                src={(mobileBackgroundImage as Media).url!}
                alt={(mobileBackgroundImage as Media).alt ?? ''}
                aria-hidden
              />
            )}
            {/* Scrim Overlay Desktop */}
            <div className="hidden md:block absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent backdrop-grayscale-[0.1]" aria-hidden />

            {/* Mobile Title Overlay flush to the bottom of the image */}
            <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 pt-24 pb-6 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col md:hidden z-10 text-left pointer-events-none">
              {badgeLabel && (
                <AnimatedGroup variants={transitionVariants}>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md pointer-events-auto">
                    <span className="text-white/90 text-[10px] font-semibold uppercase tracking-widest">{badgeLabel}</span>
                    <div className="bg-brand-500 rounded-full p-0.5">
                      <ArrowRight className="size-2 text-white" />
                    </div>
                  </div>
                </AnimatedGroup>
              )}
              {richText && (
                <AnimatedGroup variants={transitionVariants} className="w-full pointer-events-auto">
                  <RichText
                    data={richText}
                    enableGutter={false}
                    converters={heroConverters}
                    className={`text-left text-balance [&_p]:hidden [&_h1_*]:!text-brand-300 [&_h1]:!drop-shadow-lg [&_h2]:type-display [&_h2]:!text-brand-300 [&_h2]:mb-0 ${isMalayalamContent ? 'font-malayalam' : ''}`}
                  />
                </AnimatedGroup>
              )}
            </div>
          </div>
        )}

        {/* Backdrop for no-media case */}
        {!hasBgMedia && (
          <div className="relative w-full h-[60svh] md:absolute md:inset-0 md:-z-20 bg-background" aria-hidden>
             <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_10%,var(--color-brand-950)_0%,var(--color-background)_60%)] opacity-30" />
             
             {/* Mobile Title Overlay for NO-MEDIA fallback */}
             <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 pt-24 pb-6 bg-linear-to-t from-brand-950/90 via-brand-950/40 to-transparent flex flex-col md:hidden z-10 text-left">
              {badgeLabel && (
                <AnimatedGroup variants={transitionVariants}>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
                    <span className="text-white/90 text-[10px] font-semibold uppercase tracking-widest">{badgeLabel}</span>
                    <div className="bg-brand-500 rounded-full p-0.5">
                      <ArrowRight className="size-2 text-white" />
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
                    className={`text-left text-balance [&_p]:hidden [&_h1_*]:!text-brand-300 [&_h1]:!drop-shadow-lg [&_h2]:type-display [&_h2]:!text-brand-300 [&_h2]:mb-0 ${isMalayalamContent ? 'font-malayalam' : ''}`}
                  />
                </AnimatedGroup>
              )}
            </div>
          </div>
        )}

        {/* === MOBILE CONTAINER (White card below image just for text/button) === */}
        <div className="flex md:hidden w-full px-4 sm:px-6 flex-col relative z-20 pb-12 pt-6 bg-white shrink-0 text-left shadow-[0_-15px_40px_rgba(0,0,0,0.15)]">
            {richText && (
              <AnimatedGroup variants={transitionVariants} className="w-full">
                <RichText
                  data={richText}
                  enableGutter={false}
                  converters={heroConverters}
                  className={`text-left [&_h1]:hidden [&_h2]:hidden [&_p]:mt-0 [&_p]:max-w-3xl [&_p]:mx-0 [&_p]:type-body-lg [&_p]:font-medium [&_p]:!text-slate-800 [&_p]:leading-relaxed [&_p]:!drop-shadow-none ${isMalayalamContent ? 'font-malayalam' : ''}`}
                />
              </AnimatedGroup>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <AnimatedGroup
                variants={{
                  container: { visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } },
                  ...transitionVariants,
                }}
                className="mt-6 w-full max-w-xl mx-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-start gap-4 w-full">
                  {links.map(({ link }, i) => (
                    <CMSLink
                      key={i}
                      {...link}
                      size="lg"
                      className="group flex justify-center rounded-none uppercase font-bold tracking-widest transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] border-none bg-brand-500 text-white hover:bg-brand-400 w-full h-[60px] items-center px-8 type-title-md"
                    >
                      <ArrowRight className="transition-transform group-hover:translate-x-1.5 shrink-0 ml-3 size-5" />
                    </CMSLink>
                  ))}
                </div>
              </AnimatedGroup>
            )}
        </div>

        {/* === DESKTOP CONTAINER (Centered as requested) === */}
        <div className="hidden md:flex container mx-auto px-8 w-full flex-1 flex-col justify-center py-32 relative z-10">
          <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
            {badgeLabel && (
              <AnimatedGroup variants={transitionVariants}>
                <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md transition-all hover:bg-white/10">
                  <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">{badgeLabel}</span>
                  <div className="bg-brand-500 rounded-full p-0.5">
                    <ArrowRight className="size-3 text-white" />
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
                  className={`text-balance [&_h2]:type-display [&_h2]:text-foreground/90 [&_h2]:mb-8 [&_p]:mt-10 [&_p]:max-w-3xl [&_p]:mx-auto [&_p]:type-body-xl [&_p]:font-medium [&_p]:text-foreground/90 [&_p]:leading-relaxed [&_p]:drop-shadow-sm ${isMalayalamContent ? 'font-malayalam' : ''}`}
                />
              </AnimatedGroup>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <AnimatedGroup
                variants={{
                  container: { visible: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } } },
                  ...transitionVariants,
                }}
                className="mt-12 w-full max-w-3xl mx-auto">
                <div className="flex flex-row items-center justify-center gap-6 w-full">
                  {links.map(({ link }, i) => (
                    <CMSLink
                      key={i}
                      {...link}
                      size="lg"
                      className="group flex-1 justify-center rounded-full uppercase font-bold tracking-widest transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] border-none bg-brand-500 text-white hover:bg-brand-400 h-[56px] min-w-[220px] lg:h-[52px] lg:min-w-[260px] lg:type-title-sm"
                    >
                      <ArrowRight className="transition-transform group-hover:translate-x-1.5 shrink-0 ml-3 size-4" />
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
            className="mt-20 w-full max-w-6xl px-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-brand-500/20 rounded-none blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-500"></div>
              <div className="relative bg-background border border-border/50 shadow-2xl overflow-hidden ring-1 ring-white/10">
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

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-full pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  )
}
