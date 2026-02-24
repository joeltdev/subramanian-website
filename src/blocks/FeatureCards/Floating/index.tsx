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

export const FloatingFeatureCards: React.FC<FeatureCardsBlock> = ({ intro, items }) => {
  return (
    <section className="py-16 md:py-32">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          {intro && <RichText data={intro} enableGutter={false} />}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]">
            {items.map(({ id, icon, title, description }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <Card key={id} className="group border-0 shadow-none">
                  <CardHeader className="pb-3">
                    <CardDecorator>
                      {Icon && <Icon className="size-6" aria-hidden />}
                    </CardDecorator>
                    {title && <h3 className="mt-6 font-medium">{title}</h3>}
                  </CardHeader>
                  {description && (
                    <CardContent>
                      <RichText data={description} enableGutter={false} />
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
