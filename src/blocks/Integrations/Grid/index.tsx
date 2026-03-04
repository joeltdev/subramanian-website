import React from 'react'
import { ChevronRight } from 'lucide-react'

import type { IntegrationsBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const GridIntegrations: React.FC<IntegrationsBlock> = ({ intro, integrations }) => {
  return (
    <section className="py-4 md:py-8 bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {intro && (
          <div className="text-center mx-auto max-w-3xl">
            <RichText data={intro} enableGutter={false} className="[&_h2]:mb-6 [&_h3]:mb-4 [&_h2]:text-center [&_h3]:text-center [&_h2]:type-headline-2 [&_h2]:text-type-heading [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_p]:type-body-lg [&_p]:text-type-secondary [&_p]:max-w-2xl [&_p]:mx-auto" />
          </div>
        )}

        {Array.isArray(integrations) && integrations.length > 0 && (
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {integrations.map(({ id, logo, richText, link }) => (
              <Card key={id} className="rounded-xl bg-background p-6 shadow-xs hover:shadow-sm">
                <div className="relative">
                  {typeof logo === 'object' && logo && (
                    <div className="size-10 mb-4">
                      <Media resource={logo} imgClassName="size-10 object-contain rounded-sm" />
                    </div>
                  )}

                  {richText && (
                    <div className="py-2">
                      <RichText data={richText} enableGutter={false} className="[&_h3]:type-title-sm [&_h3]:text-type-body [&_p]:type-body-sm [&_p]:text-type-secondary [&_p]:leading-relaxed" />
                    </div>
                  )}

                  {link?.url || (link?.type === 'reference' && link?.reference) ? (
                    <div className="flex gap-3">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-1 pr-2 shadow-none -translate-x-4 hover:translate-x-0 transition-transform duration-300">
                        <CMSLink {...link} appearance="inline">

                          <ChevronRight className="ml-0 !size-3.5 opacity-50" />
                        </CMSLink>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
