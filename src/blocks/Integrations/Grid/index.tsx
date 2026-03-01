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
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
          {intro && (
            <div className="text-center">
              <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-1 [&_h2]:text-type-body [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:leading-snug" />
            </div>
          )}

          {Array.isArray(integrations) && integrations.length > 0 && (
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map(({ id, logo, richText, link }) => (
                <Card key={id} className="p-6">
                  <div className="relative">
                    {typeof logo === 'object' && logo && (
                      <div className="size-10">
                        <Media resource={logo} imgClassName="size-10 object-contain" />
                      </div>
                    )}

                    {richText && (
                      <div className="py-6">
                        <RichText data={richText} enableGutter={false} className="[&_h3]:type-title-sm [&_h3]:text-type-body [&_p]:type-body-sm [&_p]:text-type-secondary [&_p]:leading-relaxed" />
                      </div>
                    )}

                    {link?.url || (link?.type === 'reference' && link?.reference) ? (
                      <div className="flex gap-3 border-t border-dashed pt-6">
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          className="gap-1 pr-2 shadow-none">
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
