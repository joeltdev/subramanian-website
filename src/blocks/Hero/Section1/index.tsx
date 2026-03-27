'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react'

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

type Section1HeroType = Page['hero'] & { badgeLabel?: string | null }

export const Section1Hero: React.FC<Section1HeroType> = ({
  badgeLabel,
  links,
  mediaPreview,
  richText,
}) => {
  return (
    <div className="overflow-x-clip">
      {/* Decorative gradients */}
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      <section>
        <div className="relative flex min-h-[80svh] flex-col justify-end pb-20 pt-8 md:min-h-0 md:justify-center md:py-2">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
          />

          <div className="mx-auto max-w-7xl px-4 md:px-8 w-full order-2 md:order-1 relative z-10 -mt-24 md:mt-0">
            <div className="bg-background md:bg-transparent p-6 sm:p-8 md:p-0 shadow-2xl shadow-zinc-950/20 md:shadow-none border border-border/50 md:border-transparent text-center sm:mx-auto lg:mr-auto lg:mt-0 relative">
              {/* Badge */}
              {badgeLabel && (
                <AnimatedGroup variants={transitionVariants}>
                  <div className="hover:bg-background dark:hover:border-t-border bg-muted mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                    <span className="text-foreground text-sm">{badgeLabel}</span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-border" />
                    <div className="bg-background size-6 overflow-hidden rounded-full">
                      <ArrowRight className="m-auto size-3 translate-y-1/3" />
                    </div>
                  </div>
                </AnimatedGroup>
              )}

              {/* Rich text content */}
              {richText && (
                <AnimatedGroup
                  variants={transitionVariants}
                  className="mx-auto mt-8 max-w-4xl">
                  <RichText
                    data={richText}
                    enableGutter={false}
                    className="text-balance [&_h1]:type-display [&_p]:mt-4 [&_p]:max-w-2xl [&_p]:mx-auto [&_p]:type-body-xl"
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
                  className="mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
                  {links.map(({ link }, i) => (
                    <CMSLink
                      key={i}
                      {...link}
                      size="lg"
                      className="group shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
                    >
                      <ArrowRight className="transition-transform group-hover:translate-x-1.5" />
                    </CMSLink>
                  ))}
                </AnimatedGroup>
              )}
            </div>
          </div>

          {/* App preview screenshot */}
          {mediaPreview && typeof mediaPreview === 'object' && (
            <AnimatedGroup
              className="order-1 md:order-2 w-full"
              variants={{
                container: {
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.75 },
                  },
                },
                ...transitionVariants,
              }}>
              <div className="mask-b-from-55% relative -mr-56 mt-0 overflow-hidden px-2 sm:mr-0 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-none border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Media
                    className="aspect-[4/5] sm:aspect-video md:aspect-15/8 relative rounded-none"
                    imgClassName="rounded-none object-cover"
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
