import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { FeatureCardsBlock } from '@/payload-types'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
)

export const OutlinedFeatureCards: React.FC<FeatureCardsBlock> = ({ intro, items }) => {
  return (
    <section className="bg-muted py-16 md:py-32 dark:bg-transparent">
      <div className="@container relative z-10 mx-auto max-w-5xl px-6">
        <div className="text-center mx-auto max-w-2xl">
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-1 [&_h2]:text-type-body [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <Card className="bg-background @min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
            {items.map(({ id, icon, richText }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <div key={id} className="group shadow-zinc-950/5">
                  <CardHeader className="pb-3">
                    <CardDecorator>
                      {Icon && <Icon className="size-6 text-slate-500" aria-hidden />}
                    </CardDecorator>
                  </CardHeader>
                  {richText && (
                    <CardContent>
                      <RichText data={richText} enableGutter={false} className="[&_h3]:type-title-lg [&_h3]:text-type-body [&_p]:type-body-sm [&_p]:text-type-secondary [&_p]:leading-relaxed" />
                    </CardContent>
                  )}
                </div>
              )
            })}
          </Card>
        )}
      </div>
    </section>
  )
}
