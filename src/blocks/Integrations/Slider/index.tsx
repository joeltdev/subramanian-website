'use client'
import React from 'react'

import type { IntegrationsBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { LogoIcon } from '@/components/logo'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { cn } from '@/utilities/ui'

const SliderCard = ({
  children,
  className,
  isCenter = false,
}: {
  children: React.ReactNode
  className?: string
  isCenter?: boolean
}) => (
  <div className={cn('bg-background relative z-20 flex size-12 rounded-full border', className)}>
    <div className={cn('m-auto size-fit *:size-5', isCenter && '*:size-8')}>{children}</div>
  </div>
)

export const SliderIntegrations: React.FC<IntegrationsBlock> = ({
  intro,
  integrations,
  centerLogo,
  links,
}) => {
  const items = Array.isArray(integrations) ? integrations : []
  const ctaLink = Array.isArray(links) && links.length > 0 ? links[0]?.link : null

  return (
    <section className="bg-muted py-16 md:py-32 dark:bg-background">
      <div className="mx-auto max-w-5xl px-6">
          <div className="bg-muted/25 group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md">
            <div
              role="presentation"
              className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"
            />

            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10}>
                {items.map(({ id, logo }) => (
                  <SliderCard key={id}>
                    {typeof logo === 'object' && logo && (
                      <Media resource={logo} imgClassName="size-5 object-contain" />
                    )}
                  </SliderCard>
                ))}
              </InfiniteSlider>
            </div>

            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10} reverse>
                {items.map(({ id, logo }) => (
                  <SliderCard key={id}>
                    {typeof logo === 'object' && logo && (
                      <Media resource={logo} imgClassName="size-5 object-contain" />
                    )}
                  </SliderCard>
                ))}
              </InfiniteSlider>
            </div>

            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10}>
                {items.map(({ id, logo }) => (
                  <SliderCard key={id}>
                    {typeof logo === 'object' && logo && (
                      <Media resource={logo} imgClassName="size-5 object-contain" />
                    )}
                  </SliderCard>
                ))}
              </InfiniteSlider>
            </div>

            <div className="absolute inset-0 m-auto flex size-fit justify-center gap-2">
              <SliderCard
                className="shadow-black-950/10 size-16 bg-white/25 shadow-xl backdrop-blur-md backdrop-grayscale dark:border-white/10 dark:shadow-white/15"
                isCenter>
                {typeof centerLogo === 'object' && centerLogo ? (
                  <Media resource={centerLogo} imgClassName="size-8 object-contain" />
                ) : (
                  <LogoIcon />
                )}
              </SliderCard>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
            {intro && <RichText data={intro} enableGutter={false} />}
            {ctaLink && <CMSLink {...ctaLink} appearance="outline" size="sm" />}
          </div>
      </div>
    </section>
  )
}
