import React from 'react'

import type { IntegrationsBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { LogoIcon } from '@/components/logo'
import { cn } from '@/utilities/ui'

const TileCard = ({
  children,
  className,
  borderClassName,
}: {
  children: React.ReactNode
  className?: string
  borderClassName?: string
}) => (
  <div className={cn('bg-background relative flex size-20 rounded-xl dark:bg-transparent', className)}>
    <div
      role="presentation"
      className={cn('absolute inset-0 rounded-xl border border-black/20 dark:border-white/25', borderClassName)}
    />
    <div className="relative z-20 m-auto size-fit *:size-8">{children}</div>
  </div>
)

export const TilesIntegrations: React.FC<IntegrationsBlock> = ({
  intro,
  integrations,
  centerLogo,
  links,
}) => {
  const firstRow = Array.isArray(integrations) ? integrations.slice(0, 2) : []
  const middleRow = Array.isArray(integrations) ? integrations.slice(2, 4) : []
  const lastRow = Array.isArray(integrations) ? integrations.slice(4, 6) : []

  const ctaLink = Array.isArray(links) && links.length > 0 ? links[0]?.link : null

  return (
    <section className="bg-muted py-16 md:py-32 dark:bg-background">
      <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center sm:grid-cols-2">
            <div className="dark:bg-muted/50 relative mx-auto w-fit">
              <div
                aria-hidden
                className="bg-radial to-muted dark:to-background absolute inset-0 z-10 from-transparent to-75%"
              />
              <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
                {firstRow.map(({ id, logo }) => (
                  <TileCard key={id}>
                    {typeof logo === 'object' && logo && (
                      <Media resource={logo} imgClassName="size-8 object-contain" />
                    )}
                  </TileCard>
                ))}
              </div>
              <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                {middleRow[0] && (
                  <TileCard key={middleRow[0].id}>
                    {typeof middleRow[0].logo === 'object' && middleRow[0].logo && (
                      <Media resource={middleRow[0].logo} imgClassName="size-8 object-contain" />
                    )}
                  </TileCard>
                )}
                <TileCard
                  borderClassName="shadow-black-950/10 shadow-xl border-black/25 dark:border-white/25"
                  className="dark:bg-white/10">
                  {typeof centerLogo === 'object' && centerLogo ? (
                    <Media resource={centerLogo} imgClassName="size-8 object-contain" />
                  ) : (
                    <LogoIcon />
                  )}
                </TileCard>
                {middleRow[1] && (
                  <TileCard key={middleRow[1].id}>
                    {typeof middleRow[1].logo === 'object' && middleRow[1].logo && (
                      <Media resource={middleRow[1].logo} imgClassName="size-8 object-contain" />
                    )}
                  </TileCard>
                )}
              </div>
              <div className="mx-auto flex w-fit justify-center gap-2">
                {lastRow.map(({ id, logo }) => (
                  <TileCard key={id}>
                    {typeof logo === 'object' && logo && (
                      <Media resource={logo} imgClassName="size-8 object-contain" />
                    )}
                  </TileCard>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-6 max-w-lg space-y-6 text-center sm:mt-0 sm:text-left">
              {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:text-5xl [&_h2]:text-slate-700 [&_h2]:leading-[1.1] [&_h2]:font-semibold [&_h2]:mb-6 [&_h3]:text-3xl [&_h3]:text-slate-700 [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-slate-600 [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light" />}
              {ctaLink && <CMSLink {...ctaLink} appearance="outline" size="sm" />}
            </div>
          </div>
      </div>
    </section>
  )
}
