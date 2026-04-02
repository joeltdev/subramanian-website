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
      <section>
        <div className="relative flex min-h-[85svh] flex-col justify-end pb-24 pt-12 md:min-h-0 md:justify-center md:py-32">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
          />

          <div className="mx-auto max-w-7xl px-6 md:px-8 w-full order-2 md:order-1 relative z-10 -mt-24 md:mt-0">
            <div className="bg-background md:bg-transparent p-6 sm:p-8 md:p-0 shadow-2xl shadow-zinc-950/20 md:shadow-none border border-border/50 md:border-transparent text-center sm:mx-auto lg:mr-auto lg:mt-0 relative">
              {/* Badge */}
              {badgeLabel && (
                <AnimatedGroup variants={transitionVariants}>
                  <div className="hover:bg-background dark:hover:border-t-border bg-muted mx-auto flex w-fit items-center gap-4 rounded-none border p-1 pl-4 transition-colors duration-300 dark:border-t-white/5">
                    <span className="text-foreground text-sm font-bold uppercase tracking-widest">{badgeLabel}</span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-border" />
                    <div className="bg-background size-6 overflow-hidden rounded-none">
                      <ArrowRight className="m-auto size-3 translate-y-1/3" />
                    </div>
                  </div>
                </AnimatedGroup>
              )}

              {/* Rich text content */}
              {richText && (
                <AnimatedGroup
                  variants={transitionVariants}
                  className="mx-auto mt-12 max-w-4xl">
                  <RichText
                    data={richText}
                    enableGutter={false}
                    className="text-balance [&_h1]:type-display [&_h1]:font-black [&_h1]:break-words [&_p]:mt-8 [&_p]:max-w-2xl [&_p]:mx-auto [&_p]:type-body-xl md:[&_p]:type-body-2xl md:[&_h1]:translate-y-4 lg:[&_h1]:-translate-y-5"
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
                      size="default"
                      className="group flex justify-center items-center rounded-none bg-foreground text-background transition-all duration-300 active:scale-[0.98] px-10 py-5 md:py-7 md:px-16 type-label-lg hover:bg-brand-600 hover:text-white"
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
