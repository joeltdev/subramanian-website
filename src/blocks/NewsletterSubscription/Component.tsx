'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { NewsletterSubscriptionBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

export const NewsletterSubscriptionBlockComponent: React.FC<NewsletterSubscriptionBlock> = ({
  badge,
  intro,
  submitButtonLabel = 'Subscribe',
  formActionUrl,
  image,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const hasImage = typeof image === 'object' && image

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-24">
      <div
        className={
          hasImage
            ? 'grid w-full grid-cols-1 gap-0 md:grid-cols-2 md:gap-0'
            : 'grid w-full grid-cols-1 gap-0'
        }
      >
        {/* Left: data-section-theme="dark" → design guide §1.2: dark = neutral-950 bg, light text; used so this block doesn’t stand out vs brand (bright blue) */}
        <div
          data-section-theme="dark"
          className="flex flex-col justify-center bg-background px-6 py-12 text-foreground md:py-24 md:px-10 lg:px-14"
        >
          {/* Content block sits toward the right, but is left-aligned on small screens and right-aligned on md+ (when image shows) */}
          <motion.div
            className="ml-auto flex w-full max-w-[620px] flex-col items-start gap-3 text-left md:items-end md:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {badge && (
              <span className="type-body-md text-foreground uppercase tracking-wide md:text-lg">
                {badge}
              </span>
            )}
            {intro && (
              <RichText
                data={intro}
                enableGutter={false}
                enableProse={false}
                disableTextAlign
                className="w-full text-left md:text-right [&_h1]:w-full [&_h1]:text-left md:[&_h1]:text-right [&_h2]:w-full [&_h2]:text-left md:[&_h2]:text-right [&_h2]:type-headline-1 [&_h2]:font-semibold [&_h2]:text-type-heading [&_h2]:leading-tight [&_h3]:w-full [&_h3]:text-left md:[&_h3]:text-right [&_h3]:type-headline-2 [&_h3]:font-semibold [&_h3]:text-type-heading [&_p]:w-full [&_p]:text-left md:[&_p]:text-right [&_p]:type-body-xl [&_p]:text-type-secondary"
              />
            )}
            <form
              action={formActionUrl || undefined}
              method="post"
              className="mt-1 flex w-full max-w-[500px] flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-3"
              onSubmit={(e) => {
                if (!formActionUrl) e.preventDefault()
              }}
            >
              <input type="hidden" name="form" value="newsletter" />
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                className={cn(
                  'min-w-0 flex-1 rounded-none border border-border bg-muted text-foreground placeholder:text-muted-foreground',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'h-10 sm:h-12 md:h-12',
                )}
              />
              <Button
                type="submit"
                variant="default"
                size="lg"
                className={cn(
                  'flex-none rounded-none bg-foreground hover:bg-foreground/90',
                  'h-10 sm:h-12 md:h-12 min-w-0 px-4 md:px-5',
                  'text-type-inverse',
                )}
              >
                {submitButtonLabel}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Right: image */}
        {hasImage && (
          <motion.div
            className="relative hidden aspect-4/3 min-h-[240px] overflow-hidden md:block md:aspect-auto md:min-h-[380px]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <Media
              resource={image}
              fill
              imgClassName="object-cover object-center"
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
