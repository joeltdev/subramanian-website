import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { FeatureCardsBlock } from '@/payload-types'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-foreground)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
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
    <section className="py-4 md:py-8 bg-accent">
      <div className="@container relative z-10 mx-auto max-w-5xl px-6">
        <div className="text-center mx-auto max-w-4xl">
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-2 [&_h2]:text-type-heading [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-body [&_p]:type-body-xl [&_p]:leading-snug [&_p]:mx-auto [&_p]:w-[80%]" />}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-background)] [--color-card:var(--color-background)] *:text-center md:mt-16 ">
            {items.map(({ id, icon, richText }) => {
              const Icon = icon ? iconMap[icon] : null
              return (
                <Card key={id} className="bg-background border group shadow-sm shadow-black/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardDecorator>
                      {Icon && <Icon className="size-8 text-muted-foreground" aria-hidden />}
                    </CardDecorator>
                  </CardHeader>
                  {richText && (
                    <CardContent>
                      <RichText data={richText} enableGutter={false} className="[&_h3]:type-title-lg [&_h3]:text-type-body [&_p]:type-body-sm [&_p]:text-type-secondary [&_p]:leading-relaxed" />
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
