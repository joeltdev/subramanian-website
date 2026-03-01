import React from 'react'
import type { TestimonialsBlock as TestimonialsBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

function getInitials(name?: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const TestimonialsBlock: React.FC<
  TestimonialsBlockType & { disableInnerContainer?: boolean }
> = ({ intro, testimonials }) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        {intro && (
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
            <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-1 [&_h2]:text-type-body [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />
          </div>
        )}

        {Array.isArray(testimonials) && testimonials.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
            {testimonials.map(({ id, logo, richText, author, role, avatar }, index) => {
              const isFeature = index === 0

              return (
                <Card
                  key={id}
                  className={
                    isFeature
                      ? 'grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2'
                      : index === 1
                        ? 'md:col-span-2'
                        : undefined
                  }>
                  {isFeature && typeof logo === 'object' && logo && (
                    <CardHeader>
                      <Media resource={logo} imgClassName="h-6 w-fit dark:invert" />
                    </CardHeader>
                  )}

                  <CardContent className={isFeature ? undefined : 'h-full pt-6'}>
                    <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                      {richText && (
                        <RichText
                          data={richText}
                          enableGutter={false}
                          className={isFeature ? '[&_p]:type-body-xl [&_p]:text-type-body [&_p]:leading-snug' : '[&_p]:type-body-sm [&_p]:text-type-secondary [&_p]:leading-relaxed'}
                        />
                      )}

                      <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                        <Avatar className="size-12">
                          {typeof avatar === 'object' && avatar && (
                            <Media
                              resource={avatar}
                              imgClassName="aspect-square h-full w-full object-cover"
                            />
                          )}
                          <AvatarFallback>{getInitials(author)}</AvatarFallback>
                        </Avatar>

                        <div>
                          {author && <cite className="block type-body-sm text-type-body">{author}</cite>}
                          {role && (
                            <span className="block type-body-sm text-type-secondary">{role}</span>
                          )}
                        </div>
                      </div>
                    </blockquote>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
