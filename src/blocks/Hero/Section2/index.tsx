'use client'
import React from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { AnimatedGroup } from '@/components/ui/animated-group'
import type { Variants } from 'motion/react'

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

export const Section2Hero: React.FC<Page['hero']> = ({ links, mediaPreview, richText }) => {
  return (
    <div className="overflow-hidden">
      {/* Decorative gradients */}
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden contain-strict lg:block">
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      <section>
        <div className="relative pt-24">
          <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />

          <div className="mx-auto max-w-7xl px-6">
            <div className="sm:mx-auto lg:mr-auto lg:mt-0">
              {/* Rich text content — left aligned */}
              {richText && (
                <AnimatedGroup
                  variants={transitionVariants}
                  className="mt-8 max-w-2xl lg:mt-16">
                  <RichText
                    data={richText}
                    enableGutter={false}
                    className="text-balance [&_h1]:text-5xl [&_h1]:font-medium [&_h1]:md:text-6xl [&_p]:mt-8 [&_p]:max-w-2xl [&_p]:text-pretty [&_p]:text-lg"
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
                  className="mt-12 flex items-center gap-2">
                  {links.map(({ link }, i) => (
                    <div
                      key={i}
                      className={
                        i === 0
                          ? 'bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5'
                          : undefined
                      }>
                      <CMSLink
                        {...link}
                        className={
                          i === 0
                            ? 'rounded-xl px-5 text-base'
                            : 'h-10.5 rounded-xl px-5 text-base'
                        }
                      />
                    </div>
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
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Media
                    className="aspect-15/8 relative rounded-2xl"
                    imgClassName="rounded-2xl"
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
