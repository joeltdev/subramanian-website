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
}

export const ManifestoHero: React.FC<ManifestoHeroType> = ({
  badgeLabel,
  backgroundVideo,
  backgroundImage,
  links,
  mediaPreview,
  richText,
}) => {
  const hasBgMedia =
    (backgroundVideo && typeof backgroundVideo === 'object' && !!backgroundVideo.url) ||
    (backgroundImage && typeof backgroundImage === 'object' && !!(backgroundImage as Media).url)

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
          <h1 className={`m-0 font-extrabold tracking-tight drop-shadow-xl ${isMalayalam ? 'leading-[1.3] py-2' : 'leading-tight'}`}>
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
      <section className="relative min-h-[90svh] flex flex-col justify-center items-center text-center py-24 md:py-32">
        {hasBgMedia && (
          <div className="absolute inset-0 size-full -z-20 overflow-hidden">
            {backgroundVideo && typeof backgroundVideo === 'object' && backgroundVideo.url ? (
              <video
                className="absolute inset-0 size-full object-cover"
                src={backgroundVideo.url}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
            ) : backgroundImage && typeof backgroundImage === 'object' && (backgroundImage as Media).url ? (
              <img
                className="absolute inset-0 size-full object-cover"
                src={(backgroundImage as Media).url!}
                alt={(backgroundImage as Media).alt ?? ''}
                aria-hidden
              />
            ) : null}
            {/* Minimal overlay for text contrast — ONLY if background media exists */}
            <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.2]" aria-hidden />
          </div>
        )}

        {/* Backdrop for no-media case */}
        {!hasBgMedia && (
          <div className="absolute inset-0 -z-20 bg-background" aria-hidden>
             <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_10%,var(--color-brand-950)_0%,var(--color-background)_60%)] opacity-30" />
          </div>
        )}

        <div className="container mx-auto px-6 md:px-8 w-full relative z-10">
          <div className="flex flex-col items-center max-w-5xl mx-auto">
            {/* Badge */}
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

            {/* Content */}
            {richText && (
              <AnimatedGroup
                variants={transitionVariants}
                className="w-full">
                <RichText
                  data={richText}
                  enableGutter={false}
                  converters={heroConverters}
                  className="text-balance [&_h2]:type-display [&_h2]:text-foreground/90 [&_h2]:mb-8 [&_p]:mt-10 [&_p]:max-w-3xl [&_p]:mx-auto [&_p]:type-body-xl [&_p]:font-medium [&_p]:text-foreground/90 [&_p]:leading-relaxed [&_p]:drop-shadow-sm"
                />
              </AnimatedGroup>
            )}

            {/* CTA links - Ultra Modern Premium Design */}
            {Array.isArray(links) && links.length > 0 && (
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.8 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-16 w-full max-w-4xl">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 w-full">
                  {links.map(({ link }, i) => (
                    <CMSLink
                      key={i}
                      {...link}
                      size="xl"
                      className="flex-1 w-full h-20 sm:h-24 justify-center px-8 sm:px-16 min-w-0 sm:min-w-[320px] type-title-lg uppercase tracking-[0.15em] font-bold bg-white text-black hover:bg-brand-500 hover:text-white border-none transition-all duration-500 shadow-2xl shadow-black/20"
                    >
                      <ArrowRight className="transition-transform group-hover:translate-x-2 shrink-0 ml-6 size-6" />
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
